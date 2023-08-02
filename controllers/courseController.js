// internal imports
const Course = require("../models/Course");
const User = require("../models/User");

// course controller object
const courseController = {};

// create course
courseController.createCourse = async (req, res) => {
  try {
    const { name, teacherId, code, photo, autoEnroll } = req.body;

    if (
      !name ||
      !teacherId ||
      !code ||
      !photo ||
      !typeof autoEnroll === "boolean"
    ) {
      res.status(422).send({
        message: "Please send all data properly",
        isSuccess: false,
      });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher) {
      res.status(422).send({
        message: "Teacher does not exist",
        isSuccess: false,
      });
    }

    if (
      autoEnroll ||
      (teacher.selectedPlan === "premium" && teacher.endDate > new Date())
    ) {
      console.log(req.body);
      const course = new Course({
        name: name,
        teacher: teacherId,
        code: code,
        photo: photo,
        autoEnroll: autoEnroll,
      });

      console.log(course);

      const newCourse = await course.save();

      // Update the user's courses array
      teacher.courses.push(newCourse._id);
      await teacher.save();
      console.log(teacher);

      res.status(200).send({
        message: "course created successfully",
        isSuccess: true,
        data: newCourse,
      });
    } else {
      res.status(402).send({
        message: "Please update your package to disable auto entollment",
        isSuccess: false,
      });
    }
  } catch (error) {
    res.status(error.code || 500).send({
      message: error.message || `Something went wrong`,
      isSuccess: false,
    });
  }
};

// get courses
courseController.getCourses = async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const user = await User.findOne({ email: userEmail })
      .select("courses")
      .populate("courses", "name photo")
      .exec();

    if (!user) {
      res.status(404).send({
        message: `User not found`,
        isSuccess: false,
      });
    }

    res.status(200).send({
      message: `Courses retrieved successfully`,
      isSuccess: true,
      data: user.courses,
    });
  } catch (error) {
    res.status(error.code || 500).send({
      message: error.message || `Something went wrong`,
      isSuccess: false,
    });
  }
};

// check if course code is available or not
courseController.isCodeAvailable = async (req, res) => {
  try {
    const code = req.params.code;
    console.log({ code });

    const existingCourse = await Course.findOne({ code });
    console.log(existingCourse);

    if (existingCourse) {
      res.status(200).send({
        message: `Code is not available`,
        isSuccess: true,
        available: false,
      });
    } else {
      res.status(200).send({
        message: `Code is available`,
        isSuccess: true,
        available: true,
      });
    }
  } catch (error) {
    res.status(error.code || 500).send({
      message: error.message || `Something went wrong`,
      isSuccess: false,
    });
  }
};

// Enroll new course
courseController.enrollCourse = async (req, res) => {
  try {
    const { courseCode, studentId } = req.body;

    // Find the course by the given course code
    const course = await Course.findOne({ code: courseCode })
      .populate("teacher", "selectedPlan endDate")
      .exec();

    if (!course) {
      return res.status(404).send({
        message: `Course does not exist.`,
        isSuccess: false,
      });
    }

    // Check if the student is blocked from the course
    if (course.blockedStudents.includes(studentId)) {
      return res.status(403).send({
        message: `You are blocked from the course.`,
        isSuccess: false,
      });
    }

    // Check if the student is already enrolled in the course
    if (course.students.includes(studentId)) {
      return res.status(409).send({
        message: `You are already enrolled in this course.`,
        isSuccess: false,
      });
    }

    // Check if the student already has a pending enrollment request for the course
    if (course.pendingStudents.includes(studentId)) {
      return res.status(409).send({
        message: `You already have a pending enrollment request for this course.`,
        isSuccess: false,
      });
    }

    // Destructure the required teacher data
    const { selectedPlan, endDate } = course.teacher;

    const maxStudentLimit =
      (selectedPlan === "premium" || selectedPlan === "trial") &&
      endDate >= new Date()
        ? 80
        : 40;

    // Check if the course has reached its max student limit
    if (course.students.length >= maxStudentLimit) {
      return res.status(400).send({
        message: `Course has reached its maximum student limit.`,
        isSuccess: false,
      });
    }

    // Check if autoEnroll is enabled or not
    if (course.autoEnroll) {
      // If autoEnroll is enabled, add student to the students array
      course.students.push(studentId);
      await course.save();

      // Update the student's courses array
      const student = await User.findById(studentId);
      student.courses.push(course._id);
      await student.save();

      return res.status(200).send({
        message: `Enrolled successfully!`,
        isSuccess: true,
      });
    } else {
      // If autoEnroll is disabled, add student to the pendingStudents array
      course.pendingStudents.push(studentId);
      await course.save();
      return res.status(200).send({
        message: `Enrollment request sent. Awaiting approval.`,
        isSuccess: true,
      });
    }
  } catch (error) {
    res.status(error.code || 500).send({
      message: error.message || `Something went wrong`,
      isSuccess: false,
    });
  }
};

module.exports = courseController;
