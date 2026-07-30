const express = require('express');
const router = express.Router();
const { getAllAlumni, searchAlumni } = require('../controllers/alumniController');
const { protect } = require('../middleware/authMiddleware');

router.get('/alumni', protect, getAllAlumni);
router.get('/search', protect, searchAlumni);

module.exports = router;
