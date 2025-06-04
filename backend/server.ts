import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import formRoutes from "./routes/forms.routes";
import formSubmissionRoutes from "./routes/formsSubmissions.routes";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/forms", formRoutes);
app.use("/submission", formSubmissionRoutes);

connectDB();

app.listen(PORT, () => {
  console.log("server is up and running !!");
});

export default app;
