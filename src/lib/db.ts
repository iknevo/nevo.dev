import mongoose from "mongoose";

import { env } from "@/src/config/env";

const dbConnect = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    await mongoose.connect(env.database, {
      dbName: env.databaseName,
    });

    console.log(`✅ DATABASE connected`);

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 DATABASE connection closed due to app termination");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await mongoose.connection.close();
      console.log("🛑 DATABASE connection closed due to SIGTERM");
      process.exit(0);
    });

    return mongoose;
  } catch (error: unknown) {
    console.error("❌ Error connecting to DATABASE:", (error as Error).message);
    throw error;
  }
};

export default dbConnect;
