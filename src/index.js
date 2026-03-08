import cors from "cors";
import "dotenv/config";
import express from "express";
import AuthRoutes from "./Routes/AuthRoutes.js";
import BookRoutes from "./Routes/BookRoutes.js";
import job from "./config/cron.js";
import { connectToDb } from "./config/db.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({}));
app.use("/api/auth", AuthRoutes);
app.use("/api/books", BookRoutes);
if (process.env.NODE_ENV === "production") job.start();
app.listen(port, () => {
  connectToDb();
});
