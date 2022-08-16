import mongoose from "mongoose";
const { Schema, model } = mongoose;

const expenseSchema = new Schema(
  {
    details: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
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
    collection: "expenses",
    timestamps: true,
  }
);

export default model("Expense", expenseSchema);
