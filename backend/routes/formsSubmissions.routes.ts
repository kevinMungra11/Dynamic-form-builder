import express from "express";
import {
  createSubmission,
  getSubmissionsByForm,
  getSubmissionById,
  deleteSubmission,
} from "../controllers/formsSubmissions.controller";

const router = express.Router();

router.post("/:formId", createSubmission);

router.get("/:formId", getSubmissionsByForm);

router.get("/:submissionId", getSubmissionById);

router.delete("/:submissionId", deleteSubmission);

export default router;
