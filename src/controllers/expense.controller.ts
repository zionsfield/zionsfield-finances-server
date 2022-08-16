import { NextFunction, Request, Response } from "express";
import ExpenseRepo from "../repo/expense.repo";
import ExpenseService from "../services/expense.service";
import { AddExpense } from "../typings";

class ExpenseController {
  static async addExpense(
    req: Request<{}, {}, AddExpense, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user)
        return res.status(404).json({ msg: "Not Found", status: 404 });
      const { msg, status, expense } = await ExpenseService.addExpense(
        req.body,
        req.user.currentTerm
      );
      if (status !== 201) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, expense });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async getExpensesByDay(
    req: Request<{}, {}, {}, { day: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { msg, status, expenses } = await ExpenseService.getExpenseByDay(
        req.query.day
      );
      if (status !== 200) return res.status(status).json({ msg, status });
      return res.status(status).json({ msg, status, expenses });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "An error occurred", status: 500 });
    }
  }

  static async getExpenses(
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
      const { session, term } = req.query;
      console.log(session, term);

      if (!req.user)
        return res.status(404).json({ msg: "Not Found", status: 404 });
      const { msg, status, expenses, count } = await ExpenseService.getExpenses(
        { session: req.query.session, term: req.query.term },
        { limit: parseInt(req.query.limit), page: parseInt(req.query.page) }
      );
      if (status !== 200) return res.status(status).json({ msg, status });
      return res.status(status).json({
        msg,
        status,
        expenses,
        count,
        sum: await ExpenseRepo.getTotalExpensesPerTerm({
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

export default ExpenseController;
