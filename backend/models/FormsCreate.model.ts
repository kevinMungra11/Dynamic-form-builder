import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const FieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["text", "checkbox"],
  },
  required: { type: Boolean, default: false },
});

const FormSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    title: { type: String, required: true },
    fields: { type: [FieldSchema], required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Form = mongoose.model("Form", FormSchema);
