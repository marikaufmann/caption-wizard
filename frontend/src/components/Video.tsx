import { Trash2, X } from "lucide-react";
import { VideoType } from "../../../backend/src/shared/types";
import * as apiClient from "../api-client";
import { useMutation, useQueryClient } from "react-query";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "../hooks/use-app-context";
import { secondsToHours } from "../utils";

const Video = ({ video }: { video: VideoType }) => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteVideo, isLoading: isDeleting } = useMutation(
    apiClient.deleteVideo,
    {
      onMutate: (deletedId) => {
        queryClient.cancelQueries("fetchUsersVideos");
        const prevResult = queryClient.getQueryData(
          "fetchUsersVideos"
        ) as VideoType[];
        queryClient.setQueryData(
          "fetchUsersVideos",
          prevResult.filter((video) => video._id !== deletedId)
        );
        return () => queryClient.setQueryData("fetchUsersVideos", prevResult);
      },
      onError: (err: Error) => {
        showToast({ message: err.message, type: "ERROR" });
      },
      onSuccess: () => {
        queryClient.invalidateQueries("fetchUsersVideos");
        setIsDeleteOpen(false);
      },
    }
  );

  return (
    <div>
      {isDeleteOpen && (
        <div className="inset-0 fixed bg-black/50 w-full flex items-center justify-center">
          <div className="relative max-w-md w-full  mx-auto bg-darkGray px-10  py-5 rounded-2xl flex flex-col gap-6 tracking-wider">
            <button
              className="absolute top-2 right-3"
              onClick={() => setIsDeleteOpen(false)}
              aria-label="close"
            >
              <X className="text-white/50  hover:text-white/80" />
            </button>
            <div className="flex flex-col text-center gap-12 font-semibold">
              <h1 className="text-white/90  text-xl">Delete Project?</h1>
              <p className="text-white/80 ">
                Are you sure that you want to delete this project? This action
                is permanent.
              </p>
              <div className="flex justify-between items-center gap-4">
                <button
                  className="py-3 flex-1 flex items-center justify-center text-gray-500 border border-gray-500 rounded-lg hover:bg-[#4b4c54] hover:text-white/90"
                  onClick={() => setIsDeleteOpen(false)}
                  aria-label="cancel"
                >
                  Cancel
                </button>
                <button
                  className="bg-[#FFE8E6] hover:bg-[#FFE8E6]/70 hover:text-red-700 text-red-500 py-3 flex-1 rounded-lg flex items-center justify-center "
                  onClick={() => {
                    deleteVideo(video._id);
                  }}
                  aria-label="delete video"
                >
                  {isDeleting ? (
                    <div className="flex gap-2 items-center">
                      Deleting
                      <Loader />
                    </div>
                  ) : (
                    <>Delete</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-darkGray hover:bg-lightGray flex h-[90px] gap-10 p-4 justify-between items-center rounded-lg  w-full cursor-pointer">
        <Link
          to={`/projects/${video._id}`}
          className="flex justify-between items-center gap-6 lg:gap-10"
        >
          <div className="flex gap-3 items-center ">
            <div className="w-16 h-16 overflow-hidden rounded-lg">
              <img
                src={video.thumbnail}
                alt="video thumbnail"
                className="object-cover object-top w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold  text-white/80 xs:w-[330px] w-[280px] sm:w-[130px] lg:w-[240px]  truncate">
                {video.name}
              </h3>
              <p className="text-white/60  font-semibold">
                {/* {video.duration} */}
                {secondsToHours(Number(video.duration))}
              </p>
            </div>
          </div>
          <div className="gap-3 sm:flex hidden lg:gap-8 md:gap-6 items-center">
            <dl className="flex max-md:flex-col flex-1">
              <dt className="text-white/60 font-semibold  whitespace-nowrap">
                Dimentions |&nbsp;
              </dt>
              <dd className="font-semibold  text-white/80">
                {video.width}x{video.height}
              </dd>
            </dl>
            <dl className="flex max-md:flex-col flex-1 ">
              <dt className="text-white/60 font-semibold  whitespace-nowrap">
                Size |&nbsp;
              </dt>
              <dd className="font-semibold  text-white/80">{video.size}</dd>
            </dl>
            <dl className="flex max-md:flex-col  ">
              <dt className="text-white/60 font-semibold  whitespace-nowrap">
                Frame Rate |&nbsp;
              </dt>
              <dd className="font-semibold  text-white/80">
                {video.frame_rate} fps
              </dd>
            </dl>
          </div>
        </Link>
        <button
          className="hover:bg-white/20 p-1 rounded-full w-10  items-center justify-center flex"
          onClick={() => setIsDeleteOpen(true)}
          disabled={isDeleting}
          aria-label="open delete window"
        >
          {isDeleting ? (
            <Loader />
          ) : (
            <Trash2 className="w-5 h-5 text-white/60" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Video;
