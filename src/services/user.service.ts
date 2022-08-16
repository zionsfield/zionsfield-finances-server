import UserRepo from "../repo/user.repo";
import { CreateAdmin, Term } from "../typings";
import * as argon from "argon2";
import TermModel from "../models/term.model";

class UserService {
  static async addAdmin(newAdmin: CreateAdmin) {
    const { name, email, password: plain } = newAdmin;
    try {
      const password = await argon.hash(newAdmin.password);
      const createdAdmin = await UserRepo.addAdmin({ ...newAdmin, password });
      return {
        msg: "Admin added successfully",
        status: 201,
        user: createdAdmin,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async changeCurrentTerm(newTerm: Term) {
    try {
      const { session, term } = newTerm;

      let nTerm = parseInt(term);
      let [n1Session, n2Session] = session.split("/").map((s) => parseInt(s));
      if (nTerm === 3) {
        nTerm = 1;
        n1Session++;
        n2Session++;
      } else {
        nTerm++;
      }

      const newSession = `${n1Session}/${n2Session}`;
      await TermModel.create({
        session: newSession,
        term: nTerm.toString(),
      });
      await UserRepo.changeCurrentTerm({
        session: newSession,
        term: nTerm.toString(),
      });

      return { msg: "Term and session updated", status: 200 };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }
}

export default UserService;
