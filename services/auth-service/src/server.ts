import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
    service: "auth-service",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Internal endpoint for token validation (used by other services)
app.post("/internal/validate-token", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ valid: false, error: "Token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    res.json({ valid: true, userId: decoded.userId });
  } catch (error) {
    res.json({ valid: false, error: "Invalid token" });
  }
});

// Error handling
app.use(errorHandler);

// Database connection and server start
AppDataSource.initialize()
  .then(async () => {
    console.log("📦 Auth Service: Database connection established");

    app.listen(PORT, () => {
      console.log(`🔐 Auth Service running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  });
