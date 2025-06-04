import { Request, Response } from "express";
import { Form } from "../models/forms.model";

export const createForm = async (req: Request, res: Response) => {
  try {
    const { title, fields } = req.body;
    const form = await Form.create({ title, fields });
    return res.status(201).json(form);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getAllForms = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Form.countDocuments();
    const forms = await Form.find().skip(skip).limit(limit);

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: forms,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const editForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, fields } = req.body;

    const updatedForm = await Form.findByIdAndUpdate(
      id,
      { title, fields },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    return res.status(200).json(updatedForm);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deleteForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedForm = await Form.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    return res.status(200).json({ message: "Form deleted successfully" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
