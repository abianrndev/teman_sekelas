const User = require('../models/user');

exports.updateProfile = async(req, res) => {
    try {
        const { name } = req.body;
        await User.update(req.user.id, { name });
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.uploadAvatar = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada file yang diupload'
            });
        }

        const avatarUrl = await User.updateAvatar(req.user.id, req.file.filename);

        res.json({
            success: true,
            avatarUrl,
            message: 'Avatar berhasil diupload!'
        });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Gagal mengupload avatar'
        });
    }
};