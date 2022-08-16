import ClassModel from "../models/class.model";

class ClassRepo {
  static async findByName(className: string) {
    return await ClassModel.findOne({ className: className });
  }
  static async findAll() {
    return await ClassModel.find().distinct("className");
  }
}

export default ClassRepo;
