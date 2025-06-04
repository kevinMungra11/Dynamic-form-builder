import mongoose from "mongoose";

const FormSubmissionSchema = new mongoose.Schema(
  {
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
