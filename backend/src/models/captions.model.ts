
import mongoose from "mongoose";

export const SingleWordCaptionsSchema = new mongoose.Schema({
  word: { type: String, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  confidence: { type: Number, required: true },
  punctuated_word: { type: String, required: true },
});
export const LineCaptionsSchema = new mongoose.Schema({
  text: { type: String, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
});
export const SentenceCaptionsSchema = new mongoose.Schema({
  text: { type: String, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
});

export const captionsSchema = new mongoose.Schema({
  singleWordCaptions: [SingleWordCaptionsSchema],
  lineCaptions: [LineCaptionsSchema],
  sentenceCaptions: [SentenceCaptionsSchema],
});

