import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import {
  LineCaptionsType,
  SentenceCaptionsType,
  VideoType,
} from "../shared/types";
import VideoModel from "../models/video.model";
import cloudinary from "cloudinary";
import { createClient, SyncPrerecordedResponse } from "@deepgram/sdk";
import { findUser } from "./user.service";

export const getVideos = async (query: FilterQuery<VideoType>) => {
  return await VideoModel.find(query).sort({ createdAt: -1 });
};

export const findVideo = async (query: FilterQuery<VideoType>) => {
  return await VideoModel.findOne(query);
};

export const deleteVideoFromCloud = async ({
  original,
  withCaptions,
}: {
  original: string;
  withCaptions?: string;
}) => {
  await cloudinary.v2.uploader.destroy(original, {
    resource_type: "video",
  });
  if (withCaptions) {
    await cloudinary.v2.uploader.destroy(withCaptions, {
      resource_type: "video",
    });
  }
};
export const deleteAllVideosFromCloud = async (userId: string) => {
  const usersVideos = await VideoModel.find({ user: userId });
  usersVideos.forEach(async (video) => {
    await cloudinary.v2.uploader.destroy(video.videoOriginalPublicId, {
      resource_type: "video",
    });
    if (video.videoWithCaptionsPublicId) {
      await cloudinary.v2.uploader.destroy(video.videoWithCaptionsPublicId, {
        resource_type: "video",
      });
    }
  });
};
export const saveVideo = async (video: VideoType) => {
  return await VideoModel.create(video);
};
export const deleteAllVideos = async (query: FilterQuery<VideoType>) => {
  return await VideoModel.deleteMany(query);
};
export const uploadVideo = async (videoFile: Express.Multer.File) => {
  const b64 = Buffer.from(videoFile.buffer).toString("base64");
  let dataURI = "data:" + videoFile.mimetype + ";base64," + b64;
  const res = await cloudinary.v2.uploader.upload(dataURI, {
    resource_type: "video",
  });
  return {
    frame_rate: res.frame_rate.toFixed(2),
    videoUrl: res.secure_url,
    videoPublicId: res.public_id,
  };
};

export const transcribeFile = async (videoUrl: string, language: string) => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY as string);
  return await deepgram.listen.prerecorded.transcribeUrl(
    {
      url: videoUrl,
    },
    {
      model: "nova-2",
      smart_format: true,
      paragraphs: true,
      language: language,
    }
  );
};

export const findAndUpdateVideo = async (
  query: FilterQuery<VideoType>,
  update: UpdateQuery<VideoType>,
  options: QueryOptions = {}
) => {
  return await VideoModel.findOneAndUpdate(query, update, options);
};

export const uploadVideoWithCaptions = async (
  video: VideoType,
  videoFile: Express.Multer.File
) => {
  const b64 = Buffer.from(videoFile.buffer).toString("base64");
  let dataURI = "data:" + videoFile.mimetype + ";base64," + b64;
  if (video.videoWithCaptionsPublicId) {
    await cloudinary.v2.uploader.destroy(video.videoWithCaptionsPublicId, {
      resource_type: "video",
    });

    const res = await cloudinary.v2.uploader.upload(dataURI, {
      resource_type: "video",
    });
    return {
      videoWithCaptionslUrl: res.secure_url,
      videoWithCaptionsPublicId: res.public_id,
    };
  } else {
    const res = await cloudinary.v2.uploader.upload(dataURI, {
      resource_type: "video",
    });
    return {
      videoWithCaptionslUrl: res.secure_url,
      videoWithCaptionsPublicId: res.public_id,
    };
  }
};

export const transformCaptionsIntoArrays = async (
  result: SyncPrerecordedResponse
) => {
  const words = result?.results.channels[0].alternatives[0].words;
  const singleWordCaptionsArray = words?.map((caption) => ({
    ...caption,
    start: Number(caption.start.toFixed(2)),
    end: Number(caption.end.toFixed(2)),
  }));

  let lineCaptionsArray: LineCaptionsType[] = [];
  let step: number;
  const regex = /[!?.]+(?=$|\s)/;
  for (let i = 0; i < words.length; i += step) {
    let line = {
      start: 0,
      end: 0,
      text: "",
    };

    line.text += words[i]?.punctuated_word ? words[i]?.punctuated_word : "";
    step = 1;
    if (!regex.test(words[i]?.punctuated_word as string)) {
      line.text += words[i + 1]?.punctuated_word
        ? ((" " + words[i + 1]?.punctuated_word) as string)
        : "";
      step = 2;
      if (!regex.test(words[i + 1]?.punctuated_word as string)) {
        line.text += words[i + 2]?.punctuated_word
          ? ((" " + words[i + 2]?.punctuated_word) as string)
          : "";
        step = 3;

        if (!regex.test(words[i + 2]?.punctuated_word as string)) {
          line.text += words[i + 3]?.punctuated_word
            ? ((" " + words[i + 3]?.punctuated_word) as string)
            : "";
          step = 4;
        }
      }
    }

    line.start = Number(words[i]?.start.toFixed(2));
    line.end =
      step === 4 && words[i + 3]?.end
        ? Number(words[i + 3]?.end.toFixed(2))
        : step === 3 && words[i + 2]?.end
        ? Number(words[i + 2]?.end.toFixed(2))
        : step === 2 && words[i + 1]?.end
        ? Number(words[i + 1]?.end.toFixed(2))
        : Number(words[i]?.end.toFixed(2));
    const res = /[!?.]+(?=$|\s)/.test(words[i + 4]?.punctuated_word as string);
    if (step === 4 && !regex.test(words[i + 3]?.punctuated_word as string)) {
      if (regex.test(words[i + 4]?.punctuated_word as string)) {
        line.text += (" " + words[i + 4]?.punctuated_word) as string;
        line.end = Number(words[i + 4]?.end.toFixed(2));
        step = 5;
      } else {
        step = 4;
      }
    }
    lineCaptionsArray.push(line);
  }
  let sentenceCaptionsArray: SentenceCaptionsType[] = [];
  result?.results.channels[0].alternatives[0].paragraphs?.paragraphs.map(
    (paragraph) =>
      paragraph.sentences
        .map((sentence) => ({
          ...sentence,
          start: Number(sentence.start.toFixed(2)),
          end: Number(sentence.end.toFixed(2)),
        }))
        .map((sentence) => sentenceCaptionsArray.push(sentence))
  );

  return { singleWordCaptionsArray, lineCaptionsArray, sentenceCaptionsArray };
};
