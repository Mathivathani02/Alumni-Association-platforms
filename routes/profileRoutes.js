const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    deleteProfile,
    uploadPhoto,
    getProfileById,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.delete('/', protect, deleteProfile);
router.put('/photo', protect, upload.single('profilePhoto'), uploadPhoto);
router.get('/:id', protect, getProfileById);

module.exports = router;
