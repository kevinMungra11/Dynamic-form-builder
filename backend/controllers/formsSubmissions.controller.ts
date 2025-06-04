import { Request, Response } from "express";
import { FormSubmission } from "../models/FormsSubmissions.model";
import { submissionValidationSchema } from "../validators/validators";

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;

    const { error, value } = submissionValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }

    const { firstName, lastName, responses } = value;
    const submission = await FormSubmission.create({
      formId,
      firstName,
      lastName,
      responses,
    });

    return res.status(201).json(submission);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getSubmissionsByFormId = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await FormSubmission.countDocuments({ formId });
    const submissions = await FormSubmission.find({ formId })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: submissions,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await FormSubmission.countDocuments();

    const submissions: any = await FormSubmission.find()
      .skip(skip)
      .limit(limit)
      .populate("formId", "title")
      .lean();

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: submissions,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const submission = await FormSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json(submission);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const deletedSubmission = await FormSubmission.findByIdAndDelete(
      submissionId
    );

    if (!deletedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
