// server.ts
import connectDB from "./config/db";
import Logger from "./utils/logger";
import app from "./app";

const logger = new Logger("server");

async function startServer() {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => {
      logger.log("🚀 Server running on ⚡️:", { PORT });
      logger.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`, {});
      logger.log(`🔗 Health check: http://localhost:${PORT}/health`, {});
    });
  } catch (err) {
    logger.error("❌ Failed to start server:", { err });
    process.exit(1);
  }
}

startServer();
