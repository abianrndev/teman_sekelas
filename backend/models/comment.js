const pool = require('../config/database');

class Comment {
	static async create({ content, summaryId, userId }) {
		const [result] = await pool.execute(
			'INSERT INTO comments (content, summary_id, user_id) VALUES (?, ?, ?)',
			[content, summaryId, userId]
		);
		return result.insertId;
	}

	static async findById(id) {
		const [rows] = await pool.execute(
			`SELECT c.*, u.name as author_name 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.id = ?`,
			[id]
		);
		return rows[0];
	}

	static async findBySummaryId(summaryId) {
		const [rows] = await pool.execute(
			`SELECT c.*, u.name as author_name 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.summary_id = ? 
             ORDER BY c.created_at DESC`,
			[summaryId]
		);
		return rows;
	}

	static async update(id, content) {
		await pool.execute(
			'UPDATE comments SET content = ? WHERE id = ?',
			[content, id]
		);
	}

	static async delete(id) {
		await pool.execute('DELETE FROM comments WHERE id = ?', [id]);
	}
}

module.exports = Comment; 