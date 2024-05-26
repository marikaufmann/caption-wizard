import { Search, Sparkles, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "./Loader";

import Select from "react-select";
import { readBytes, secondsToHours } from "../utils";
import { useAppContext } from "../hooks/use-app-context";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { VideoType } from "../../../backend/src/shared/types";
import * as apiClient from "../api-client";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import { languageOptions } from "../config";
import { Link } from "react-router-dom";

const VideoPreview = ({
  videoPreview,
  setVideoPreview,
  refetchVideos,
  selectedFile,
}: {
  videoPreview: string | null;
  setVideoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  refetchVideos: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<VideoType[], unknown>>;
  selectedFile: File | undefined;
}) => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [notEnoughCredits, setNotEnoughCredits] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [formattedDuration, setFormattedDuration] = useState<
    string | undefined
  >(undefined);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [language, setLanguage] = useState<{
    value: string;
    label: string[];
  } | null>(null);

  function clearFiles() {
    setVideoPreview(null);
  }
  const { mutate: uploadVideo, isLoading: isUploadingVideo } = useMutation(
    apiClient.uploadVideo,
    {
      onError: (err: Error) => {
        showToast({ message: err.message, type: "ERROR" });
      },
      onSuccess: async () => {
        clearFiles();
        refetchVideos();
        await queryClient.invalidateQueries("fetchCurrentUser");
        showToast({ message: "Video uploaded successfully.", type: "SUCCESS" });
      },
    }
  );
  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("videoFile", file);
    formData.append("name", name as string);
    formData.append("duration", Number(duration).toString());
    formData.append("size", size as string);
    formData.append("width", Number(width).toString());
    formData.append("height", Number(height).toString());
    formData.append("thumbnail", thumbnail as string);
    formData.append("language", language?.value as string);
    uploadVideo(formData);
  };

  useEffect(() => {
    const fillVideoInfo = () => {
      if (selectedFile) {
        setHeight(videoElement?.videoHeight);
        setFormattedDuration(secondsToHours(videoElement?.duration));
        setDuration(videoElement?.duration);
        if (videoElement?.duration / 60 > currentUser!.credits) {
          setNotEnoughCredits(true);
        }
        setSize(
          readBytes(selectedFile.size, 1, (value) => setLimitExceeded(value))
        );
        setWidth(videoElement?.videoWidth);
        setName(selectedFile.name);
        generateVideoThumbnails(selectedFile, 1, "png")
          .then((thumbnailArray) => {
            setThumbnail(thumbnailArray[0]);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    };
    const videoElement = document.getElementById("video") as HTMLVideoElement;
    videoElement?.addEventListener("loadedmetadata", fillVideoInfo);
    return () =>
      videoElement?.removeEventListener("loadedmetadata", fillVideoInfo);
  }, [selectedFile, videoPreview, currentUser]);

  const formatOptionLabel = ({
    value,
    label,
  }: {
    value: string;
    label: string[];
  }) => (
    <div className="flex flex-col text-white/80 tracking-wide">
      <div className="font-semibold">{label[0]}</div>
      <div className="text-[#9DA0A8]">{label[1]}</div>
    </div>
  );
  return (
    <div className="inset-0 fixed bg-black/50 w-full flex items-center justify-center">
      <div
        className={`relative max-w-3xl w-full  mx-auto bg-darkGray px-8 py-10 rounded-2xl flex ${
          width! > height! ? "flex-col" : ""
        } gap-6`}
      >
        <button
          className="absolute top-2 right-3"
          onClick={clearFiles}
          aria-label="close"
        >
          <X className="text-white/50  hover:text-white/80" />
        </button>
        <div
          className={`rounded-lg  flex items-center justify-center ${
            width! > height! ? "w-full" : "w-[50%]"
          }  overflow-hidden `}
        >
          <video
            id="video"
            className={!videoPreview ? "hidden" : "block"}
            controls
            playsInline
            preload="auto"
            src={videoPreview as string}
          ></video>
        </div>
        <div
          className={`flex flex-col   ${
            width! > height! ? "w-full" : "w-[50%]"
          }`}
        >
          {name && (
            <h1 className=" text-white/90 font-semibold text-2xl mb-1 line-clamp-3  ">
              {name}
            </h1>
          )}
          {formattedDuration && width && height && size && (
            <p className="text-white/60 tracking-wider">
              {formattedDuration} • {width}x{height} • {size}
            </p>
          )}
          {limitExceeded  ? (
            <div className="flex mt-4 gap-4 tracking-wider items-center">
              <TriangleAlert className="text-red-500" />
              <p className="text-white/90">
                <span className="font-semibold text-red-500">
                  Oops, an error occurred!
                </span>{" "}
                <br />
                The file likely exceeds the maximum file size (100 MB) and cannot
                be uploaded. <br />
                Please try again with a smaller file.
              </p>
            </div>
          ) : (
            notEnoughCredits ? (
              <div className="flex mt-4 gap-4 tracking-wider items-center">
                <TriangleAlert className="text-red-500" />
                <p className="text-white/90">
                  <span className="font-semibold text-red-500">
                    Oops, an error occurred.
                  </span>{" "}
                  <br />
                  Looks like you are out of credits.
                  <br />
                  Not to worry! You can buy more{" "}
                  <Link
                    to="/credits"
                    className="underline underline-offset-2 font-semibold"
                  >
                    here
                  </Link>
                  .
                </p>
              </div>
            ) :
            <div>
              <div className="flex gap-2 flex-col h-fit mt-4">
                <h1 className="text-white/60">
                  Select the language spoken in your video
                </h1>
                <Select
                  minMenuHeight={300}
                  maxMenuHeight={320}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#696e77",
                      primary: "#126366",
                      neutral0: "#404348",
                      neutral20: "gray",
                      neutral80: "white",
                    },
                    borderRadius: 6,
                  })}
                  formatOptionLabel={formatOptionLabel}
                  className="w-full h-full "
                  options={languageOptions}
                  onChange={setLanguage}
                  placeholder={
                    <div className="flex items-center  tracking-wider gap-2 text-white/60  ">
                      <Search className="w-5 h-5 " />
                      <p>Search language</p>
                    </div>
                  }
                />
              </div>
              {!language && (
                <div className="flex items-center gap-2 tracking-wider mt-2 text-red-500">
                  <TriangleAlert />
                  <p>Language not selected</p>
                </div>
              )}
              <button
                disabled={isUploadingVideo || !language}
                onClick={() => uploadFile(selectedFile as File)}
                className={` mt-6  text-white/90 tracking-wider flex items-center justify-center text-lg  md:px-10 py-3 px-8 rounded-lg shadow-2xl  font-semibold cursor-pointer w-full ${
                  isUploadingVideo
                    ? "bg-primary/40 "
                    : "bg-primary shadow-primary/50 hover:bg-primary/80"
                }`}
                aria-label="generate captions"
              >
                {isUploadingVideo ? (
                  <div className="flex gap-2 items-center">
                    <p>Generating</p>
                    <Loader styles="w-5 h-5" />
                  </div>
                ) : (
                  <div className="flex gap-1 items-center">
                    Generate captions
                    <Sparkles className="w-5 h-5 ml-2" />
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
