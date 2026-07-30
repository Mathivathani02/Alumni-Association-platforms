const Job = require('../models/Job');

const createJob = async (req, res) => {
    try {
        const { company, position, salary, location, description, lastDate } = req.body;
        if (!company || !position || !description || !lastDate) {
            return res.status(400).json({ message: 'Company, position, description and last date are required' });
        }
        const job = await Job.create({
            company, position, salary, location, description, lastDate, postedBy: req.user._id,
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'fullName email');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this job' });
        }
        const fields = ['company', 'position', 'salary', 'location', 'description', 'lastDate'];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) job[field] = req.body[field];
        });
        const updated = await job.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }
        await job.deleteOne();
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const applyToJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.applicants.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }
        job.applicants.push(req.user._id);
        await job.save();
        res.status(200).json({ message: 'Applied successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, applyToJob };
