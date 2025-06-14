import express from "express";
import {
  createSubmission,
  getSubmissionById,
  deleteSubmission,
  getSubmissionsByFormId,
  getAllSubmissions,
} from "../controllers/formsSubmissions.controller";

const router = express.Router();

router.get("/", getAllSubmissions);

router.post("/:formId", createSubmission);

router.get("/form/:formId", getSubmissionsByFormId);

router.get("/:submissionId", getSubmissionById);

router.delete("/:submissionId", deleteSubmission);

export default router;
