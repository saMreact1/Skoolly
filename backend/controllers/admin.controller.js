const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Attendance = require('../models/attendance.model');

exports.getOverview = async (req, res) => {
   try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const today = new Date().toISOString().split('T')[0];
    const attendanceToday = await Attendance.countDocuments({ date: today });

    res.json({
      totalStudents,
      totalTeachers,
      attendanceToday,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getClassCounts = async (req, res) => {
    try {
        const studentCountPerClass = await Student.aggregate([
            {
                $lookup: {
                from: 'classes', // The name of your collection in MongoDB
                localField: 'class', // Field in Student schema that stores class reference
                foreignField: '_id', // Field in Class schema
                as: 'classInfo'
                }
            },
            {
                $unwind: '$classInfo' // Flatten the class info array
            },
            {
                $group: {
                _id: '$classInfo.name', // Group by class name
                count: { $sum: 1 } // Count students in each class
                }
            }
        ]);

        res.status(200).json(studentCountPerClass);
    } catch (error) {
        console.error('Error fetching classwise student count:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}