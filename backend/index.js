import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import aiRoutes from "./routes/aiRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // for parsing application/json
app.use(cors()); // for cross-origin requests

if (process.env.NODE_ENV === "production") {
  // Production-specific middleware or configurations can be added here
  console.log("Running in production mode");
  app.use(helmet()); // for security headers in production
}
if (process.env.NODE_ENV !== "production") {
  // Development-specific middleware or configurations can be added here
  console.log("Running in development mode");
}

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy & running!",
  });
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/ai", aiRoutes);
app.listen(PORT, (err) => {
  err
    ? console.error(err)
    : console.log(`Server is running on http://localhost:${PORT}`);
});
