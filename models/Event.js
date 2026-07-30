const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, default: '' },
        location: { type: String, default: '' },
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
