import express from "express";
import PaymentController from "../controllers/payment.controller";
import Auth from "../middleware/auth.middleware";

const paymentRouter = express.Router();

paymentRouter.post("/add", Auth.isAdmin, PaymentController.addPayment);

paymentRouter.get(
  "/day",
  Auth.isSuperAdmin,
  PaymentController.getPaymentsByDay
);

paymentRouter.delete(
  "/delete",
  Auth.isSuperAdmin,
  PaymentController.deletePayment
);

paymentRouter.get("/all", Auth.isSuperAdmin, PaymentController.getPayments);

export default paymentRouter;
