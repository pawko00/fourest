import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { FocusSession } from "./entities/FocusSession";
import { TreeType } from "./entities/TreeType";
import { UserStats } from "./entities/UserStats";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_DATABASE || "focusforest",
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [FocusSession, TreeType, UserStats],
});
