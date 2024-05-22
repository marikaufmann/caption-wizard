import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { useRef } from "react";

const FFmpegLoader = () => {
    const ffmpegRef = useRef(new FFmpeg());
  return (
    <div>FFmpegLoader</div>
  )
}

export default FFmpegLoader