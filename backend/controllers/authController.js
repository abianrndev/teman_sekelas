// const User = require('../models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');

// // Register user
// exports.register = async(req, res) => {
//     try {
//         const { name, email, password, classCode } = req.body;

//         if (!name || !email || !password || !classCode) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are required'
//             });
//         }

//         const existingUser = await User.findByEmail(email);
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email already exists'
//             });
//         }

//         const userId = await User.create({ name, email, password, classCode });
//         const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

//         res.status(201).json({
//             success: true,
//             token,
//             user: { id: userId, name, email, classCode }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Registration failed',
//             error: error.message
//         });
//     }
// };

// // Login user
// exports.login = async(req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email and password are required'
//             });
//         }

//         const user = await User.findByEmail(email);
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials'
//             });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials'
//             });
//         }

//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//         res.json({
//             success: true,
//             token,
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 classCode: user.class_code,
//                 avatar: user.avatar ? `/avatars/${user.avatar}` : null
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Login failed',
//             error: error.message
//         });
//     }
// };

// // Get current user
// exports.getMe = async(req, res) => {
//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         res.json({
//             success: true,
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 classCode: user.class_code,
//                 avatar: user.avatar ? `/avatars/${user.avatar}` : null
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch user',
//             error: error.message
//         });
//     }
// };