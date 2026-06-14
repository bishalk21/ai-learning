import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/ai", aiRoutes);
app.listen(PORT, (err) => {
  err
    ? console.error(err)
    : console.log(`Server is running on http://localhost:${PORT}`);
});
