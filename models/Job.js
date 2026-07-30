const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        company: { type: String, required: true, trim: true },
        position: { type: String, required: true, trim: true },
        salary: { type: String, default: '' },
        location: { type: String, default: '' },
        description: { type: String, required: true },
        lastDate: { type: Date, required: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
