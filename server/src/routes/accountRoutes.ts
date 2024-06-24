import express from "express";
import {
  getBalance,
  transfer,
  userProfile,
} from "../controllers/accountController";
import authMiddleware from "../middlewares/index";

const router = express.Router();

router.get("/balance", authMiddleware, getBalance);
router.get("/userProfile", authMiddleware, userProfile);
router.post("/transfer", authMiddleware, transfer);

export default router;
