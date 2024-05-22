import multer from "multer";
import express from "express";
import {
  addCaptionsHandler,
  deleteVideoHandler,
  getVideoHandler,
  getVideosHandler,
  updateVideoHandler,
  uploadVideoHandler,
} from "../controller/video.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  deleteVideoValidator,
  getVideoValidator,
} from "../lib/validators/video";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1000 * 1024 * 1024,
  },
});
const router = express.Router();
router.post("/", requireUser, upload.single("videoFile"), uploadVideoHandler);
router.get("/", requireUser, getVideosHandler);
router.get(
  "/:videoId",
  [requireUser, validateResource(getVideoValidator)],
  getVideoHandler
);
router.put("/:videoId", requireUser, updateVideoHandler);
router.delete(
  "/:videoId",
  [requireUser, validateResource(deleteVideoValidator)],
  deleteVideoHandler
);
router.post(
  "/:videoId/addCaptions",
  requireUser,
  upload.single("newVideoFile"),
  addCaptionsHandler
);
export default router;
