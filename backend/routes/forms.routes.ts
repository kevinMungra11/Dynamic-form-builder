import express from "express";
import {
  createForm,
  deleteForm,
  editForm,
  getAllForms,
} from "../controllers/forms.controller";

const router = express.Router();

router.get("/forms", getAllForms);
router.post("/form", createForm);
router.patch("/form/:id", editForm);
router.delete("/form/:id", deleteForm);

export default router;
