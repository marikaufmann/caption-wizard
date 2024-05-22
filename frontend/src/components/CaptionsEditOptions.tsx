import Select from "react-select";
import {
  greekWeightOptions,
  japaneseWeightOptions,
  koreanWeightOptions,
  montserratWeightOptions,
  thaiWeightOptions,
  hindiWeightOptions,
} from "../config";
const CaptionsEditOptions = ({
  primaryColor,
  setPrimaryColor,
  outlineColor,
  setOutlineColor,
  sizeOptions,
  fontSize,
  setFontSize,
  language,
  setFontWeight,
}: {
  primaryColor: string;
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  outlineColor: string;
  setOutlineColor: React.Dispatch<React.SetStateAction<string>>;
  sizeOptions: {
    value: number;
    label: string;
  }[];
  fontSize: {
    value: number;
    label: string;
  } | null;
  setFontSize: React.Dispatch<
    React.SetStateAction<{
      value: number;
      label: string;
    } | null>
  >;
  language: string;
  setFontWeight: React.Dispatch<
    React.SetStateAction<{
      value: string;
      label: string;
    } | null>
  >;
}) => {
  return (
    <div className="flex laptop:flex-col xl:flex-row sm:flex-row flex-col lg:gap-10 gap-4 w-full items-center justify-between h-full">
      <div className="flex lg:gap-10 gap-4 w-full items-center justify-between h-full">
        <div className="flex gap-2 flex-1">
          <h1 className="text-white/80">Primary color</h1>
          <input
            type="color"
            aria-label='primary color'
            className="rounded border-none bg-lightGray"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-1">
          <h1 className="text-white/80">Outline color</h1>
          <input
            type="color"
            aria-label='outline color'
            className="rounded border-none bg-lightGray"
            value={outlineColor}
            onChange={(e) => setOutlineColor(e.target.value)}
          />
        </div>
      </div>
      <div className="flex lg:gap-10 gap-4 w-full items-center justify-between h-full">
        <div className="flex gap-2 items-center h-full max-xl:flex-1">
          <h1 className="text-white/80">Size</h1>
          <Select
            maxMenuHeight={220}
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
            className="w-full  h-full"
            options={sizeOptions}
            onChange={setFontSize}
            value={fontSize}
          />
        </div>
        <div className="flex gap-2 flex-1 items-center h-full">
          <h1 className="text-white/80">Weight</h1>
          <Select
            maxMenuHeight={220}
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
            className="w-full  h-full"
            options={
              language === "ja"
                ? japaneseWeightOptions
                : language === "ko"
                ? koreanWeightOptions
                : language === "el"
                ? greekWeightOptions
                : language === "hi"
                ? hindiWeightOptions
                : language === "th"
                ? thaiWeightOptions
                : montserratWeightOptions
            }
            defaultValue={
              language === "ja"
                ? japaneseWeightOptions[4]
                : language === "ko"
                ? koreanWeightOptions[4]
                : language === "el"
                ? greekWeightOptions[0]
                : language === "hi"
                ? hindiWeightOptions[0]
                : language === "th"
                ? thaiWeightOptions[4]
                : montserratWeightOptions[4]
            }
            onChange={setFontWeight}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptionsEditOptions;
