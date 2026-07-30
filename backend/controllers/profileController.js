const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Profile not found' });

        const fields = [
            'fullName', 'department', 'graduationYear', 'currentCompany',
            'jobRole', 'skills', 'location', 'bio', 'linkedin', 'github',
        ];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) user[field] = req.body[field];
        });

        const updatedUser = await user.save();
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Profile not found' });

        if (user.profilePhoto) {
            const photoPath = path.join(__dirname, '..', 'uploads', path.basename(user.profilePhoto));
            if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
        }
        await user.deleteOne();
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Please upload an image file' });
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Profile not found' });

        if (user.profilePhoto) {
            const oldPath = path.join(__dirname, '..', 'uploads', path.basename(user.profilePhoto));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        user.profilePhoto = `/uploads/${req.file.filename}`;
        await user.save();
        res.status(200).json({ message: 'Profile photo updated', profilePhoto: user.profilePhoto });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single alumni's public profile by ID
// @route   GET /api/profile/:id
const getProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Alumni not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getProfile, updateProfile, deleteProfile, uploadPhoto, getProfileById };
