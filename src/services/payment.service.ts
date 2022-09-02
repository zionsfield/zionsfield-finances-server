import PaymentModel from "../models/payment.model";
import ClassRepo from "../repo/class.repo";
import PaymentRepo from "../repo/payment.repo";
import StudentRepo from "../repo/student.repo";
import { AddPayment, EditPayment, Pagination, Term } from "../typings";

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

  static async editPayment(_id: string, editedP: EditPayment) {
    try {
      const foundPayment = await PaymentRepo.findById(_id);
      if (!foundPayment) return { msg: "Not found", status: 404 };
      console.log(foundPayment.amountPaid);
      await PaymentRepo.editPayment(_id, editedP);
      const updatedPayment = await PaymentRepo.findById(_id);
      if (!updatedPayment) return { msg: "Not found", status: 404 };
      const foundStudent = await StudentRepo.findById(updatedPayment.studentId);
      if (!foundStudent) return { msg: "Student not found", status: 404 };
      console.log(updatedPayment.amountPaid);

      foundStudent.amountPaid =
        foundStudent.amountPaid -
        parseInt(foundPayment.amountPaid! as any) +
        parseInt(updatedPayment.amountPaid! as any);
      await foundStudent.save();
      return {
        msg: "Payment edited successfully",
        status: 200,
        payment: updatedPayment,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }

  static async deletePayment(_id: string) {
    try {
      const foundPayment = await PaymentRepo.findById(_id);
      if (!foundPayment) return { msg: "Payment not found", status: 404 };
      const deletedPayment = await PaymentRepo.deletePayment(
        foundPayment._id.toString()
      );
      const foundStudent = await StudentRepo.findById(foundPayment.studentId!);
      if (!foundStudent) return { msg: "Student not found", status: 404 };
      foundStudent.amountPaid =
        foundStudent.amountPaid - parseInt(foundPayment.amountPaid! as any);
      await foundStudent.save();
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
