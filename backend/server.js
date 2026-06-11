import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import apiRoutes from "./routes/api.routes.js";
import { sequelize } from "./models/index.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config({ quiet: true });

const app = express();
const port = Number(process.env.PORT || 5000);
const shouldSync = String(process.env.DB_SYNC).toLowerCase() === "true";
const shouldAlter = String(process.env.DB_ALTER).toLowerCase() === "true";

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api", apiRoutes);
app.use(errorMiddleware);

const start = async () => {
  await sequelize.authenticate();
  if (shouldSync) {
    await sequelize.sync({ alter: shouldAlter });
  }

  app.listen(port, () => {
    console.log(`[ERP API] running on http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start ERP API:", error);
  process.exit(1);
});
