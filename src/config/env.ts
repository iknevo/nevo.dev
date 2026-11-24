function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value || "";
}

export const env = {
  NEXT_PUBLIC_APP_URL: getEnv("NEXT_PUBLIC_APP_URL"),
  nodeEnv: process.env.NODE_ENV || "development",
  development: process.env.NODE_ENV === "development",
  production: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 8000,
  database: getEnv("DB_URI"),
  databaseName: getEnv("DB_NAME", false) || "nevo",
  jwt: {
    secret: getEnv("JWT_SECRET"),
    expiresInDays: +getEnv("JWT_EXPIRES_IN_DAYS"),
  },
  cloudinary: {
    cloud_name: getEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: getEnv("CLOUDINARY_API_KEY"),
    api_secret: getEnv("CLOUDINARY_API_SECRET"),
  },
  resendKey: getEnv("RESEND_API_KEY"),
  githubToken: getEnv("GITHUB_TOKEN", false),
};
