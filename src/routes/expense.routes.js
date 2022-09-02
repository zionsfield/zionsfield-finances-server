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

expenseRouter.delete(
  "/delete",
  Auth.isSuperAdmin,
  ExpenseController.deleteExpense
);

expenseRouter.put("/edit", Auth.isSuperAdmin, ExpenseController.editExpense);

expenseRouter.get("/all", Auth.isSuperAdmin, ExpenseController.getExpenses);

export default expenseRouter;
