import express from "express";
import StudentController from "../controllers/student.controller";
import Auth from "../middleware/auth.middleware";

const studentRouter = express.Router();

studentRouter.post("/add", Auth.isAdmin, StudentController.addStudent);

studentRouter
  .route("/delete")
  .delete(Auth.isSuperAdmin, StudentController.deleteStudent);

studentRouter
  .route("/class")
  .get(Auth.isAdmin, StudentController.getStudentsByClassName)
  .put(Auth.isSuperAdmin, StudentController.updateStudentClass);

export default studentRouter;
