import { toBlobURL, fetchFile } from "@ffmpeg/util";
import {
  montserrat,
  montserratMedium,
  montserratSemiBold,
  montserratBold,
  montserratExtraBold,
  montserratBlack,
} from "./fonts/montserrat";
import {
  notoSansJP,
  notoSansJPMedium,
  notoSansJPSemiBold,
  notoSansJPBold,
  notoSansJPExtraBold,
  notoSansJPBlack,
} from "./fonts/japanese";
import {
  notoSansKR,
  notoSansKRMedium,
  notoSansKRSemiBold,
  notoSansKRBold,
  notoSansKRExtraBold,
  notoSansKRBlack,
} from "./fonts/korean";
import {
  kanit,
  kanitMedium,
  kanitSemiBold,
  kanitBold,
  kanitExtraBold,
  kanitBlack,
} from "./fonts/thai";
import hindi from "./fonts/hindi/TiroDevanagariHindi-Regular.ttf";
import greek from "./fonts/greek/GFSDidot-Regular.ttf";
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export const sizeOptionsHandler = () => {
  let sizeOptions: { value: number; label: string }[] = [];
  for (let i = 1; i <= 50; i++) {
    sizeOptions.push({ value: i, label: i.toString() });
  }
  return sizeOptions;
};

export const readBytes = (
  bytes: number,
  decimals = 2,
  handleLimit: (value: boolean) => void
) => {
  if (bytes >= 100000000) {
    handleLimit(true);
  } else {
    handleLimit(false);
  }
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  for (i; bytes >= 1024; i++) {
    bytes /= 1024;
  }
  return parseFloat(bytes.toFixed(decimals)) + " " + units[i];
};

export const secondsToHours = (time: number) => {
  time = Number(time);
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor((time % 3600) % 60);

  const hResult = hours > 0 ? hours + ":" : "";
  const mResult = minutes + ":";
  const sResult = seconds;
  return hResult + mResult + sResult;
};

export function secondsToHHMMSSMS(timeString: number) {
  const d = new Date(timeString * 1000);
  return d.toISOString().slice(11, 23).replace(".", ",");
}
export const transcriptionItemsToSrt = (
  items: {
    punctuated_word?: string;
    start: number;
    end: number;
    text?: string;
  }[]
) => {
  let srt = "";
  let i = 1;
  items
    .filter((item) => !!item)
    .forEach((item) => {
      srt += i + "\n";
      const { start, end } = item;
      srt += secondsToHHMMSSMS(start) + " --> " + secondsToHHMMSSMS(end) + "\n";

      srt += (item.punctuated_word ?? item.text) + "\n";
      srt += "\n";
      i++;
    });
  return srt;
};
export function toFFmpegColor(rgb: string) {
  const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
  return "&H" + bgr + "&";
}

export const loadFFmpeg = async (
  ref: React.MutableRefObject<FFmpeg>,
  handleLoaded: (value: boolean) => void
) => {
  const ffmpeg = ref.current;
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  await ffmpeg.writeFile(
    "/tmp/notoSansJP-regular.ttf",
    await fetchFile(notoSansJP)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansJP-medium.ttf",
    await fetchFile(notoSansJPMedium)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansJP-semibold.ttf",
    await fetchFile(notoSansJPSemiBold)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansJP-bold.ttf",
    await fetchFile(notoSansJPBold)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansJP-extrabold.ttf",
    await fetchFile(notoSansJPExtraBold)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansJP-black.ttf",
    await fetchFile(notoSansJPBlack)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansKR-regular.ttf",
    await fetchFile(notoSansKR)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansKR-medium.ttf",
    await fetchFile(notoSansKRMedium)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansKR-semibold.ttf",
    await fetchFile(notoSansKRSemiBold)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansKR-bold.ttf",
    await fetchFile(notoSansKRBold)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansKR-extrabold.ttf",
    await fetchFile(notoSansKRExtraBold)
  );
  await ffmpeg.writeFile(
    "/tmp/notoSansKR-black.ttf",
    await fetchFile(notoSansKRBlack)
  );
  await ffmpeg.writeFile("/tmp/greek-regular.ttf", await fetchFile(greek));
  await ffmpeg.writeFile("/tmp/hindi-regular.ttf", await fetchFile(hindi));
  await ffmpeg.writeFile("/tmp/kanit-regular.ttf", await fetchFile(kanit));
  await ffmpeg.writeFile("/tmp/kanit-medium.ttf", await fetchFile(kanitMedium));
  await ffmpeg.writeFile(
    "/tmp/kanit-semibold.ttf",
    await fetchFile(kanitSemiBold)
  );
  await ffmpeg.writeFile("/tmp/kanit-bold.ttf", await fetchFile(kanitBold));
  await ffmpeg.writeFile(
    "/tmp/kanit-extrabold.ttf",
    await fetchFile(kanitExtraBold)
  );
  await ffmpeg.writeFile("/tmp/kanit-black.ttf", await fetchFile(kanitBlack));
  await ffmpeg.writeFile(
    "/tmp/montserrat-regular.ttf",
    await fetchFile(montserrat)
  );
  await ffmpeg.writeFile(
    "/tmp/montserrat-medium.ttf",
    await fetchFile(montserratMedium)
  );
  await ffmpeg.writeFile(
    "/tmp/montserrat-semibold.ttf",
    await fetchFile(montserratSemiBold)
  );
  await ffmpeg.writeFile(
    "/tmp/montserrat-bold.ttf",
    await fetchFile(montserratBold)
  );
  await ffmpeg.writeFile(
    "/tmp/montserrat-extrabold.ttf",
    await fetchFile(montserratExtraBold)
  );
  await ffmpeg.writeFile(
    "/tmp/montserrat-black.ttf",
    await fetchFile(montserratBlack)
  );
  handleLoaded(true);
};
