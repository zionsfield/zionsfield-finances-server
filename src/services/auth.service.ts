import * as argon from "argon2";
import UserRepo from "../repo/user.repo";
import { LoginDto } from "../typings";
import jwt from "jsonwebtoken";

class AuthService {
  static async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      console.log(loginDto);

      const foundUser = await UserRepo.findByEmail(email);
      if (!foundUser) return { msg: "Not found", status: 404 };
      const pswCorrect = await argon.verify(foundUser.password!, password);
      if (!pswCorrect) return { msg: "Credentials incorrect", status: 401 };
      const { access_token } = await AuthService.signToken(
        foundUser._id.toString(),
        foundUser.email
      );
      await foundUser.save();
      return { msg: "Logged in", access_token, status: 200 };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = process.env.JWT_SECRET || "super_secret_string";

    const token = jwt.sign(payload, secret, {
      expiresIn: "12h",
    });
    return {
      access_token: token,
    };
  }
}

export default AuthService;
