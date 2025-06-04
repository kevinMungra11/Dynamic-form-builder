import express from "express";
import {
  createForm,
  editForm,
  getAllForms,
} from "../controllers/forms.controller";

const router = express.Router();

router.get("/forms", getAllForms);
router.post("/form", createForm);
router.patch("/form/:id", editForm);

export default router;
