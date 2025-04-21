const pool = require('../config/database');

class Notification {
	static async create({ userId, summaryId, commentId, type, message }) {
		const [result] = await pool.execute(
			'INSERT INTO notifications (user_id, summary_id, comment_id, type, message) VALUES (?, ?, ?, ?, ?)',
			[userId, summaryId, commentId, type, message]
		);
		return result.insertId;
	}

	static async findByUserId(userId) {
		const [rows] = await pool.execute(
			`SELECT n.*, s.title as summary_title, u.name as sender_name
             FROM notifications n
             LEFT JOIN summaries s ON n.summary_id = s.id
             LEFT JOIN users u ON n.user_id = u.id
             WHERE n.user_id = ?
             ORDER BY n.created_at DESC`,
			[userId]
		);
		return rows;
	}

	static async markAsRead(notificationId) {
		await pool.execute(
			'UPDATE notifications SET is_read = TRUE WHERE id = ?',
			[notificationId]
		);
	}

	static async markAllAsRead(userId) {
		await pool.execute(
			'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
			[userId]
		);
	}

	static async getUnreadCount(userId) {
		const [rows] = await pool.execute(
			'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
			[userId]
		);
		return rows[0].count;
	}
}

module.exports = Notification; 