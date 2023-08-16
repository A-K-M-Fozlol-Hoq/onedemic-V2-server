// internal imports
const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const Exam = require("../models/Exam");

// exam controller object
const examController = {};

// create createExam function
examController.createExam = async (req, res) => {
  try {
    const {
      examName,
      courseId,
      startDateTime,
      endDateTime,
      examType,
      questionPaper,
      mcqQuestions,
    } = req.body;

    // Validate the input data
    if (!examName || !courseId || !startDateTime || !endDateTime || !examType) {
      return res.status(422).send({
        message: "Please send all data properly",
        isSuccess: false,
      });
    }

    const course = await Course.findById(courseId).populate(
      "teacher",
      "selectedPlan endDate"
    );
    if (!course) {
      return res.status(404).send({
        message: "Course not found",
        isSuccess: false,
      });
    }

    const teacher = course.teacher;
    const isPremiumOrTrial =
      teacher.selectedPlan === "trial" || teacher.selectedPlan === "premium";
    const hasValidSubscription =
      isPremiumOrTrial && teacher.endDate > new Date();
    const maxExamLimit = hasValidSubscription ? 20 : 10;

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const isStartWithinOneMonth = new Date(startDateTime) <= oneMonthFromNow; // Convert startDateTime to Date object for comparison

    const fourHoursFromStart = new Date(startDateTime);
    fourHoursFromStart.setTime(
      fourHoursFromStart.getTime() + 4 * 60 * 60 * 1000
    ); // 4 hours in milliseconds
    const isEndWithinFourHours = new Date(endDateTime) <= fourHoursFromStart; // Convert endDateTime to Date object for comparison

    if (!isStartWithinOneMonth) {
      return res.status(422).send({
        message: "Start date should be within the next calendar month",
        isSuccess: false,
      });
    }

    if (!isEndWithinFourHours) {
      return res.status(422).send({
        message: "End date should be within 4 hours from the start date",
        isSuccess: false,
      });
    }

    const examCountForCourse = await Exam.countDocuments({
      course: courseId,
    });
    console.log({ examCountForCourse, maxExamLimit });
    if (examCountForCourse >= maxExamLimit) {
      return res.status(422).send({
        message: `You have already reached the maximum limit of ${maxExamLimit} exams for this course`,
        isSuccess: false,
      });
    }

    const maxQuestionsAllowed = hasValidSubscription ? 15 : 10;
    if (mcqQuestions.length > maxQuestionsAllowed) {
      return res.status(422).send({
        message: `Maximum ${maxQuestionsAllowed} MCQ questions are allowed for the selected plan`,
        isSuccess: false,
      });
    }

    const exam = new Exam({
      examName,
      course: courseId,
      startDateTime,
      endDateTime,
      examType,
      questionPaper,
      mcqQuestions,
      teacher: teacher._id, // Use the teacher from the course
    });

    const newExam = await exam.save();

    res.status(200).send({
      message: "Exam created successfully",
      isSuccess: true,
      data: newExam,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).send({
      message: error.message || "Something went wrong",
      isSuccess: false,
    });
  }
};

// create getExams function (for student dashboard)
examController.getExams = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId
    if (!courseId) {
      return res.status(422).send({
        message: "Please provide a valid courseId",
        isSuccess: false,
      });
    }

    // Find exams for the provided courseId with endDateTime in the future
    const currentDateTime = new Date();

    const exams = await Exam.find({
      course: courseId,
      endDateTime: { $gt: currentDateTime },
    })
      .select("-mcqQuestions -questionPaper")
      .populate({
        path: "course",
        select: "name photo", // Specify the fields you want to populate
      });

    res.status(200).send({
      message: "Exams retrieved successfully",
      isSuccess: true,
      data: exams,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).send({
      message: error.message || "Something went wrong",
      isSuccess: false,
    });
  }
};

// create getAllExams function (for teacher dashboard)
examController.getAllExams = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId
    if (!courseId) {
      return res.status(422).send({
        message: "Please provide a valid courseId",
        isSuccess: false,
      });
    }

    // Find exams for the provided courseId with endDateTime in the future
    const currentDateTime = new Date();

    const exams = await Exam.find({
      course: courseId,
      endDateTime: { $gt: currentDateTime },
    })
      .select("-mcqQuestions -questionPaper")
      .populate({
        path: "course",
        select: "name photo", // Specify the fields you want to populate
      });

    res.status(200).send({
      message: "Exams retrieved successfully",
      isSuccess: true,
      data: exams,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).send({
      message: error.message || "Something went wrong",
      isSuccess: false,
    });
  }
};

// create getFullExam function
examController.getFullExam = async (req, res) => {
  try {
    const { examId } = req.params;

    // Find exam by examId
    const exam = await Exam.findById(examId)
      .populate({
        path: "course",
        select: "name photo", // Select the fields you want to populate
      })
      .select("-mcqQuestions.answer");

    if (!exam) {
      return res.status(404).send({
        message: "Exam not found",
        isSuccess: false,
      });
    }

    res.status(200).send({
      message: "Exam details retrieved successfully",
      isSuccess: true,
      data: exam,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).send({
      message: error.message || "Something went wrong",
      isSuccess: false,
    });
  }
};

// Create the deleteExam function
examController.deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;

    // Validate examId
    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(422).send({
        message: "Please provide a valid examId",
        isSuccess: false,
      });
    }

    // Delete the exam by examId
    const deletedExam = await Exam.findByIdAndDelete(examId);

    if (!deletedExam) {
      return res.status(404).send({
        message: "Exam not found",
        isSuccess: false,
      });
    }

    res.status(200).send({
      message: "Exam deleted successfully",
      isSuccess: true,
      data: deletedExam,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).send({
      message: error.message || "Something went wrong",
      isSuccess: false,
    });
  }
};

module.exports = examController;
