import { CookieOptions, NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import { LoginDto } from "../typings";

class AuthController {
  static async login(
    req: Request<{}, {}, LoginDto, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { msg, status, access_token } = await AuthService.login(req.body);
      if (status !== 200) {
        return res.status(status).json({ msg, status });
      }
      const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
      };
      if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
        cookieOptions.sameSite = "none";
      } else {
        cookieOptions.sameSite = false;
      }
      return res
        .status(status)
        .cookie("zionsfield", access_token, cookieOptions)
        .json({ access_token, msg, status });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const cookieOptions: CookieOptions = {
        expires: new Date(1),
      };
      if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
        cookieOptions.sameSite = "none";
      } else {
        cookieOptions.sameSite = false;
      }
      return res
        .cookie("zionsfield", "", cookieOptions)
        .json({ msg: "Logged out", status: 200 });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }
}

export default AuthController;
