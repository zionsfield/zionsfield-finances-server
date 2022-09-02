import PaymentModel from "../models/payment.model";
import {
  AddPayment,
  AddPaymentDto,
  EditPayment,
  Pagination,
  Term,
} from "../typings";

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
  static async editPayment(_id: string, editedP: EditPayment) {
    return await PaymentModel.updateOne(
      { _id },
      {
        $set: {
          amountPaid: editedP.amountPaid,
        },
      }
    );
  }
  static async deletePayment(_id: string) {
    return await PaymentModel.findOneAndDelete({ _id });
  }
  static async getTotalPaymentsPerTerm(currentTerm: Term) {
    const payments = await PaymentModel.find({ currentTerm });
    const sum = payments.reduce(
      (total, curr: any) => total + curr.amountPaid,
      0
    );
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

  static async findById(_id: string) {
    return await PaymentModel.findById(_id);
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
