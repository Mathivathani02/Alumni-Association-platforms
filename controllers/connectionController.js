const Connection = require('../models/Connection');

// @desc    Send connection request
// @route   POST /api/connections
const sendRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;
        if (!recipientId) return res.status(400).json({ message: 'recipientId is required' });
        if (recipientId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot send a connection request to yourself' });
        }

        const existing = await Connection.findOne({
            $or: [
                { requester: req.user._id, recipient: recipientId },
                { requester: recipientId, recipient: req.user._id },
            ],
        });
        if (existing) return res.status(400).json({ message: 'Connection request already exists' });

        const connection = await Connection.create({ requester: req.user._id, recipient: recipientId });
        res.status(201).json(connection);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all connections/requests involving the logged-in user
// @route   GET /api/connections
const getConnections = async (req, res) => {
    try {
        const { status } = req.query;
        const query = {
            $or: [{ requester: req.user._id }, { recipient: req.user._id }],
        };
        if (status) query.status = status;

        const connections = await Connection.find(query)
            .populate('requester', 'fullName email department currentCompany profilePhoto')
            .populate('recipient', 'fullName email department currentCompany profilePhoto')
            .sort({ createdAt: -1 });

        res.status(200).json(connections);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Accept a connection request
// @route   PUT /api/connections/:id/accept
const acceptRequest = async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.id);
        if (!connection) return res.status(404).json({ message: 'Connection request not found' });
        if (connection.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to accept this request' });
        }
        connection.status = 'accepted';
        await connection.save();
        res.status(200).json(connection);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reject a connection request
// @route   PUT /api/connections/:id/reject
const rejectRequest = async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.id);
        if (!connection) return res.status(404).json({ message: 'Connection request not found' });
        if (connection.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to reject this request' });
        }
        connection.status = 'rejected';
        await connection.save();
        res.status(200).json(connection);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { sendRequest, getConnections, acceptRequest, rejectRequest };
