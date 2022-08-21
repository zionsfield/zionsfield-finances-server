import { CreateStudent, EditStudent } from "../typings";
import StudentRepo from "../repo/student.repo";
import ClassRepo from "../repo/class.repo";

class StudentService {
  static async addStudent(newStudent: CreateStudent) {
    const { name, tuition, className } = newStudent;
    try {
      const classObj = await ClassRepo.findByName(newStudent.className);
      if (!classObj) return { msg: "Class not found", status: 404 };
      const { className, ...others } = newStudent;
      const createdStudent = await StudentRepo.addStudent({
        ...others,
        classId: classObj._id.toString(),
      });
      return {
        msg: "Student added successfully",
        status: 201,
        student: createdStudent,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async editStudent(studentId: string, updatedStudent: EditStudent) {
    try {
      return {
        msg: "Student updated",
        status: 200,
        updatedStudent: await StudentRepo.editStudent(
          studentId,
          updatedStudent
        ),
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async changeStudentClass({
    oldClass,
    newClass,
    studentId,
  }: {
    oldClass: string;
    newClass: string;
    studentId: string;
  }) {
    try {
      const oldClassObj = await ClassRepo.findByName(oldClass);
      if (!oldClassObj) return { msg: "Class not found", status: 404 };
      const newClassObj = await ClassRepo.findByName(newClass);
      if (!newClassObj) return { msg: "Class not found", status: 404 };
      const updatedStudent = await StudentRepo.changeClass(
        oldClassObj._id.toString(),
        newClassObj._id.toString(),
        studentId
      );
      return {
        updatedStudent,
        msg: "Student class updated successfully",
        status: 200,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async getStudentsByClassName(className: string, details?: string) {
    try {
      const classObj = await ClassRepo.findByName(className);
      console.log(className);

      if (!classObj) return { msg: "Class not found", status: 404 };
      console.log(classObj._id.toString());

      let foundStudents;
      if (details) {
        foundStudents = await StudentRepo.findByClass(classObj._id.toString());
      } else {
        foundStudents = await StudentRepo.findNameByClass(
          classObj._id.toString()
        );
      }

      return {
        students: foundStudents,
        msg: "Found students",
        status: 200,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async deleteStudentById(_id: string) {
    try {
      const deletedStudent = await StudentRepo.deleteById(_id);
      return {
        deletedStudent,
        msg: "Deleted student successfully",
        status: 200,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }
}

export default StudentService;
