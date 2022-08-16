import { NextFunction, Request, Response } from "express";
import TermModel from "../models/term.model";
import ClassService from "../services/class.service";
import UserService from "../services/user.service";
import { CreateAdmin, Term } from "../typings";

class UserController {
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.user);
      if (!req.user)
        return res.status(404).json({ msg: "Not found", status: 404 });
      return res.status(200).json({ user: req.user });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async addAdmin(
    req: Request<{}, {}, CreateAdmin, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { msg, status, user } = await UserService.addAdmin(req.body);
      if (status !== 201) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, user });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async changeCurrentTerm(
    req: Request<{}, {}, Term, {}>,
    res: Response,
    next: NextFunction
  ) {
    const { session, term } = req.body;
    try {
      const { msg, status } = await UserService.changeCurrentTerm({
        session,
        term,
      });
      return res.status(status).json({ msg, status });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async getTerms(req: Request, res: Response) {
    try {
      const terms = await TermModel.find();
      return res
        .status(200)
        .json({ terms, msg: "Terms returned", status: 200 });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async getClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const { msg, status, classes } = await ClassService.getAll();
      if (status !== 200) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, classes });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }
}

export default UserController;
