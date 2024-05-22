import { ProgressBar } from "react-loader-spinner";
const VideoResult = ({
  videoUrl,
  videoDownloadUrl,
  videoName,
  applyingStatus,
  vertical,
}: {
  videoUrl: string | undefined;
  videoDownloadUrl: string | undefined;
  videoName: string | undefined;
  isApplyingCaptions: boolean;
  isApplied: boolean;
  applyingStatus: string;
  vertical: boolean;
}) => {
  return (
    <div className={`${vertical ? "" : "w-full"}`}>
      <div className="flex flex-col gap-4">
        <div
          className={`rounded-md ${
            vertical ? "w-[350px] lg:w-[480px] md:w-[400px]" : "w-full"
          }  relative overflow-hidden`}
        >
          {applyingStatus !== "" && (
            <div className="absolute inset-0 bg-black/90">
              <div className="flex w-full h-full items-center justify-center">
                <div className="w-full relative font-semibold text-2xl flex flex-col  justify-center items-center text-white/90 tracking-wide">
                  <p className="-mb-8">{applyingStatus}</p>
                  {applyingStatus !== "Done!" && (
                    <ProgressBar
                      visible={true}
                      height="120"
                      width="220"
                      barColor="#E9E9E9"
                      borderColor="#404349"
                      ariaLabel="progress-bar-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          <video
            src={videoUrl}
            muted
            playsInline
            controls
            controlsList="nodownload"
            disablePictureInPicture
            className="w-full h-full object-cover rounded-md "
          ></video>
        </div>
        <a
          href={videoDownloadUrl}
          download={videoName}
          className={`bg-[#25282D] border border-white/50 text-white/90 text-center font-semibold tracking-wider md:text-lg w-full py-3 rounded-lg max-laptop:hidden hover:bg-[#34383f] hover:text-white`}
        >
          Download video
        </a>
      </div>
    </div>
  );
};

export default VideoResult;
