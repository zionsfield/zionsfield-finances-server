import ExpenseModel from "../models/expense.model";
import ExpenseRepo from "../repo/expense.repo";
import { AddExpense, Pagination, Term } from "../typings";

class ExpenseService {
  static async addExpense(newExpense: AddExpense, currentTerm: Term) {
    try {
      const { details, amountPaid } = newExpense;
      const createdExpense = await ExpenseRepo.addExpense({
        newExpense,
        currentTerm,
      });
      return {
        msg: "Expense created successfully",
        status: 201,
        expense: createdExpense,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async deleteExpense(_id: string) {
    try {
      const deletedExpense = await ExpenseRepo.deleteExpense(_id);
      return {
        msg: "Expense deleted successfully",
        status: 200,
        expense: deletedExpense,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async getExpenseByDay(day: string) {
    const date = new Date(day);
    try {
      const expenses = await ExpenseRepo.getExpensesByDay(date.getTime());
      return {
        msg: "Expenses returned successfully",
        status: 200,
        expenses,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async getExpenses(currentTerm: Term, pagination?: Pagination) {
    try {
      /**
       * let limit, page;
      if (!pagination) {
        limit = 10;
        page = 0;
      } else {
        limit = pagination.limit;
        page = pagination.page;
      }
       */
      console.log(currentTerm);

      let limit, page;
      if (!pagination) {
        limit = 10;
        page = 0;
      } else {
        limit = pagination.limit || 10;
        page = pagination.page || 0;
      }
      const count = await ExpenseModel.find({ currentTerm }).count();
      const expenses = await ExpenseRepo.getExpenses(
        { limit, page },
        currentTerm
      );
      return {
        msg: "Expenses returned successfully",
        status: 200,
        expenses,
        count,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }
}

export default ExpenseService;
