const User = require('../models/User');
const Event = require('../models/Event');
const Job = require('../models/Job');

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard
const getDashboardData = async (req, res) => {
    try {
        const totalAlumni = await User.countDocuments();

        const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
            .sort({ date: 1 })
            .limit(5)
            .populate('organizer', 'fullName');

        const latestJobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('postedBy', 'fullName');

        const recentAlumni = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            totalAlumni,
            upcomingEventsCount: await Event.countDocuments({ date: { $gte: new Date() } }),
            latestJobsCount: await Job.countDocuments(),
            upcomingEvents,
            latestJobs,
            recentAlumni,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getDashboardData };
