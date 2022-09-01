import { NextFunction, Request, Response } from "express";
import PaymentRepo from "../repo/payment.repo";
import PaymentService from "../services/payment.service";
import { AddPayment } from "../typings";

class PaymentController {
  static async addPayment(
    req: Request<{}, {}, AddPayment, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user)
        return res.status(404).json({ msg: "Not Found", status: 404 });
      const { msg, status, payment } = await PaymentService.addPayment(
        req.body,
        req.user.currentTerm
      );
      if (status !== 201) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, payment });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async deletePayment(
    req: Request<{}, {}, {}, { _id: string }>,
    res: Response
  ) {
    try {
      const { msg, status, payment } = await PaymentService.deletePayment(
        req.query._id
      );
      return res.status(status).json({ msg, status, payment });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async getPaymentsByDay(
    req: Request<{}, {}, {}, { day: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { msg, status, payments } = await PaymentService.getPaymentsByDay(
        req.query.day
      );
      if (status !== 200) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, payments });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async getPayments(
    req: Request<
      {},
      {},
      {},
      { page: string; limit: string; session: string; term: string }
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user)
        return res.status(404).json({ msg: "Not Found", status: 404 });
      const { msg, status, payments, count } = await PaymentService.getPayments(
        { session: req.query.session, term: req.query.term },
        { limit: parseInt(req.query.limit), page: parseInt(req.query.page) }
      );
      if (status !== 200) return res.status(status).json({ msg, status });
      return res.status(status).json({
        msg,
        status,
        payments,
        count,
        sum: await PaymentRepo.getTotalPaymentsPerTerm({
          session: req.query.session,
          term: req.query.term,
        }),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }
}

export default PaymentController;
