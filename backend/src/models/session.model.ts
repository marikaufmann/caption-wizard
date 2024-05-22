import mongoose from "mongoose";
import { SessionType } from "../shared/types";

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

export const SessionModel = mongoose.model<SessionType>(
  "Session",
  sessionSchema
);
