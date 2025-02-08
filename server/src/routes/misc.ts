import express from "express";
import { deleteMedia, uploadMedia } from "../controllers/misc";
import { upload } from "../helper/cloudinary";

const router = express.Router();

router.post("/upload/media", upload.single("media"), uploadMedia);

router.delete("/delete/media", deleteMedia);


export default router;
