import { NextFunction, Request, Response } from "express";
import StudentService from "../services/student.service";
import { CreateStudent } from "../typings";

class StudentController {
  static async addStudent(
    req: Request<{}, {}, CreateStudent, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { msg, status, student } = await StudentService.addStudent(
        req.body
      );
      if (status !== 201) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, student });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async getStudentsByClassName(
    req: Request<{}, {}, {}, { className: string; details?: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log(req.query.className);

      const { msg, status, students } =
        await StudentService.getStudentsByClassName(
          req.query.className,
          req.query.details
        );
      if (status !== 200) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, students });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async updateStudentClass(
    req: Request<
      {},
      {},
      {},
      { studentId: string; oldClass: string; newClass: string }
    >,
    res: Response
  ) {
    try {
      const { studentId, oldClass, newClass } = req.query;
      const { msg, status, updatedStudent } =
        await StudentService.changeStudentClass(req.query);
      if (status !== 200) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, updatedStudent });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async deleteStudent(
    req: Request<{}, {}, {}, { _id: string }>,
    res: Response
  ) {
    try {
      const { msg, status, deletedStudent } =
        await StudentService.deleteStudentById(req.query._id);
      if (status !== 200) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, deletedStudent });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }
}

export default StudentController;
