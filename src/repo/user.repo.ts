import UserModel from "../models/user.model";
import { CreateAdmin, Term } from "../typings";

class UserRepo {
  static async findById(_id: string) {
    return await UserModel.findById(_id);
  }
  static async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  }
  static async addAdmin(newAdmin: CreateAdmin) {
    return await UserModel.create({ ...newAdmin, roles: ["ROLE_ADMIN"] });
  }
  static async changeCurrentTerm(currentTerm: Term) {
    return await UserModel.updateMany({}, { $set: { currentTerm } });
  }
}

export default UserRepo;
