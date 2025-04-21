const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
	static async create({ name, email, password, classCode }) {
		try {
			console.log('Creating user with data:', { name, email, classCode });

			const hashedPassword = await bcrypt.hash(password, 10);
			console.log('Password hashed successfully');

			const [result] = await pool.execute(
				'INSERT INTO users (name, email, password, class_code) VALUES (?, ?, ?, ?)',
				[name, email, hashedPassword, classCode]
			);

			console.log('User created with ID:', result.insertId);
			return result.insertId;
		} catch (error) {
			console.error('Error in User.create:', error);
			throw error;
		}
	}

	static async findByEmail(email) {
		try {
			console.log('Finding user by email:', email);
			const [rows] = await pool.execute(
				'SELECT * FROM users WHERE email = ?',
				[email]
			);
			return rows[0];
		} catch (error) {
			console.error('Error in User.findByEmail:', error);
			throw error;
		}
	}

	static async findById(id) {
		try {
			console.log('Finding user by ID:', id);
			const [rows] = await pool.execute(
				'SELECT id, name, email, class_code FROM users WHERE id = ?',
				[id]
			);
			return rows[0];
		} catch (error) {
			console.error('Error in User.findById:', error);
			throw error;
		}
	}

	static async getClassMembers(classCode) {
		try {
			console.log('Finding class members for:', classCode);
			const [rows] = await pool.execute(
				'SELECT id, name, email FROM users WHERE class_code = ?',
				[classCode]
			);
			return rows;
		} catch (error) {
			console.error('Error in User.getClassMembers:', error);
			throw error;
		}
	}

	static async update(id, { name }) {
		try {
			await pool.execute(
				'UPDATE users SET name = ? WHERE id = ?',
				[name, id]
			);
		} catch (error) {
			console.error('Error in User.update:', error);
			throw error;
		}
	}
}

module.exports = User; 