import Express from "express";
import Jwt from "jsonwebtoken";
import { StudentMarks } from "../Models/AddStudentModel.js";
import dotenv from 'dotenv'

const router = Express.Router();
dotenv.config();
//Teacherlogin
router.post("/Teacherlogin", async (req, res) => {
    const {name,password}=req.body;
    if(name===process.env.TEACHER && password===process.env.PASSWORD){
        const token = Jwt.sign({ id:123 },process.env.KEY);
        res.json({ message: "success", token });
    }
   
  });


  //Student login
  
  router.post("/Studentlogin", async (req, res) => {
    const { rollnumber, selectedDate } = req.body;
    const result = await StudentMarks.findOne({ rollNumber:rollnumber, dateOfBirth: selectedDate });
    
    if (!result) {
    return res.status(404).json({ message: "Student not found" });
    }
  
    const token = Jwt.sign({ id: result._id }, process.env.KEY);
    res.status(200).json({ message: "success", token, rollnumber, result });
  
    
  });
  

  //verifying token

  const verifytoken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      Jwt.verify(token, process.env.KEY, (err) => {
        if (err) {
          return res.status(404).json({ message: "No way to get  in" });
        }
        next();
      });
    } else {
      res.sendStatus(405);
    }
  };


  router.get("/Studentresult",verifytoken, async (req, res) => {
    try {
      const { rollNumber } = req.query; // Access the 'rollnumber' query parameter
      
      // Use the 'rollnumber' in your query to fetch data
      const result = await StudentMarks.find({ rollNumber: rollNumber});
      res.json({ message: "successsss", result });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //all students 
  router.get("/TeacherView",verifytoken, async (req, res) => {
    const result= await StudentMarks.find({});
    return res.status(201).json({ message: "fdaf",result });
  });


  

//   Adding a new student
  
  router.post("/AddStudent",verifytoken, async (req, res) => {
    const { studentName, rollNumber,dateOfBirth, physicsMarks,mathsMarks,chemistryMarks} = req.body;
    //const authorname=await UserModel.findOne({_id:author});
    const result = new StudentMarks({
      studentName,
      rollNumber,
      dateOfBirth,
      physicsMarks,
      mathsMarks,
      chemistryMarks
    })
    try {
        await result.save();
        res.status(201).json({
            studentName:result.studentName,
            rollNumber:result.rollNumber,
            dateOfBirth:result.dateOfBirth,
            physicsMarks:result.physicsMarks,
            mathsMarks:result.mathsMarks,
            chemistryMarks:result.chemistryMarks,
        });
      } catch (err) {
        res.status(500).json(err);
      }
  });
  

  // deleting a student
  router.delete("/delete", verifytoken,async (req, res) => {
    try {
      const { rollNumber } = req.query;//_id
  
      // Use Mongoose to delete the student record based on rollNumber
      const deletedStudent = await StudentMarks.findByIdAndDelete(rollNumber);
  
      if (deletedStudent) {
        return res.json({ message: "Successfully deleted" });
      } else {
        return res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while deleting the student" });
    }
  });
  

  //updating the post
  router.patch("/update/:id", verifytoken,async (req, res) => {
    const rollNumber = req.params.id;
    const { phyiscs, maths, chemistry } = req.body;
  
    try {
      // Perform the update operation
      const filter = { _id: rollNumber };
      const update = {
        $set: {
          physicsMarks: phyiscs,
          mathsMarks: maths,
          chemistryMarks: chemistry,
        },
      };
  
      // Use the updateOne method to update the document
      const result=await StudentMarks.updateOne(filter,update);
      res.status(200).json({result});
      

    } catch (error) {
      // Handle any errors that may occur during the update
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  export { router as teacherrouter }; 



  