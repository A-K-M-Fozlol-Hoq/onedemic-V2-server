const ExamAttempt = require("../models/ExamAttempt");

// Function to update MCQ data for a specific question index in an ExamAttempt
async function updateMCQData(
  attemptId,
  questionIndex,
  selectedOption,
  isCorrect
) {
  try {
    const attempt = await ExamAttempt.findById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    const mcqData = attempt.mcqData[questionIndex];
    if (!mcqData) {
      throw new Error("Question index out of bounds");
    }

    // If the student hasn't already answered this question, add new data
    if (!mcqData.selectedOption) {
      // Update score and number of answered questions
      attempt.newScore += isCorrect ? 1 : 0;
      attempt.numAnswered++;

      // Update MCQ data
      mcqData.selectedOption = selectedOption;
      mcqData.isCorrect = isCorrect;

      // Save changes to database
      await attempt.save();
      console.log("MCQ data saved successfully");
    } else {
      console.log("MCQ data already exists for this question");
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Example usage: update MCQ data for question 2 of attempt with ID '12345'
updateMCQData("12345", 2, "option2", true);
