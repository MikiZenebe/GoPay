// Importing module
import express, { Request, Response } from "express";
import cors from "cors";
const cookieParser = require("cookie-parser");
import dotenv from "dotenv";
import connectDB from "../src/db/connectDB";
import env from "../src/utils/validateEnv";
import userRoutes from "../src/routes/userRoutes";

const app = express();
app.use(cookieParser());
app.use(express.json());
dotenv.config();

app.use(
  cors({
    origin: env.FRONTEND_URL, // Replace with your frontend's origin
    credentials: true, // Allow sending cookies from the frontend
  })
);

app.use("/api/user", userRoutes);

// Handling GET / Request
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to typescript backend!");
});

// Server setup
app.listen(5000, () => {
  connectDB();
});
