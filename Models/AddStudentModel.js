import mongoose from "mongoose"

// Define the schema for the student marks
const studentMarksSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  physicsMarks: {
    type: Number,
    required: true,
    min: 0,
    max: 100, 
  },
  mathsMarks: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  chemistryMarks: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  
});

// Create the StudentMarks model
export const StudentMarks = mongoose.model("studentmarks", studentMarksSchema);


 
