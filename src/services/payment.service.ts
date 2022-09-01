import PaymentModel from "../models/payment.model";
import ClassRepo from "../repo/class.repo";
import PaymentRepo from "../repo/payment.repo";
import StudentRepo from "../repo/student.repo";
import { AddPayment, Pagination, Term } from "../typings";

class PaymentService {
  static async addPayment(newPayment: AddPayment, currentTerm: Term) {
    const { amountPaid, studentName, className } = newPayment;
    try {
      const classObj = await ClassRepo.findByName(newPayment.className);
      if (!classObj) return { msg: "Class not found", status: 404 };
      const studentObj = await StudentRepo.findByName(newPayment.studentName);
      if (!studentObj) return { msg: "Class not found", status: 404 };
      const { className, studentName, ...others } = newPayment;
      const createdPayment = await PaymentRepo.addPayment({
        newPayment: {
          ...others,
          classId: classObj._id.toString(),
          studentId: studentObj._id.toString(),
        },
        currentTerm,
      });
      studentObj.amountPaid =
        parseInt(studentObj.amountPaid.toString()) +
        parseInt(newPayment.amountPaid.toString());
      await studentObj.save();
      return {
        msg: "Payment added successfully",
        status: 201,
        payment: createdPayment,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async deletePayment(_id: string) {
    try {
      const deletedPayment = await PaymentRepo.deletePayment(_id);
      return {
        msg: "Payment deleted successfully",
        status: 200,
        payment: deletedPayment,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async getPaymentsByDay(day: string) {
    const date = new Date(day);
    try {
      const payments = await PaymentRepo.getPaymentsByDay(date.getTime());
      return {
        msg: "Payments returned successfully",
        status: 200,
        payments,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async getPayments(currentTerm: Term, pagination?: Pagination) {
    try {
      let limit, page;
      if (!pagination) {
        limit = 10;
        page = 0;
      } else {
        limit = pagination.limit || 10;
        page = pagination.page || 0;
      }
      const count = await PaymentModel.find({ currentTerm }).count();
      const payments = await PaymentRepo.getPayments(
        { limit, page },
        currentTerm
      );
      return {
        msg: "Payments returned successfully",
        status: 200,
        payments,
        count,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }
}

export default PaymentService;
