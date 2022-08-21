import { CreateStudent, CreateStudentDto, EditStudent } from "../typings";
import ClassRepo from "./class.repo";
import StudentModel from "../models/student.model";

class StudentRepo {
  static async addStudent(newStudent: CreateStudentDto) {
    return await StudentModel.create(newStudent);
  }
  static async editStudent(studentId: string, updatedStudent: EditStudent) {
    return await StudentModel.updateOne(
      { _id: studentId },
      {
        $set: updatedStudent,
      }
    );
  }
  static async changeClass(
    oldClassId: string,
    newClassId: string,
    studentId: string
  ) {
    return await StudentModel.updateOne(
      { _id: studentId, classId: oldClassId },
      {
        $set: {
          classId: newClassId,
        },
      }
    );
  }
  static async findByClass(classId: string) {
    return await StudentModel.find({ classId });
  }
  static async findNameByClass(classId: string) {
    return await StudentModel.find({ classId }).distinct("name");
  }
  static async findByName(name: string) {
    return await StudentModel.findOne({ name });
  }
  static async findById(_id: string) {
    return await StudentModel.findById(_id);
  }
  static async deleteById(_id: string) {
    return await StudentModel.deleteOne({ _id });
  }
}

export default StudentRepo;
