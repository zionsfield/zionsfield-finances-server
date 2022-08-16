import mongoose from "mongoose";
const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "ClassName",
    },
    currentTerm: {
      session: { type: String },
      term: { type: String },
    },
    date: {
      type: Date,
      default: new Date(),
    },
  },
  {
    collection: "payments",
    timestamps: true,
  }
);

export default model("Payment", paymentSchema);
