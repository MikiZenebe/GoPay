import express from "express";
import {
  bulkfilter,
  logout,
  signin,
  signup,
  update,
} from "../controllers/userController";
import authMiddleware from "../middlewares";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.put("/update", authMiddleware, update);
router.get("/bulk", authMiddleware, bulkfilter);
router.get("/logout", logout);

export default router;
