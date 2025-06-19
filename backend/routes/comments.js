const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/comment');

// Create new comment
router.post('/', auth, async (req, res) => {
	try {
		const { content, summaryId } = req.body;

		if (!content || !summaryId) {
			return res.status(400).json({ message: 'Konten dan ID ringkasan harus diisi' });
		}

		const comment = await Comment.create({
			content,
			summaryId,
			userId: req.user.id
		});

		// Ambil komentar yang baru dibuat dengan informasi user
		const newComment = await Comment.findById(comment);

		res.status(201).json(newComment);
	} catch (error) {
		console.error('Error creating comment:', error);
		res.status(500).json({ message: 'Error saat membuat komentar' });
	}
});

// bikin komen baru
router.post('/summary/:summaryId', auth, async (req, res) => {
	try {
		const { content } = req.body;
		const summaryId = req.params.summaryId;

		if (!content) {
			return res.status(400).json({ message: 'Konten harus diisi' });
		}

		const comment = await Comment.create({
			content,
			summaryId,
			userId: req.user.id
		});

		// Ambil komen
		const newComment = await Comment.findById(comment);

		res.status(201).json(newComment);
	} catch (error) {
		console.error('Error creating comment:', error);
		res.status(500).json({ message: 'Error saat membuat komentar' });
	}
});

// Get all comments 
router.get('/summary/:summaryId', auth, async (req, res) => {
	try {
		const comments = await Comment.findBySummaryId(req.params.summaryId);
		res.json(comments);
	} catch (error) {
		console.error('Error fetching comments:', error);
		res.status(500).json({ message: 'Error saat mengambil komentar' });
	}
});

// Update comment
router.put('/:id', auth, async (req, res) => {
	try {
		const { content } = req.body;

		if (!content) {
			return res.status(400).json({ message: 'Konten harus diisi' });
		}

		// Cek apakah komentar milik user yang login
		const comment = await Comment.findById(req.params.id);
		if (!comment) {
			return res.status(404).json({ message: 'Komentar tidak ditemukan' });
		}
		if (comment.user_id !== req.user.id) {
			return res.status(403).json({ message: 'Anda tidak memiliki akses untuk mengedit komentar ini' });
		}

		await Comment.update(req.params.id, content);
		const updatedComment = await Comment.findById(req.params.id);

		res.json(updatedComment);
	} catch (error) {
		console.error('Error updating comment:', error);
		res.status(500).json({ message: 'Error saat mengupdate komentar' });
	}
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
	try {
		// ngecek komentar milik user yang login
		const comment = await Comment.findById(req.params.id);
		if (!comment) {
			return res.status(404).json({ message: 'Komentar tidak ditemukan' });
		}
		if (comment.user_id !== req.user.id) {
			return res.status(403).json({ message: 'Anda tidak memiliki akses untuk menghapus komentar ini' });
		}

		await Comment.delete(req.params.id);
		res.json({ message: 'Komentar berhasil dihapus' });
	} catch (error) {
		console.error('Error deleting comment:', error);
		res.status(500).json({ message: 'Error saat menghapus komentar' });
	}
});

module.exports = router; 