const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Summary = require('../models/summary');
const pool = require('../config/database');
const Notification = require('../models/notification');
const Comment = require('../models/comment');

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		const filetypes = /pdf|docx|txt/;
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		if (extname) {
			return cb(null, true);
		}
		cb(new Error('Hanya file PDF, DOCX, dan TXT yang diperbolehkan'));
	}
});

// Create new summary
router.post('/', auth, upload.single('file'), async (req, res) => {
	try {
		console.log('Upload request body:', req.body);
		console.log('Uploaded file:', req.file);

		const { title, course, meetingNumber, description } = req.body;
		const filePath = req.file ? path.join('uploads', req.file.filename) : null;

		const summary = await Summary.create({
			title,
			course,
			meetingNumber,
			description,
			filePath,
			userId: req.user.id,
			classCode: req.user.class_code
		});

		res.status(201).json(summary);
	} catch (error) {
		console.error('Error creating summary:', error);
		res.status(500).json({ message: 'Error saat membuat ringkasan' });
	}
});

// Get all summaries for a class with search and filter
router.get('/class/:classCode', auth, async (req, res) => {
	try {
		const { search, course, sortBy } = req.query;
		let query = `
			SELECT s.*, u.name as author_name 
			FROM summaries s 
			JOIN users u ON s.user_id = u.id 
			WHERE s.class_code = ?
		`;
		const params = [req.params.classCode];

		// Tambahkan filter pencarian
		if (search) {
			query += ' AND (s.title LIKE ? OR s.description LIKE ?)';
			params.push(`%${search}%`, `%${search}%`);
		}

		// Tambahkan filter mata kuliah
		if (course) {
			query += ' AND s.course = ?';
			params.push(course);
		}

		// Tambahkan pengurutan
		if (sortBy) {
			switch (sortBy) {
				case 'newest':
					query += ' ORDER BY s.created_at DESC';
					break;
				case 'oldest':
					query += ' ORDER BY s.created_at ASC';
					break;
				case 'meeting':
					query += ' ORDER BY s.meeting_number ASC';
					break;
				case 'course':
					query += ' ORDER BY s.course ASC';
					break;
			}
		} else {
			query += ' ORDER BY s.created_at DESC';
		}

		const [summaries] = await pool.execute(query, params);
		res.json(summaries);
	} catch (error) {
		console.error('Error fetching summaries:', error);
		res.status(500).json({ message: 'Error saat mengambil daftar ringkasan' });
	}
});

// Get unique courses for a class
router.get('/courses/:classCode', auth, async (req, res) => {
	try {
		const [courses] = await pool.execute(
			'SELECT DISTINCT course FROM summaries WHERE class_code = ? ORDER BY course',
			[req.params.classCode]
		);
		res.json(courses.map(c => c.course));
	} catch (error) {
		console.error('Error fetching courses:', error);
		res.status(500).json({ message: 'Error saat mengambil daftar mata kuliah' });
	}
});

// Get single summary
router.get('/:id', auth, async (req, res) => {
	try {
		const summary = await Summary.findById(req.params.id);
		if (!summary) {
			return res.status(404).json({ message: 'Summary not found' });
		}
		res.json(summary);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching summary' });
	}
});

// Update summary
router.put('/:id', auth, async (req, res) => {
	try {
		const { title, course, meetingNumber, description } = req.body;
		await Summary.update(req.params.id, { title, course, meetingNumber, description });
		res.json({ message: 'Summary updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating summary' });
	}
});

// Delete summary
router.delete('/:id', auth, async (req, res) => {
	try {
		await Summary.delete(req.params.id);
		res.json({ message: 'Summary deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting summary' });
	}
});

// Create comment
router.post('/:id/comments', auth, async (req, res) => {
	try {
		const { content } = req.body;
		if (!content) {
			return res.status(400).json({ message: 'Konten komentar harus diisi' });
		}

		const summary = await Summary.findById(req.params.id);
		if (!summary) {
			return res.status(404).json({ message: 'Ringkasan tidak ditemukan' });
		}

		const comment = await Comment.create({
			content,
			userId: req.user.id,
			summaryId: req.params.id
		});

		// Create notification for summary author
		await Notification.create({
			userId: summary.user_id,
			summaryId: summary.id,
			commentId: comment.id,
			type: 'comment',
			message: `${req.user.name} mengomentari ringkasan Anda: "${summary.title}"`
		});

		res.status(201).json(comment);
	} catch (error) {
		console.error('Error creating comment:', error);
		res.status(500).json({ message: 'Error saat membuat komentar' });
	}
});

module.exports = router; 