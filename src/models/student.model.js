import mongoose from "mongoose";
const { Schema, model } = mongoose;

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tuition: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "ClassName",
    },
  },
  {
    collection: "students",
    timestamps: true,
  }
);

studentSchema.index({ name: "text" });

export default model("Student", studentSchema);
