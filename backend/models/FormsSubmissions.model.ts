import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const FormSubmissionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    formId: { type: String, ref: "Form", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    responses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export const FormSubmission = mongoose.model(
  "FormSubmission",
  FormSubmissionSchema
);
