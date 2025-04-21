const pool = require('../config/database');

class Summary {
	static async create({ title, course, meetingNumber, description, filePath, userId, classCode }) {
		const [result] = await pool.execute(
			'INSERT INTO summaries (title, course, meeting_number, description, file_path, user_id, class_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[title, course, meetingNumber, description, filePath, userId, classCode]
		);
		return result.insertId;
	}

	static async findAllByClass(classCode) {
		const [rows] = await pool.execute(
			`SELECT s.*, u.name as author_name 
             FROM summaries s 
             JOIN users u ON s.user_id = u.id 
             WHERE s.class_code = ? 
             ORDER BY s.created_at DESC`,
			[classCode]
		);
		return rows;
	}

	static async findById(id) {
		const [rows] = await pool.execute(
			`SELECT s.*, u.name as author_name 
             FROM summaries s 
             JOIN users u ON s.user_id = u.id 
             WHERE s.id = ?`,
			[id]
		);
		return rows[0];
	}

	static async update(id, { title, course, meetingNumber, description }) {
		await pool.execute(
			'UPDATE summaries SET title = ?, course = ?, meeting_number = ?, description = ? WHERE id = ?',
			[title, course, meetingNumber, description, id]
		);
	}

	static async delete(id) {
		await pool.execute('DELETE FROM summaries WHERE id = ?', [id]);
	}
}

module.exports = Summary; 