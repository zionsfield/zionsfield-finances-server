import express from "express";
import ExpenseController from "../controllers/expense.controller";
import Auth from "../middleware/auth.middleware";

const expenseRouter = express.Router();

expenseRouter.post("/add", Auth.isAdmin, ExpenseController.addExpense);

expenseRouter.get(
  "/day",
  Auth.isSuperAdmin,
  ExpenseController.getExpensesByDay
);

expenseRouter.get("/all", Auth.isSuperAdmin, ExpenseController.getExpenses);

export default expenseRouter;
