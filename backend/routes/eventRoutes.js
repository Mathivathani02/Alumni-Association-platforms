const express = require('express');
const router = express.Router();
const {
    createEvent, getEvents, getEventById, updateEvent, deleteEvent, registerForEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createEvent);
router.get('/', protect, getEvents);
router.get('/:id', protect, getEventById);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/register', protect, registerForEvent);

module.exports = router;
