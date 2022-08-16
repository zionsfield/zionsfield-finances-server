import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    currentTerm: {
      session: { type: String },
      term: { type: String },
    },
    roles: {
      type: [String],
      required: true,
      enum: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export default model("User", userSchema);
