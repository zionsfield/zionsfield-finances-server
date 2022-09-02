import ExpenseModel from "../models/expense.model";
import { AddExpense, EditExpense, Pagination, Term } from "../typings";

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

  static async editExpense(_id: string, editedE: EditExpense) {
    return await ExpenseModel.findOneAndUpdate({ _id }, { $set: editedE });
  }

  static async deleteExpense(_id: string) {
    return await ExpenseModel.deleteOne({ _id });
  }

  static async getTotalExpensesPerTerm(currentTerm: Term) {
    const expenses = await ExpenseModel.find({ currentTerm });
    const sum = expenses.reduce((total, curr) => total + curr.amountPaid, 0);
    return sum;
  }

  static async getExpenses(pagination: Pagination, currentTerm: Term) {
    return await ExpenseModel.find(
      { currentTerm },
      {},
      { limit: pagination.limit, skip: pagination.page * pagination.limit }
    ).sort({ createdAt: 1 });
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
