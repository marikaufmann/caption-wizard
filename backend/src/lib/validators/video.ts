import { any, object, string, TypeOf, z } from "zod";

const payload = {
  body: object({
    videoFile: any(),
    name: string({ required_error: "Name is required" }),
    duration: string({ required_error: "Duration is required" }),
    size: string({ required_error: "Size is required" }),
    width: string({ required_error: "Width is required" }),
    height: string({ required_error: "Height is required" }),
    thumbnail: string({ required_error: "Thumbnail is required" }),
  }),
};

const params = {
  params: object({
    videoId: string({
      required_error: "videoId is required",
    }),
  }),
};

export const uploadVideoValidator = object({
  ...payload,
});
export const getVideoValidator = object({
  ...params,
});
export const updateVideoValidator = object({
  ...params,
});
export const deleteVideoValidator = object({
  ...params,
});
export const transcribeVideoValidator = object({
  ...params,
});
export type UploadVideoRequest = TypeOf<typeof uploadVideoValidator>;
export type GetVideoRequest = TypeOf<typeof getVideoValidator>;
export type UpdateVideoRequest = TypeOf<typeof updateVideoValidator>;
export type DeleteVideoRequest = TypeOf<typeof deleteVideoValidator>;
export type TranscribeVideoRequest = TypeOf<typeof transcribeVideoValidator>;
