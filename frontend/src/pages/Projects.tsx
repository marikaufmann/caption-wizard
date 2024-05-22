import { useState } from "react";
import Videos from "../components/Videos";

const Projects = () => {
  const [uploadsExist, setUploadsExist] = useState(false);
  const videoUploaded = (status: boolean) => {
    setUploadsExist(status);
  };

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  function previewFile(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const reader = new FileReader();

    const files = e.currentTarget.files;

    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        setSelectedFile(file);
        reader.readAsDataURL(file);
      }
      reader.onload = (readerEvent) => {
        if (file.type.includes("video")) {
          setVideoPreview(readerEvent.target!.result as string);
        }
      };
    }
  }
  const onInputClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const element = event.target as HTMLInputElement;
    element.value = "";
  };
  return (
    <div className="min-h-screen w-full bg-background text-white  flex flex-col border-y border-gray-600/30 pb-20">
      <div>
        <div className="flex items-center tracking-wide justify-between md:px-8 sm:px-6 px-2 py-12 max-w-7xl mx-auto  w-full">
          <h1 className="bg-gradient-to-r from-[#A3CDCD] to-primaryDarker text-transparent bg-clip-text text-4xl font-bold">
            Projects
          </h1>
          <label
            htmlFor="uploadVideoInput"
            className={`bg-primary ${
              uploadsExist ? "shadow-primary/50" : "shadow-primary/20"
            }  text-white/90 tracking-wider flex min-w-[100px] items-center justify-center  md:px-10 py-2 px-8 rounded-lg shadow-2xl hover:bg-primary/80 font-semibold cursor-pointer`}
          >
            Upload a video
            <input
              id="uploadVideoInput"
              type="file"
              onClick={onInputClick}
              accept="video/*"
              className="hidden"
              aria-label="upload video"
              onChange={previewFile}
            />
          </label>
        </div>
      </div>
      <Videos
        previewFile={(e: React.ChangeEvent<HTMLInputElement>) => previewFile(e)}
        selectedFile={selectedFile}
        setVideoPreview={setVideoPreview}
        videoPreview={videoPreview}
        videoUploaded={(status: boolean) => videoUploaded(status)}
      />
    </div>
  );
};

export default Projects;
