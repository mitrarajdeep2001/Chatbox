import axios from "axios";
import { Request, Response } from "express";

export const getEmojieData = async (req: Request, res: Response) => {
  const { data } = await axios.get(
    "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
  );
  res.status(200).json(data);
};
