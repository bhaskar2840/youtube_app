import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // by default present in node.donot install
//!unlink path - is like deleting file as the fs file get unlink not deleted.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//todo we will upload a local file and then upload it in the cloudinary .

const uploadOnClodinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file is uploaded successfully
    console.log("file is uploaded successfully", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temp file as operation failed.
    return null;
  }
};

export { uploadOnClodinary };
