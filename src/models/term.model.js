import mongoose from "mongoose";
const { Schema, model } = mongoose;

const termSchema = new Schema(
  {
    session: { type: String },
    term: { type: String },
  },
  { collection: "terms" }
);

export default model("TermModel", termSchema);
