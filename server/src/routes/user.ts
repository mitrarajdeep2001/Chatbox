import express from "express";
import { checkUserExists } from "../controllers/user";

const router = express.Router();

router.get("/check", checkUserExists); // Check user exists

export default router;
