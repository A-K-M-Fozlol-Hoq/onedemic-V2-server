// internal imports
const Exam = require("../models/Exam");
const Result = require("../models/Result");

// rresult controller object
const resultController = {};

// save mcq exam result
resultController.saveMCQ = async (req, res, next) => {
  try {
    const { studentId, examId, examType, answeredMcqs } = req.body;
    // Check if previous data with the same studentId and examId exists
    const existingResult = await Result.findOne({
      student: studentId,
      exam: examId,
    });

    if (existingResult) {
      return res.status(422).send({
        isSuccess: false,
        message: "You already submitted one answer script",
      });
    }

    // Fetch the exam based on examId
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).send({
        isSuccess: false,
        message: "Exam not found",
      });
    }

    if (exam.examType !== "mcq") {
      return res.status(400).send({
        isSuccess: false,
        message: "This endpoint only supports MCQ exams",
      });
    }

    let totalMarks = 0;
    answeredMcqs.forEach((answered) => {
      const matchingQuestion = exam.mcqQuestions.find(
        (question) => question._id.toString() === answered.questionId
      );

      if (
        matchingQuestion &&
        matchingQuestion.answer === answered.selectedOption
      ) {
        totalMarks++;
      }
    });

    const resultData = {
      exam: examId,
      student: studentId,
      examType: examType,
      answeredMcqs: answeredMcqs,
      mark: totalMarks,
    };
    console.log(resultData);

    const newResult = new Result(resultData);

    await newResult.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Exam submitted successfully",
      data: newResult,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      isSuccess: false,
      message: error.message || "Something went wrong",
    });
  }
};

// save cq exam result
resultController.saveCQ = async (req, res, next) => {
  try {
    const { studentId, examId, examType, answerScript } = req.body;

    // Check if the data is provided properly
    if (!studentId || !examId || !examType || !answerScript) {
      return res.status(422).send({
        isSuccess: false,
        message: "Please provide all necessary data",
      });
    }

    // Check if previous data with the same studentId and examId exists
    const existingResult = await Result.findOne({
      student: studentId,
      exam: examId,
    });

    if (existingResult) {
      return res.status(422).send({
        isSuccess: false,
        message: "You already submitted one answer script",
      });
    }

    // Create a new result instance
    const resultData = {
      exam: examId,
      student: studentId,
      examType: examType,
      answerScript: answerScript,
    };

    const newResult = new Result(resultData);

    // Save the new result
    await newResult.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Result saved successfully",
      data: newResult,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message || "Something went wrong",
    });
  }
};

// Get all results for a given examId with student's name and email populated
resultController.getResultsForExam = async (req, res, next) => {
  try {
    const examId = req.params.examId;

    // Find all results for the given examId and populate student information
    const results = await Result.find({ exam: examId })
      // .select("-answeredMcqs") // Excludes the answeredMcqs field
      .populate("student", "name email")
      .exec();

    return res.status(200).send({
      isSuccess: true,
      data: results || [],
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message || "Something went wrong",
    });
  }
};

// Get all results for a given examId with student's name and email populated
resultController.updateMark = async (req, res, next) => {
  try {
    const resultId = req.body.resultId;
    const updatedMark = req.body.updatedMark;

    if (!updatedMark || isNaN(updatedMark)) {
      return res.status(422).send({
        isSuccess: false,
        message: "Invalid or missing mark value",
      });
    }

    const result = await Result.findById(resultId);

    if (!result) {
      return res.status(404).send({
        isSuccess: false,
        message: "Result not found",
      });
    }

    result.mark = updatedMark;
    await result.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Mark updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = resultController;
