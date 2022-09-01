import PaymentModel from "../models/payment.model";
import { AddPayment, AddPaymentDto, Pagination, Term } from "../typings";

class PaymentRepo {
  static async addPayment({
    newPayment,
    currentTerm,
  }: {
    newPayment: AddPaymentDto;
    currentTerm: Term;
  }) {
    return await PaymentModel.create({ ...newPayment, currentTerm });
  }
  static async deletePayment(_id: string) {
    return await PaymentModel.deleteOne({ _id });
  }
  static async getTotalPaymentsPerTerm(currentTerm: Term) {
    const payments = await PaymentModel.find({ currentTerm });
    console.log(payments);

    const sum = payments.reduce(
      (total, curr: any) => total + curr.amountPaid,
      0
    );
    console.log(sum);
    return sum;
  }
  static async getPayments(pagination: Pagination, currentTerm: Term) {
    return await PaymentModel.find(
      { currentTerm },
      {},
      { limit: pagination.limit, skip: pagination.page * pagination.limit }
    )
      .populate("studentId")
      .sort({ createdAt: 1 })
      .exec();
  }

  static async getPaymentsByDay(day: number) {
    return await PaymentModel.find({
      date: {
        $gt: day,
        $lt: day + 1 * 24 * 60 * 60 * 1000,
      },
    });
  }
}

export default PaymentRepo;
