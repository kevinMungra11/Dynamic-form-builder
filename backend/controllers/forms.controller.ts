import { Request, Response } from "express";
import { Form } from "../models/Forms.model";
import { formValidationSchema } from "../validators/validators";

export const createForm = async (req: Request, res: Response) => {
  try {
    const { error, value } = formValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }

    const form = await Form.create(value);
    res.status(201).json(form);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getAllForms = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Form.countDocuments();
    const forms = await Form.find({ isDeleted: false }).skip(skip).limit(limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: forms,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getFormById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const form = await Form.findById(id);

    if (!form) {
      res.status(404).json({ message: "Form not found" });
    }
    console.log(form);
    res.status(200).json(form);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const editForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error, value } = formValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }

    const updatedForm = await Form.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true,
    });

    if (!updatedForm) {
      res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(updatedForm);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deleteForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedForm = await Form.findByIdAndUpdate(id, { isDeleted: true });

    if (!deletedForm) {
      res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
