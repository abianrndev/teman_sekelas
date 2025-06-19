const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

// Helper for validation errors
const validateInput = (data) => {
    const errors = [];
    if (!data.name) errors.push('name');
    if (!data.email) errors.push('email');
    if (!data.password) errors.push('password');
    if (!data.classCode) errors.push('classCode');
    return errors;
};

// Register
router.post('/register', async(req, res) => {
    try {
        const { name, email, password, classCode } = req.body;

        const missingFields = validateInput(req.body);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                missingFields
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        if (await User.findByEmail(email)) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const userId = await User.create({ name, email, password, classCode });
        const newUser = await User.findById(userId);
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                classCode: newUser.class_code,
                avatar: newUser.avatar || null
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Login 
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                classCode: user.class_code,
                avatar: user.avatar || null
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Get current user
router.get('/me', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                classCode: user.class_code,
                avatar: user.avatar ? `/uploads/${user.avatar}` : null
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user data',
            error: error.message
        });
    }
});

module.exports = router;