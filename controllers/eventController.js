const Event = require('../models/Event');

// @desc    Create event
// @route   POST /api/events
const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location } = req.body;
        if (!title || !description || !date) {
            return res.status(400).json({ message: 'Title, description and date are required' });
        }
        const event = await Event.create({
            title, description, date, time, location, organizer: req.user._id,
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all events (upcoming first)
// @route   GET /api/events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'fullName email')
            .sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single event details
// @route   GET /api/events/:id
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'fullName email')
            .populate('registeredUsers', 'fullName email department');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update event (organizer only)
// @route   PUT /api/events/:id
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this event' });
        }

        const fields = ['title', 'description', 'date', 'time', 'location'];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) event[field] = req.body[field];
        });

        const updated = await event.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete event (organizer only)
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }
        await event.deleteOne();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }
        event.registeredUsers.push(req.user._id);
        await event.save();
        res.status(200).json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent, registerForEvent };
