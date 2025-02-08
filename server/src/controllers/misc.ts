import axios from "axios";
import { Request, Response } from "express";
import { handleDeleteMedia, handleMediaUpload } from "../helper/cloudinary";

// Upload media to cloudinary
export const uploadMedia = async (req: Request, res: Response): Promise<any | Response<any, Record<string, any>>> => {
  // Check if file is present in the request
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const result = await handleMediaUpload(req.file);
    res
      .status(200)
      .json({
        message: "Media uploaded successfully",
        media: { public_id: result?.public_id, url: result?.url, secure_url: result?.secure_url },
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload media" });
  }
};

// Delete media from cloudinary
export const deleteMedia = async (req: Request, res: Response): Promise<any | Response<any, Record<string, any>>> => {
  const { public_id } = req.query as { public_id: string };
  if (!public_id) {
    return res.status(400).json({ message: "No public_id provided" });
  }
  try {
    await handleDeleteMedia(public_id);
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete media" });
  }
};
