import ExpenseModel from "../models/expense.model";
import { AddExpense, Pagination, Term } from "../typings";

class ExpenseRepo {
  static async addExpense({
    newExpense,
    currentTerm,
  }: {
    newExpense: AddExpense;
    currentTerm: Term;
  }) {
    return await ExpenseModel.create({ ...newExpense, currentTerm });
  }

  static async getTotalExpensesPerTerm(currentTerm: Term) {
    const expenses = await ExpenseModel.find({ currentTerm });
    console.log(expenses);

    const sum = expenses.reduce((total, curr) => total + curr.amountPaid, 0);
    console.log(sum);
    return sum;
  }

  static async getExpenses(pagination: Pagination, currentTerm: Term) {
    console.log(pagination.page, pagination.limit);
    console.log(currentTerm);

    return await ExpenseModel.find(
      { currentTerm },
      {},
      { limit: pagination.limit, skip: pagination.page * pagination.limit }
    ).sort({ date: -1 });
  }

  static async getExpensesByDay(day: number) {
    return await ExpenseModel.find({
      date: {
        $gt: day,
        $lt: day + 1 * 24 * 60 * 60 * 1000,
      },
    });
  }
}

export default ExpenseRepo;
