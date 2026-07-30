const express = require('express');
const router = express.Router();
const {
    sendRequest, getConnections, acceptRequest, rejectRequest,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendRequest);
router.get('/', protect, getConnections);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);

module.exports = router;
