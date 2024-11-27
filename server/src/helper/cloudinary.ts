import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dj84vitsf",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRETE_KEY,
  secure: true,
});

const storage = multer.memoryStorage();

async function imageUploadUtil(file: string) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "chat_box",
  });

  return result;
}

const handleImageUpload = async (file: { buffer: any; mimetype: string }) => {
  try {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const url = "data:" + file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    return result;
  } catch (error) {
    console.log(error);
  }
};
const upload = multer({ storage });
export { upload, handleImageUpload };
