import express from "express";
import UserController from "../controllers/user.controller";
import Auth from "../middleware/auth.middleware";
const userRouter = express.Router();

userRouter.get("/me", UserController.me);

userRouter.post("/add", Auth.isSuperAdmin, UserController.addAdmin);

userRouter
  .route("/terms")
  .put(Auth.isSuperAdmin, UserController.changeCurrentTerm)
  .get(Auth.isSuperAdmin, UserController.getTerms);

userRouter.get("/classes", Auth.isAdmin, UserController.getClasses);

export default userRouter;
