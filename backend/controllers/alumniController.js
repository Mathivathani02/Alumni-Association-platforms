const User = require('../models/User');

// @desc    Get dashboard-style list of recent alumni + total count
// @route   GET /api/alumni
const getAllAlumni = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await User.countDocuments();
        const alumni = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            alumni,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Search alumni with filters + pagination
// @route   GET /api/search
const searchAlumni = async (req, res) => {
    try {
        const { name, department, graduationYear, company, skills, location, page = 1, limit = 10 } = req.query;

        const query = {};
        if (name) query.fullName = { $regex: name, $options: 'i' };
        if (department) query.department = { $regex: department, $options: 'i' };
        if (graduationYear) query.graduationYear = Number(graduationYear);
        if (company) query.currentCompany = { $regex: company, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };
        if (skills) query.skills = { $in: skills.split(',').map((s) => s.trim()) };

        const skip = (Number(page) - 1) * Number(limit);
        const total = await User.countDocuments(query);
        const results = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            results,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllAlumni, searchAlumni };
