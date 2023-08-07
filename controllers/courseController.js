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

// get single course
courseController.getSingleCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    // Find the course by its ID and populate the referenced fields
    const course = await Course.findById(courseId)
      .populate("students", "name email") // Populate 'students' field and return only 'name' and 'email'
      .populate("pendingStudents", "name email") // Populate 'pendingStudents' field and return only 'name' and 'email'
      .populate("blockedStudents", "name email"); // Populate 'blockedStudents' field and return only 'name' and 'email'

    if (!course) {
      return res.status(404).send({
        message: `Course not found`,
        isSuccess: false,
        data: course,
      });
    }

    res.status(200).send({
      message: `Course retrieved successfully`,
      isSuccess: true,
      data: course || [],
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

// Approve or reject pending students
courseController.approveOrRejectPendingStudents = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const userId = req.body.userId;
    const action = req.body.action; // 'accept' or 'reject' sent by the teacher

    // Find the course and the user
    const course = await Course.findById(courseId)
      .populate("teacher", "selectedPlan endDate")
      .exec();

    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).send({
        message: "Course or User not found",
        isSuccess: false,
      });
    }

    // Check the teacher's action
    if (action === "accept") {
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

      // Remove the user from the pendingStudents array and push to students array
      const pendingIndex = course.pendingStudents.indexOf(userId);
      if (pendingIndex === -1) {
        return res.status(400).send({
          message: "User is not in the pendingStudents list of this course",
          isSuccess: false,
        });
      }

      course.pendingStudents.splice(pendingIndex, 1);
      course.students.push(userId);

      // Push the courseId to the user's courses array
      user.courses.push(courseId);

      // Save the updated course and user data
      await course.save();
      await user.save();

      return res.status(200).send({
        message: "User enrolled in the course successfully",
        isSuccess: true,
        course: course,
      });
    } else if (action === "reject") {
      // Remove the user from the pendingStudents array
      const pendingIndex = course.pendingStudents.indexOf(userId);
      if (pendingIndex !== -1) {
        course.pendingStudents.splice(pendingIndex, 1);
        await course.save();
      }

      return res.status(200).send({
        message: "Enrollment request has been rejected by the teacher",
        isSuccess: true,
        course: course,
      });
    } else {
      return res.status(400).send({
        message: "Invalid action provided",
        isSuccess: false,
      });
    }
  } catch (error) {
    return res.status(error.code || 500).send({
      message: error.message || "Something went wrong",
      isSuccess: false,
    });
  }
};

// Block and remove student from a specific course
courseController.blockStudent = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const studentId = req.body.studentId;

    // Find the course and the user
    const course = await Course.findById(courseId).exec();
    const studentUser = await User.findById(studentId).exec();

    if (!course || !studentUser) {
      return res.status(404).send({
        message: "Course or Student not found",
        isSuccess: false,
      });
    }

    // Remove the studentId from the students array and push to blockedStudents array
    const studentIndex = course.students.indexOf(studentId);
    if (studentIndex !== -1) {
      course.students.splice(studentIndex, 1);
      course.blockedStudents.push(studentId);
      await course.save();
    } else {
      return res.status(400).send({
        message: "Student is not enrolled in this course",
        isSuccess: false,
      });
    }

    // Remove the courseId from the user's courses array
    const courseIndex = studentUser.courses.indexOf(courseId);
    if (courseIndex !== -1) {
      studentUser.courses.splice(courseIndex, 1);
      await studentUser.save();
    }

    return res.status(200).send({
      message: "Student blocked and removed from the course successfully",
      isSuccess: true,
      course: course,
    });
  } catch (error) {
    return res.status(error.code || 500).send({
      message: error.message || "Something went wrong",
      isSuccess: false,
    });
  }
};

// unblock student from a specific course
courseController.unBlockStudent = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const studentId = req.body.studentId;

    // Find the course
    const course = await Course.findById(courseId).exec();

    if (!course) {
      return res.status(404).send({
        message: "Course not found",
        isSuccess: false,
      });
    }

    // Remove the studentId from the blockedStudents array
    const studentIndex = course.blockedStudents.indexOf(studentId);
    if (studentIndex !== -1) {
      course.blockedStudents.splice(studentIndex, 1);
      await course.save();
    } else {
      return res.status(400).send({
        message: "Student is not blocked in this course",
        isSuccess: false,
      });
    }

    return res.status(200).send({
      message: "Student unblocked successfully",
      isSuccess: true,
      course: course,
    });
  } catch (error) {
    return res.status(error.code || 500).send({
      message: error.message || "Something went wrong",
      isSuccess: false,
    });
  }
};

// unblock student from a specific course and add student at that course
courseController.unBlockAndAddStudent = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const studentId = req.body.studentId;

    // Find the course and the user
    const course = await Course.findById(courseId).exec();
    const studentUser = await User.findById(studentId).exec();

    if (!course || !studentUser) {
      return res.status(404).send({
        message: "Course or Student not found",
        isSuccess: false,
      });
    }

    // Remove the studentId from the blockedStudents array and push to students array
    const studentIndex = course.blockedStudents.indexOf(studentId);
    if (studentIndex !== -1) {
      course.blockedStudents.splice(studentIndex, 1);
      course.students.push(studentId);
      await course.save();
    } else {
      return res.status(400).send({
        message: "Student is not blocked in this course",
        isSuccess: false,
      });
    }

    // Push the courseId to the user's courses array
    if (!studentUser.courses.includes(courseId)) {
      studentUser.courses.push(courseId);
      await studentUser.save();
    }

    return res.status(200).send({
      message: "Student unblocked and added to the course successfully",
      isSuccess: true,
      course: course,
    });
  } catch (error) {
    return res.status(error.code || 500).send({
      message: error.message || "Something went wrong",
      isSuccess: false,
    });
  }
};

module.exports = courseController;
