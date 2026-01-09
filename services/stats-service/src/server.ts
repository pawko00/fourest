import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./middleware/errorHandler";
import statsRoutes from "./routes/stats";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/", limiter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    service: "stats-service",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/stats", statsRoutes);

// Error handling
app.use(errorHandler);

// Database connection and server start
AppDataSource.initialize()
  .then(async () => {
    console.log("📦 Stats Service: Database connection established");

    app.listen(PORT, () => {
      console.log(`📊 Stats Service running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  });
