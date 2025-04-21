const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			return res.status(401).json({ message: 'Tidak ada token yang diberikan' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(401).json({ message: 'User tidak ditemukan' });
		}

		req.user = user;
		req.token = token;
		next();
	} catch (error) {
		console.error('Auth middleware error:', error);
		res.status(401).json({ message: 'Token tidak valid' });
	}
};

module.exports = auth; 