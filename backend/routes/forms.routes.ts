import express from "express";
import {
  createForm,
  deleteForm,
  editForm,
  getAllForms,
} from "../controllers/forms.controller";

const router = express.Router();

router.get("/", getAllForms);

router.post("/", createForm);

router.patch("/:id", editForm);

router.delete("/:id", deleteForm);

export default router;
