import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import * as argon from "argon2";
import passportJwt, { StrategyOptions } from "passport-jwt";
import ClassModel from "./models/class.model";
import Config from "./config";
import UserModel from "./models/user.model";
import authRouter from "./routes/auth.routes";
import { User } from "./typings";
import userRouter from "./routes/user.routes";
import studentRouter from "./routes/student.routes";
import paymentRouter from "./routes/payment.routes";
import expenseRouter from "./routes/expense.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const cookieExtractor = (req: any) => {
  let token = null;
  if (req.headers.cookie) {
    for (let ck of req.headers.cookie.split("; ")) {
      if (ck.split("=")[0] === "zionsfield") {
        token = ck.split("=")[1];
      }
    }
  }
  return token;
};

const opts: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET!,
};
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    const foundUser = await UserModel.findOne(jwt_payload);
    if (!foundUser) return done(null, false);
    const { password, ...others } = foundUser.toObject();
    return done(null, others);
  })
);

const allowedOrigins = [process.env.FRONTEND_URL!];
//allowing CORS
const corsOption: CorsOptions = {
  origin: (
    requestOrigin: string | undefined,
    callback: (b: Error | null, c: boolean) => void
  ) => {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!requestOrigin) return callback(null, true);
    if (allowedOrigins.indexOf(requestOrigin) === -1) {
      let msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
};
app.use(cors(corsOption));
if (process.env.NODE_ENV === "production") app.enable("trust proxy");

const PORT = process.env.PORT || 9000;

app.get("/hello", (req, res) => {
  res.json("Hello World!");
});

app.post("/api/v1/super", async (req: Request, res: Response) => {
  try {
    const foundSuper = await UserModel.findOne({ roles: "ROLE_SUPER_ADMIN" });
    if (foundSuper)
      return res
        .status(405)
        .json({ msg: "Super Admin already exists", status: 405 });
    const { password } = req.body;
    const hash = await argon.hash(password);
    const newSuper = await UserModel.create({
      ...req.body,
      password: hash,
      roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
    });
    const { password: psw, ...others } = newSuper.toObject();
    return res.status(201).json({ msg: "Super Admin created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "An error occurred", status: 500 });
  }
});

app.post("/api/v1/classes", async (req, res) => {
  try {
    const foundClass = await ClassModel.find();
    if (foundClass.length > 0)
      return res
        .status(405)
        .json({ msg: "Not allowed, classes already exist" });

    await ClassModel.create({
      className: "KG 1",
    });
    await ClassModel.create({
      className: "KG 2",
    });
    await ClassModel.create({
      className: "Nursery 1",
    });
    await ClassModel.create({
      className: "Nursery 2",
    });
    await ClassModel.create({
      className: "Primary 1",
    });
    await ClassModel.create({
      className: "Primary 2",
    });
    await ClassModel.create({
      className: "Primary 3",
    });
    await ClassModel.create({
      className: "Primary 4",
    });
    await ClassModel.create({
      className: "Primary 5",
    });
    await ClassModel.create({
      className: "Primary 6",
    });
    await ClassModel.create({
      className: "JSS 1",
    });
    await ClassModel.create({
      className: "JSS 2",
    });
    await ClassModel.create({
      className: "JSS 3",
    });
    await ClassModel.create({
      className: "SSS 1",
    });
    await ClassModel.create({
      className: "SSS 2",
    });
    await ClassModel.create({
      className: "SSS 3",
    });
    return res.json(await ClassModel.find());
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "An error occurred", status: 500 });
  }
});

app.use("/api/v1/auth", authRouter);
app.use(
  "/api/v1/users",
  passport.authenticate("jwt", { session: false }),
  userRouter
);
app.use(
  "/api/v1/students",
  passport.authenticate("jwt", { session: false }),
  studentRouter
);
app.use(
  "/api/v1/payments",
  passport.authenticate("jwt", { session: false }),
  paymentRouter
);
app.use(
  "/api/v1/expenses",
  passport.authenticate("jwt", { session: false }),
  expenseRouter
);

app.use("*", (req, res: Response, next) => {
  return res.status(404).json({
    status: 404,
    message: "Not found, invalid route",
  });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  //console.log(error);
  const status = error.status || 500;
  const message = error.message;

  res.status(status).json({
    message: message,
    status: status,
  });
});

app.listen(PORT, async () => {
  await Config.connect();
  console.log(`Server listening on port ${PORT}`);
});
