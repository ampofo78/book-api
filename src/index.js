import cors from "cors";
import "dotenv/config";
import express from "express";
import job from "./config/cron.js";
import { connectToDb } from "./config/db.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import BookRoutes from "./Routes/BookRoutes.js";
const app = express();
if (process.env.NODE_ENV === "production") job.start();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(
  express.json({
    limit: "20mb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  }),
);
app.use("/api/auth", AuthRoutes);
app.use("/api/books", BookRoutes);
app.get("/api/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});
app.listen(port, () => {
  connectToDb();
});
