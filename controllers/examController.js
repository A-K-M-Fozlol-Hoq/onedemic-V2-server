// internal imports
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
      questionPaperID,
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
      questionPaperID,
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

module.exports = examController;

// const Exam = require('../models/Exam');
// const User = require('../models/User');
