const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Attendance = require('../models/attendance.model');

exports.getOverview = async (req, res) => {
    try {
        console.log("User from token:", req.user); // 👈 log this

        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            console.log("❌ tenantId missing from user");
            return res.status(400).json({ message: "Tenant ID missing" });
        }

        const totalStudents = await Student.countDocuments({ tenantId });
        const totalTeachers = await Teacher.countDocuments({ tenantId });
        const attendanceToday = await Attendance.countDocuments({
            tenantId,
            date: new Date().toISOString().split('T')[0],
        });

        console.log("✔ Counts:", { totalStudents, totalTeachers, attendanceToday });

        res.json({
            totalStudents,
            totalTeachers,
            attendanceToday
        });
    } catch (error) {
        console.error('🔥 Overview Error:', error);
        res.status(500).json({ message: 'Failed to load dashboard overview' });
    }
};
