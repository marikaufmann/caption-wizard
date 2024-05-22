import { ChevronDown, Frown } from "lucide-react";
import { useMutation, useQuery } from "react-query";
import { useAppContext } from "../hooks/use-app-context";
import * as apiClient from "../api-client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TranscriptionEditor from "../components/TranscriptionEditor";
import { CaptionsType } from "../../../backend/src/shared/types";
import VideoResult from "../components/VideoResult";
import { fetchFile } from "@ffmpeg/util";
import {
  sizeOptionsHandler,
  toFFmpegColor,
  transcriptionItemsToSrt,
} from "../utils";
import Loader from "../components/Loader";
import { demoOptions } from "../config";
import ProjectDetailsNav from "../components/ProjectDetailsNav";
import CaptionsEditOptions from "../components/CaptionsEditOptions";
import TranscriptionSkeleton from "../components/TranscriptionSkeleton";
import Icons from "../components/Icons";
const ProjectDetails = () => {
  const { projectId } = useParams();
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [outlineColor, setOutlineColor] = useState("#000000");

  const [changesAdded, setChangesAdded] = useState(false);
  const [downloadVideoUrl, setDownloadVideoUrl] = useState("");
  const [loadingMessageChrome, setLoadingMessageChrome] = useState(
    "Loading your video..."
  );
  const [loadingMessageOtherBrowsers, setLoadingMessageOtherBrowsers] =
    useState("Loading your video...");
  const [vertical, setVertical] = useState(true);
  const [applyingStatus, setApplyingStatus] = useState("");
  const [videoSource, setVideoSource] = useState<string | undefined>(undefined);
  const [transcriptionSingleWordItems, setTranscriptionSingleWordItems] =
    useState<CaptionsType["singleWordCaptions"]>([]);
  const [transcriptionLineItems, setTranscriptionLineItems] = useState<
    CaptionsType["lineCaptions"]
  >([]);
  const [transcriptionSentenceItems, setTranscriptionSentenceItems] = useState<
    CaptionsType["sentenceCaptions"]
  >([]);
  const [singleWordCaptionsSelected, setSingleWordCaptionsSelected] =
    useState(true);
  const [lineCaptionsSelected, setLineCaptionsSelected] = useState(false);
  const [sentenceCaptionsSelected, setSentenceCaptionsSelected] =
    useState(false);
  const [language, setLanguage] = useState("");
  const [fontWeight, setFontWeight] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [fontSize, setFontSize] = useState<{
    value: number;
    label: string;
  } | null>(
    vertical
      ? singleWordCaptionsSelected
        ? {
            value: 30,
            label: "30",
          }
        : lineCaptionsSelected
        ? {
            value: 24,
            label: "24",
          }
        : {
            value: 14,
            label: "14",
          }
      : {
          value: 30,
          label: "30",
        }
  );
  const sizeOptions = useMemo(() => sizeOptionsHandler(), []);
  const { showToast, ffmpegRef, loaded, chrome } = useAppContext();

  const {
    data: video,
    refetch: refetchVideo,
    isLoading: isLoadingVideo,
    isSuccess: isFetchedVideo,
    isRefetching: isRefetchingVideo,
  } = useQuery(
    "fetchVideo",
    () => apiClient.fetchProject(projectId as string),
    {
      refetchOnWindowFocus: false,
      onError: (err: Error) => {
        showToast({ message: err.message, type: "ERROR" });
      },
    }
  );

  const demoStyle = {
    textShadow: `-1.5px -1.5px 0 ${outlineColor},\n    1.5px -1.5px 0 ${outlineColor},\n    -1.5px 1.5px 0 ${outlineColor},\n    1.5px 1.5px 0 ${outlineColor}`,
    color: `${primaryColor}`,
    fontFamily: `${
      language === "ja"
        ? "Noto Sans Japanese"
        : language === "ko"
        ? "Noto Sans Korean"
        : language === "el"
        ? "GFS Didot"
        : language === "hi"
        ? "Tiro Devanagari Hindi"
        : language === "th"
        ? "Kanit"
        : "Montserrat"
    }`,
    fontWeight: `${
      fontWeight?.label === "Regular"
        ? 400
        : fontWeight?.label === "Medium"
        ? 500
        : fontWeight?.label === "SemiBold"
        ? 600
        : fontWeight?.label === "Bold"
        ? 700
        : fontWeight?.label === "ExtraBold"
        ? 800
        : 900
    }`,
    fontSize: fontSize?.value,
  };
  useEffect(() => {
    if (video?.captions && video.captions.length > 0) {
      video.captions.forEach((captions) => {
        setTranscriptionSingleWordItems(captions.singleWordCaptions);
        setTranscriptionLineItems(captions.lineCaptions);
        setTranscriptionSentenceItems(captions.sentenceCaptions);
      });
    }
  }, [video, videoSource]);

  const { mutate: updateCaptions, isLoading: isUpdatingCaptions } = useMutation(
    apiClient.updateVideo,
    {
      onError: (err: Error) => {
        showToast({ message: err.message, type: "ERROR" });
      },
      onSuccess: async () => {
        setChangesAdded(false);
        showToast({ message: "Captions updated.", type: "SUCCESS" });
      },
    }
  );

  const {
    mutate: applyCaptions,
    isLoading: isApplyingCaptions,
    isSuccess: isApplied,
  } = useMutation(apiClient.addCaptions, {
    onError: (err: Error) => {
      showToast({ message: err.message, type: "ERROR" });
    },
    onSuccess: async () => {
      refetchVideo();
      showToast({ message: "Captions added.", type: "SUCCESS" });
    },
  });

  useEffect(() => {
    if (isApplyingCaptions) {
      setApplyingStatus("Almost there...");
    } else if (isApplied && isRefetchingVideo) {
      setApplyingStatus("Done!");
    } else {
      setApplyingStatus("");
    }
  }, [isApplyingCaptions, isRefetchingVideo, isApplied]);

  const transcode = async () => {
    if (video) {
      setApplyingStatus("Please wait...");
      const ffmpeg = ffmpegRef.current;
      const srt = singleWordCaptionsSelected
        ? transcriptionItemsToSrt(transcriptionSingleWordItems)
        : lineCaptionsSelected
        ? transcriptionItemsToSrt(transcriptionLineItems)
        : transcriptionItemsToSrt(transcriptionSentenceItems);
      await ffmpeg.writeFile(
        video?.name,
        await fetchFile(video?.videoOriginalUrl)
      );
      await ffmpeg.writeFile("subs.srt", srt);
      if (!singleWordCaptionsSelected && vertical) {
        if (lineCaptionsSelected) {
          await ffmpeg.exec([
            "-i",
            video?.name,
            "-preset",
            "ultrafast",
            "-vf",
            `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=${
              fontWeight?.value
            },FontSize=${
              fontSize?.label
            },MarginV=50,PrimaryColour=${toFFmpegColor(
              primaryColor
            )},OutlineColour=${toFFmpegColor(outlineColor)}'`,
            "output.mp4",
          ]);
        } else {
          await ffmpeg.exec([
            "-i",
            video?.name,
            "-preset",
            "ultrafast",
            "-vf",
            `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=${
              fontWeight?.value
            },FontSize=${
              fontSize?.label
            },MarginV=50,PrimaryColour=${toFFmpegColor(
              primaryColor
            )},OutlineColour=${toFFmpegColor(outlineColor)}'`,
            "output.mp4",
          ]);
        }
      } else {
        await ffmpeg.exec([
          "-i",
          video?.name,
          "-preset",
          "ultrafast",
          "-vf",
          `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=${
            fontWeight?.value
          },FontSize=${
            fontSize?.label
          },MarginV=70,PrimaryColour=${toFFmpegColor(
            primaryColor
          )},OutlineColour=${toFFmpegColor(outlineColor)}'`,
          "output.mp4",
        ]);
      }

      const data = (await ffmpeg.readFile("output.mp4")) as any;
      const formData = new FormData();
      formData.append(
        "newVideoFile",
        new Blob([data.buffer], { type: "video/mp4" })
      );
      applyCaptions({
        projectId: projectId || "",
        formData,
      });
    }
  };

  useEffect(() => {
    if (isFetchedVideo && isApplied) {
      setVideoSource(video.videoWithCaptionslUrl);
      setDownloadVideoUrl(video.downloadUrl);
      setLanguage(video.language as string);
      setFontWeight(
        language === "ja"
          ? { value: "Noto Sans JP ExtraBold", label: "ExtraBold" }
          : language === "ko"
          ? { value: "Noto Sans KR ExtraBold", label: "ExtraBold" }
          : language === "el"
          ? { value: "GFS Didot Regular", label: "Regular" }
          : language === "hi"
          ? { value: "Tiro Devanagari Hindi Regular", label: "Regular" }
          : language === "th"
          ? { value: "Kanit ExtraBold", label: "ExtraBold" }
          : { value: "Montserrat ExtraBold", label: "ExtraBold" }
      );
    }

    setVideoSource(
      video?.videoWithCaptionslUrl
        ? video?.videoWithCaptionslUrl
        : video?.videoOriginalUrl
    );
    setDownloadVideoUrl(video?.downloadUrl as string);
    setLanguage(video?.language as string);
    setFontWeight(
      language === "ja"
        ? { value: "Noto Sans JP ExtraBold", label: "ExtraBold" }
        : language === "ko"
        ? { value: "Noto Sans KR ExtraBold", label: "ExtraBold" }
        : language === "el"
        ? { value: "GFS Didot Regular", label: "Regular" }
        : language === "hi"
        ? { value: "Tiro Devanagari Hindi Regular", label: "Regular" }
        : language === "th"
        ? { value: "Kanit ExtraBold", label: "ExtraBold" }
        : { value: "Montserrat ExtraBold", label: "ExtraBold" }
    );

    if (Number(video?.height) > Number(video?.width)) {
      setVertical(true);
    } else {
      setVertical(false);
    }
  }, [isFetchedVideo, isApplied, video, language]);

  useEffect(() => {
    if (chrome) {
      const changeLoadMsg = setTimeout(() => {
        setLoadingMessageChrome(
          "It’s taking longer than expected, but we’ll get there as fast as we can"
        );
      }, 15000);
      return () => {
        clearTimeout(changeLoadMsg);
        setLoadingMessageChrome("Loading your video...");
      };
    } else {
      const changeLoadMsg = setTimeout(() => {
        setLoadingMessageOtherBrowsers(
          "If loading takes too long, please try opening the website on your PC or using the Chrome browser."
        );
      }, 15000);
      return () => {
        clearTimeout(changeLoadMsg);
        setLoadingMessageOtherBrowsers("Loading your video...");
      };
    }
  }, [chrome]);

  return (
    <div className="min-h-screen h-full w-full bg-background text-white  flex flex-col divide-y divide-gray-600/30 pb-20 tracking-wide">
      <ProjectDetailsNav name={video?.name || ""} />
      <div
        className={`flex w-full min-h-screen md:px-8 sm:px-6 px-2 py-12 max-w-7xl mx-auto h-full  ${
          vertical ? "laptop:flex-row flex-col" : "flex-col"
        } max-laptop:items-center  ${
          video?.captions && video?.captions.length > 0 ? "" : "items-center"
        }   overflow-hidden gap-6`}
      >
        {isLoadingVideo || !loaded ? (
          <div
            className={`rounded-md bg-lightGray w-full flex items-center justify-center flex-col gap-2  ${
              vertical ? "h-[800px]" : "h-[400px]"
            }`}
          >
            {chrome ? (
              <>
                <Icons.Spinner />
                <p className="bg-gradient-to-r from-[#A3CDCD] to-primaryDarker text-transparent bg-clip-text text-2xl  font-bold tracking-wider">
                  {loadingMessageChrome}
                </p>
              </>
            ) : (
              <>
                <Icons.Spinner />
                <p className="bg-gradient-to-r from-[#A3CDCD] to-primaryDarker text-transparent bg-clip-text text-2xl px-20 text-center font-bold tracking-wider">
                  {loadingMessageOtherBrowsers}
                </p>
              </>
            )}
          </div>
        ) : (
          <VideoResult
            videoUrl={videoSource}
            videoDownloadUrl={video?.downloadUrl}
            videoName={video?.name}
            isApplyingCaptions={isApplyingCaptions}
            isApplied={isApplied}
            applyingStatus={applyingStatus}
            vertical={vertical}
          />
        )}

        {!video?.captions &&
          transcriptionSingleWordItems.length < 1 &&
          !isLoadingVideo &&
          !loaded && (
            <div className="flex items-center gap-4 tracking-wider mt-2 w-full text-white/80">
              <Frown className="w-10 h-10" />
              <p>
                Oops, looks like no captions were generated... <br />
                Either no one spoke in the video or you've chosen the wrong
                language. <br /> Please try again and choose the language spoken
                in your video.
              </p>
            </div>
          )}
        <div className="flex flex-col gap-6 w-full h-full">
          <div className="flex  gap-4  justify-between w-full font-semibold tracking-wider ">
            <button
              className={`flex gap-2 items-center flex-1 rounded-lg p-2  ${
                singleWordCaptionsSelected
                  ? "text-white   bg-[#26282d]"
                  : "text-white/40"
              }`}
              onClick={() => {
                setSingleWordCaptionsSelected(true);
                setLineCaptionsSelected(false);
                setSentenceCaptionsSelected(false);
                setFontSize({
                  value: 30,
                  label: "30",
                });
              }}
              aria-label="word by word"
            >
              <h1 className="">Word by word</h1>
              <ChevronDown className="w-5 h-5" />
            </button>
            <button
              className={`flex gap-2 items-center flex-1 rounded-lg p-2  ${
                lineCaptionsSelected
                  ? "text-white  bg-[#26282d]"
                  : "text-white/40"
              }`}
              onClick={() => {
                setSingleWordCaptionsSelected(false);
                setLineCaptionsSelected(true);
                setSentenceCaptionsSelected(false);
                setFontSize(
                  vertical
                    ? {
                        value: 24,
                        label: "24",
                      }
                    : { value: 30, label: "30" }
                );
              }}
              aria-label="line by line"
            >
              <h1 className="">Line by line</h1>
              <ChevronDown className="w-5 h-5" />
            </button>
            <button
              className={`flex gap-2 items-center  flex-1 rounded-lg p-2 ${
                sentenceCaptionsSelected
                  ? "text-white  bg-[#26282d]"
                  : "text-white/40"
              }`}
              onClick={() => {
                setSingleWordCaptionsSelected(false);
                setLineCaptionsSelected(false);
                setSentenceCaptionsSelected(true);
                setFontSize(
                  vertical
                    ? {
                        value: 14,
                        label: "14",
                      }
                    : { value: 30, label: "30" }
                );
              }}
              aria-label="sentence by sentence"
            >
              <h1>Sentence by sentence</h1>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          {isLoadingVideo || !loaded ? (
            <TranscriptionSkeleton />
          ) : (
            <TranscriptionEditor
              transcriptionSingleWordItems={transcriptionSingleWordItems}
              setTranscriptionSingleWordItems={setTranscriptionSingleWordItems}
              transcriptionLineItems={transcriptionLineItems}
              setTranscriptionLineItems={setTranscriptionLineItems}
              transcriptionSentenceItems={transcriptionSentenceItems}
              setTranscriptionSentenceItems={setTranscriptionSentenceItems}
              singleWordCaptionsSelected={singleWordCaptionsSelected}
              lineCaptionsSelected={lineCaptionsSelected}
              setChangesAdded={setChangesAdded}
            />
          )}

          <div className="flex flex-col gap-6 h-full ">
            <CaptionsEditOptions
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor}
              outlineColor={outlineColor}
              setOutlineColor={setOutlineColor}
              sizeOptions={sizeOptions}
              fontSize={fontSize}
              setFontSize={setFontSize}
              language={language}
              setFontWeight={setFontWeight}
            />
            {isLoadingVideo || !loaded ? (
              <div
                className={`bg-[#404348] h-[70px] rounded-lg shadow-[#9DA0A8]/50  flex items-center justify-center p-4 text-5xl `}
              >
                <Loader styles="w-8 h-8" />
              </div>
            ) : (
              <div
                className={`bg-[#404348] h-[70px] rounded-lg shadow-[#9DA0A8]/50  flex items-center justify-center p-4 text-5xl `}
                style={demoStyle}
              >
                {
                  demoOptions.find((option) => option.language === language)
                    ?.demo
                }
              </div>
            )}
          </div>
          {changesAdded && (
            <button
              disabled={isUpdatingCaptions}
              onClick={() =>
                updateCaptions({
                  projectId: projectId || "",
                  newCaptions: {
                    singleWordCaptions: transcriptionSingleWordItems,
                    lineCaptions: transcriptionLineItems,
                    sentenceCaptions: transcriptionSentenceItems,
                  },
                })
              }
              className="bg-primary  text-white/90 tracking-wider flex w-full items-center justify-center py-3 md:py-2 md:text-lg rounded-lg shadow-2xl hover:bg-primary/80 font-semibold cursor-pointer"
              aria-label="save changes"
            >
              {isUpdatingCaptions ? (
                <div className="flex gap-2 items-center">
                  <p>Saving changes</p>
                  <Loader styles="w-5 h-5" />
                </div>
              ) : (
                "Save changes"
              )}
            </button>
          )}

          <button
            onClick={transcode}
            disabled={isApplyingCaptions}
            className="bg-primary shadow-primary/10 text-white/90 tracking-wider flex w-full items-center justify-center py-3  md:text-lg rounded-lg shadow-2xl hover:bg-primary/80 font-semibold cursor-pointer"
            aria-label="apply captions"
          >
            {isApplyingCaptions || applyingStatus !== "" ? (
              <div className="flex gap-2 items-center">
                <p>Applying captions...</p>
                <Loader styles="w-5 h-5" />
              </div>
            ) : (
              "Apply captions"
            )}
          </button>
          <a
            href={downloadVideoUrl}
            download={video?.name}
            className={`bg-[#25282D] border border-white/50 text-white/90 text-center font-semibold tracking-wider md:text-lg w-full py-3 rounded-lg laptop:hidden hover:bg-[#34383f] hover:text-white`}
          >
            Download video
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
