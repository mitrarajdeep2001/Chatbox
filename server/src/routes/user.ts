import express from "express";
import { checkUserExists, checkUserOnlineStatus } from "../controllers/user";

const router = express.Router();

router.get("/check", checkUserExists); // Check user exists
router.get("/check/online/status/:id", checkUserOnlineStatus); // Check user online status

export default router;
