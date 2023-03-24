// Import required modules
const express = require("express");
const mongoose = require("mongoose");

// Create Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/exam-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB"));

// Define ExamAttempt schema
const examAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  mcqAnswers: {
    type: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedOption: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  writtenAnswerPDF: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PDF",
  },
  status: {
    type: String,
    enum: ["Started", "Completed"],
    default: "Started",
  },
});

// Define ExamAttempt model
const ExamAttempt = mongoose.model("ExamAttempt", examAttemptSchema);

// Define route to create exam attempt
app.post("/start-exam/:examId", async (req, res) => {
  const { examId } = req.params;
  const studentId = req.user.id; // Assuming authentication middleware sets user id in req.user

  // Check if exam attempt already exists
  const existingExamAttempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
    status: "Started",
  });
  if (existingExamAttempt) {
    return res.status(400).send("Exam attempt already started");
  }

  // Create new exam attempt
  const examAttempt = new ExamAttempt({
    student: studentId,
    exam: examId,
    startTime: Date.now(),
  });
  await examAttempt.save();

  res.send("Exam attempt created successfully");
});

app.post("/exam/attempt/mcq", async (req, res) => {
  const { examId, studentId, questionNumber, selectedOption } = req.body;

  try {
    const examAttempt = await ExamAttempt.findOne({ examId, studentId });
    const { questions, mcqAnswers, mcqScore } = examAttempt;

    // Update the mcqAnswers array
    mcqAnswers[questionNumber - 1] = selectedOption;

    // Update the mcqScore field
    const selectedQuestion = questions[questionNumber - 1];
    const correctOption = selectedQuestion.correctOption;
    const isAnswerCorrect = selectedOption === correctOption;
    const newMcqScore = isAnswerCorrect ? mcqScore + 1 : mcqScore;

    // Calculate the new mcqProgress field
    const newMcqProgress = mcqAnswers.length / questions.length;

    // Update the examAttempt document
    examAttempt.mcqAnswers = mcqAnswers;
    examAttempt.mcqScore = newMcqScore;
    examAttempt.mcqProgress = newMcqProgress;

    await examAttempt.save();

    res.status(200).send({ message: "MCQ answer saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error saving MCQ answer" });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
