const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
	try {
		console.log('Register request body:', req.body);

		const { name, email, password, classCode } = req.body;

		// Validasi input
		if (!name || !email || !password || !classCode) {
			const missingFields = [];
			if (!name) missingFields.push('name');
			if (!email) missingFields.push('email');
			if (!password) missingFields.push('password');
			if (!classCode) missingFields.push('classCode');

			return res.status(400).json({
				success: false,
				message: 'Semua field harus diisi',
				missingFields,
				received: { name, email, password, classCode }
			});
		}

		// Check if user already exists
		const existingUser = await User.findByEmail(email);
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'Email sudah terdaftar'
			});
		}

		// Create new user
		const userId = await User.create({ name, email, password, classCode });

		// Generate token
		const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

		res.status(201).json({
			success: true,
			token
		});
	} catch (error) {
		console.error('Register error:', error);
		res.status(500).json({
			success: false,
			message: 'Error saat membuat user',
			error: error.message
		});
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user
		const user = await User.findByEmail(email);
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		// Generate token
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

		res.json({ token });
	} catch (error) {
		res.status(500).json({ message: 'Error logging in' });
	}
});

// Get user profile
router.get('/me', async (req, res) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		if (!token) {
			return res.status(401).json({ message: 'No token provided' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching user profile' });
	}
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({ message: 'Nama harus diisi' });
		}

		await User.update(req.user.id, { name });
		const updatedUser = await User.findById(req.user.id);

		res.json(updatedUser);
	} catch (error) {
		console.error('Error updating profile:', error);
		res.status(500).json({ message: 'Error saat mengupdate profil' });
	}
});

module.exports = router; 