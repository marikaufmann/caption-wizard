import express, { NextFunction, Request, Response, urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import mongoose from "mongoose";
import { connectDb } from "./config/dbConn";
import { logEvents, logger } from "./middleware/logger";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions";
import { errorHandler } from "./middleware/errorHandler";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/session";
import videosRoutes from "./routes/videos";
import creditsRoutes from "./routes/credits";
import deserializeUser from "./middleware/deserializeUser";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const PORT = process.env.PORT || 7001;
const app = express();
connectDb();
app.use(logger);
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === "/api/credits/add-credits") {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json({ limit: "100mb" })(req, res, next);
  }
});
app.use(urlencoded({ extended: true, limit: "100mb" }));
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "../../frontend/build")));
app.use(deserializeUser);
app.use("/api/users", usersRoutes);
app.use("/api/sessions", authRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/credits", creditsRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
});
app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, async () => {
    console.log(`server running on localhost:${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
