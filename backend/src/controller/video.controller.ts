import { Request, Response } from "express";
import { VideoType } from "../shared/types";
import {
  deleteVideoFromCloud,
  findAndUpdateVideo,
  findVideo,
  getVideos,
  saveVideo,
  transcribeFile,
  transformCaptionsIntoArrays,
  uploadVideo,
  uploadVideoWithCaptions,
} from "../service/video.service";
import { MulterError } from "multer";
import { SyncPrerecordedResponse } from "@deepgram/sdk";
import { findAndUpdateUser, findUser } from "../service/user.service";
export const uploadVideoHandler = async (req: Request, res: Response) => {
  try {
    const videoFile = req.file as Express.Multer.File;
    const newVideo: VideoType = req.body;
    const user = await findUser({ _id: req.user._id });
    let notEnoughCredits = false;
    if (newVideo.duration / 60 > user!.credits) {
      notEnoughCredits = true;
      return res.status(400).json({
        message: "Looks like you don't have enough credits to proceed.",
      });
    }
    const videoData = await uploadVideo(videoFile);
    let downloadUrl = videoData.videoUrl.split("/");
    downloadUrl.forEach((item, i) => {
      if (i == 6) downloadUrl[i] = "fl_attachment";
    });
    newVideo.downloadUrl = downloadUrl.join("/");
    newVideo.user = req.user._id;
    newVideo.frame_rate = videoData.frame_rate;
    newVideo.videoOriginalPublicId = videoData.videoPublicId;
    newVideo.videoOriginalUrl = videoData.videoUrl;

    const video = await saveVideo(newVideo);
    const { result } = await transcribeFile(
      video.videoOriginalUrl,
      video.language
    );

    const {
      singleWordCaptionsArray,
      lineCaptionsArray,
      sentenceCaptionsArray,
    } = await transformCaptionsIntoArrays(result as SyncPrerecordedResponse);
    await findAndUpdateVideo(
      { user: req.user._id, _id: video._id },
      {
        captions: [
          {
            singleWordCaptions: singleWordCaptionsArray,
            lineCaptions: lineCaptionsArray,
            sentenceCaptions: sentenceCaptionsArray,
          },
        ],
      }
    );
    const newuser = await findAndUpdateUser(
      {
        _id: user?._id,
      },
      {
        $inc: {
          credits: -(newVideo.duration / 60),
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).send({ video, result, notEnoughCredits });
  } catch (err) {
    if (err instanceof MulterError) {
      return res
        .status(400)
        .json({ message: "Invalid video data was passed." });
    }
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const getVideosHandler = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const userVideos = await getVideos({ user: userId });
  return res.send(userVideos);
};

export const getVideoHandler = async (req: Request, res: Response) => {
  try {
    const video = await findVideo({
      user: req.user._id,
      _id: req.params.videoId,
    });
    if (!video) return res.status(404).json({ message: "Video not found." });

    return res.status(200).send(video);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};
export const updateVideoHandler = async (req: Request, res: Response) => {
  try {
    const updatedVideo = await findAndUpdateVideo(
      { user: req.user._id, _id: req.params.videoId },
      { captions: [req.body.newCaptions] },
      { new: true }
    );
    if (!updatedVideo)
      return res.status(404).json({ message: "Video not found." });
    return res.status(200).send(updatedVideo);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteVideoHandler = async (req: Request, res: Response) => {
  try {
    const video = await findVideo({
      user: req.user._id,
      _id: req.params.videoId,
    });
    if (!video) return res.status(404).json({ message: "Video not found." });
    await video?.deleteOne();
    await deleteVideoFromCloud({
      original: video.videoOriginalPublicId,
      withCaptions: video.videoWithCaptionsPublicId,
    });
    return res
      .status(200)
      .json({ message: `Video ${video.name} deleted successfully.` });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const addCaptionsHandler = async (req: Request, res: Response) => {
  try {
    const videoFile = req.file as Express.Multer.File;
    const video = await findVideo({
      user: req.user._id,
      _id: req.params.videoId,
    });
    if (!video) return res.status(404).json({ message: "Video not found." });
    const videoData = await uploadVideoWithCaptions(video, videoFile);
    let downloadUrl = videoData.videoWithCaptionslUrl.split("/");
    downloadUrl.forEach((item, i) => {
      if (i == 6) downloadUrl[i] = "fl_attachment";
    });
    const updatedVideo = await findAndUpdateVideo(
      { user: req.user._id, _id: req.params.videoId },
      {
        videoWithCaptionslUrl: videoData.videoWithCaptionslUrl,
        videoWithCaptionsPublicId: videoData.videoWithCaptionsPublicId,
        downloadUrl: downloadUrl.join("/"),
      },
      { new: true }
    );
    return res.status(200).send(updatedVideo);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};
