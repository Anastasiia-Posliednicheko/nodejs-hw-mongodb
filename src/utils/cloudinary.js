import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import { getEnvVar } from '../utils/getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});


export const saveFileToCloudinary = async (file) => {
  try {
    console.log('Uploading file:', file);

    const response = await cloudinary.v2.uploader.upload(file.path);

    await fs.unlink(file.path);
    return response.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary: ' + error.message);
  }
};

