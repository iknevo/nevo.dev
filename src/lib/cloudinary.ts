import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.cloudinary.cloud_name,
  api_key: env.cloudinary.api_key,
  api_secret: env.cloudinary.api_secret,
});

export { cloudinary };
