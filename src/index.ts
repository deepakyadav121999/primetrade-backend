import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import { connectDB } from "./db";
import authRoutes from "./routes.auth";
import profileRoutes from "./routes.profile";
import taskRoutes from "./routes.tasks";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*", // keep simple for assignment; in prod, restrict this
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", taskRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error", err);
  res.status(500).json({ success: false, message: "Unexpected server error" });
});

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
});
