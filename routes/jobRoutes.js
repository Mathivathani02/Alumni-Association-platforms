const express = require('express');
const router = express.Router();
const {
    createJob, getJobs, getJobById, updateJob, deleteJob, applyToJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createJob);
router.get('/', protect, getJobs);
router.get('/:id', protect, getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.post('/:id/apply', protect, applyToJob);

module.exports = router;
