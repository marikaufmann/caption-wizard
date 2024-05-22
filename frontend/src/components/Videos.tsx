import { useQuery } from "react-query";
import { VideoType } from "../../../backend/src/shared/types";
import Video from "./Video";
import * as apiClient from "../api-client";
import { useEffect } from "react";
import { format } from "date-fns";
import SkeletonLoader from "./VideosSkeleton";
import MainLoader from "./MainLoader";
import VideoPreview from "./VideoPreview";
import { useAppContext } from "../hooks/use-app-context";
import Icons from "./Icons";

const Videos = ({
  videoPreview,
  setVideoPreview,
  selectedFile,
  videoUploaded,
  previewFile,
}: {
  previewFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  videoPreview: string | null;
  setVideoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  selectedFile: File | undefined;
  videoUploaded: (status: boolean) => void;
}) => {
  const { showToast } = useAppContext();

  const {
    data: usersVideos,
    refetch: refetchVideos,
    isLoading: isLoadingVideos,
    isRefetching: isRefetchingVideos,
  } = useQuery("fetchUsersVideos", apiClient.fetchUsersVideos, {
    refetchOnWindowFocus: false,
    onError: (err: Error) => {
      showToast({ message: err.message, type: "ERROR" });
    },
  });

  useEffect(() => {
    if (usersVideos && usersVideos.length > 0) {
      videoUploaded(true);
    } else {
      videoUploaded(false);
    }
  }, [usersVideos, videoUploaded]);

  let grouped: { [date: string]: VideoType[] } = {};

  if (usersVideos && usersVideos.length > 0) {
    grouped = usersVideos.reduce(
      (acc: { [date: string]: VideoType[] }, el: VideoType) => {
        (acc[
          new Date(el.createdAt)
            .toLocaleString("en", { timeZone: "Israel" })
            .slice(0, 10)
        ] =
          acc[
            new Date(el.createdAt)
              .toLocaleString("en", { timeZone: "Israel" })
              .slice(0, 10)
          ] || []).push(el);
        return acc;
      },
      {}
    );
  }

  if (isLoadingVideos) {
    return <MainLoader />;
  }
  if (isRefetchingVideos) {
    return <SkeletonLoader />;
  }
  const onInputClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  return (
    <>
      {usersVideos && usersVideos.length > 0 ? (
        <div
          className="
         h-full sm:px-10 px-2 flex flex-col  max-w-7xl mx-auto w-full divide-y divide-gray-600/30"
        >
          {Object.entries(grouped).map(([time, videos]) => (
            <div className="date-group flex flex-col gap-3 py-6" key={time}>
              <h1 className="font-semibold text-white/60 tracking-wide">
                {time ===
                new Date()
                  .toLocaleString("en", { timeZone: "Israel" })
                  .slice(0, 10)
                  ? "Today"
                  : format(time, "MM/dd/yyyy")}
              </h1>
              <div className="flex flex-col gap-4">
                {videos.map((usersVideo: VideoType) => (
                  <div key={usersVideo._id}>
                    <Video video={usersVideo} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-16 px-2">
          <div className="max-w-3xl mx-auto bg-darkGray p-8 rounded-2xl">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 " id="upload-svg">
                <Icons.Cloud props="w-24 h-24" />
              </div>
              <h1 className="mb-4 font-bold tracking-wide text-lg">
                Create your first project
              </h1>
              <label
                htmlFor="uploadVideo"
                className="bg-primary shadow-primary/50 text-white/90 tracking-wider flex w-[400px] items-center justify-center  md:px-10 py-3 px-8 rounded-lg shadow-2xl hover:bg-primary/80 font-semibold cursor-pointer"
              >
                Upload a video (MP4 file, up to 1 GB)
                <input
                  id="uploadVideo"
                  onClick={onInputClick}
                  type="file"
                  accept="video/mp4"
                  className="hidden"
                  aria-label="upload video"
                  onChange={previewFile}
                />
              </label>
            </div>
          </div>
        </div>
      )}
      {videoPreview != null && (
        <VideoPreview
          videoPreview={videoPreview}
          refetchVideos={refetchVideos}
          setVideoPreview={setVideoPreview}
          selectedFile={selectedFile}
        />
      )}
    </>
  );
};

export default Videos;
