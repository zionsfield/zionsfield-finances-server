import mongoose from "mongoose";
const { Schema, model } = mongoose;

const classSchema = new Schema(
  {
    className: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    collection: "classes",
    timestamps: true,
  }
);

export default model("ClassName", classSchema);
