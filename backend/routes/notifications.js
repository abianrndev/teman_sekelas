const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/notification');

// Get all notifications for user
router.get('/', auth, async (req, res) => {
	try {
		const notifications = await Notification.findByUserId(req.user.id);
		res.json(notifications);
	} catch (error) {
		console.error('Error fetching notifications:', error);
		res.status(500).json({ message: 'Error saat mengambil notifikasi' });
	}
});

// Get unread notifications count
router.get('/unread/count', auth, async (req, res) => {
	try {
		const count = await Notification.getUnreadCount(req.user.id);
		res.json({ count });
	} catch (error) {
		console.error('Error fetching unread count:', error);
		res.status(500).json({ message: 'Error saat mengambil jumlah notifikasi belum dibaca' });
	}
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
	try {
		await Notification.markAsRead(req.params.id);
		res.json({ message: 'Notifikasi ditandai sebagai sudah dibaca' });
	} catch (error) {
		console.error('Error marking notification as read:', error);
		res.status(500).json({ message: 'Error saat menandai notifikasi' });
	}
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
	try {
		await Notification.markAllAsRead(req.user.id);
		res.json({ message: 'Semua notifikasi ditandai sebagai sudah dibaca' });
	} catch (error) {
		console.error('Error marking all notifications as read:', error);
		res.status(500).json({ message: 'Error saat menandai semua notifikasi' });
	}
});

module.exports = router; 