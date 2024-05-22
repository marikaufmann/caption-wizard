import mongoose from "mongoose";
import { VideoType } from "../shared/types";
import { captionsSchema } from "./captions.model";

const videoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    size: { type: String, required: true },
    language: { type: String, required: true },
    frame_rate: { type: Number, required: true },
    downloadUrl: { type: String, required: true },
    videoOriginalUrl: { type: String, required: true },
    videoOriginalPublicId: { type: String, required: true },
    videoWithCaptionslUrl: { type: String },
    videoWithCaptionsPublicId: { type: String },
    captions: [captionsSchema],
  },
  { timestamps: true }
);

const VideoModel = mongoose.model<VideoType>("Video", videoSchema);
export default VideoModel;
