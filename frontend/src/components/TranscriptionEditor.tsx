import {
  LineCaptionsType,
  SentenceCaptionsType,
  SingleWordCaptionsType,
} from "../../../backend/src/shared/types";
import TranscriptionItem from "./TranscriptionItem";

const TranscriptionEditor = ({
  transcriptionSingleWordItems,
  setTranscriptionSingleWordItems,
  transcriptionLineItems,
  setTranscriptionLineItems,
  transcriptionSentenceItems,
  setTranscriptionSentenceItems,
  singleWordCaptionsSelected,
  lineCaptionsSelected,
  setChangesAdded,
}: {
  transcriptionSingleWordItems: SingleWordCaptionsType[];
  transcriptionLineItems: LineCaptionsType[];
  transcriptionSentenceItems: SentenceCaptionsType[];
  setTranscriptionSingleWordItems: React.Dispatch<
    React.SetStateAction<SingleWordCaptionsType[]>
  >;
  setTranscriptionLineItems: React.Dispatch<
    React.SetStateAction<LineCaptionsType[]>
  >;
  setTranscriptionSentenceItems: React.Dispatch<
    React.SetStateAction<SentenceCaptionsType[]>
  >;
  singleWordCaptionsSelected: boolean;
  lineCaptionsSelected: boolean;
  setChangesAdded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const updateSingleWordTranscriptionItem = (
    index: number,
    prop: keyof SingleWordCaptionsType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTranscribedItems = [...transcriptionSingleWordItems];
    const newTranscribedItem: SingleWordCaptionsType = {
      ...newTranscribedItems[index],
    };
    // @ts-expect-error error
    newTranscribedItem[prop] = e.target.value;
    newTranscribedItems[index] = newTranscribedItem;
    setTranscriptionSingleWordItems(newTranscribedItems);
    setChangesAdded(true);
  };
  const updateLineTranscriptionItem = (
    index: number,
    prop: keyof LineCaptionsType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTranscribedItems = [...transcriptionLineItems];
    const newTranscribedItem: LineCaptionsType = {
      ...newTranscribedItems[index],
    };
    // @ts-expect-error error
    newTranscribedItem[prop] = e.target.value;
    newTranscribedItems[index] = newTranscribedItem;
    setTranscriptionLineItems(newTranscribedItems);
    setChangesAdded(true);
  };
  const updateSentenceTranscriptionItem = (
    index: number,
    prop: keyof SentenceCaptionsType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTranscribedItems = [...transcriptionSentenceItems];
    const newTranscribedItem: SentenceCaptionsType = {
      ...newTranscribedItems[index],
    };
    // @ts-expect-error error
    newTranscribedItem[prop] = e.target.value;
    newTranscribedItems[index] = newTranscribedItem;
    setTranscriptionSentenceItems(newTranscribedItems);
    setChangesAdded(true);
  };
  return (
    <>
      {singleWordCaptionsSelected ? (
        <div>
          <div className="flex w-full sticky top-0 pb-2 p-1  font-semibold tracking-wider">
            <div className="w-[130px]">Start</div>
            <div className="w-[130px]">Finish</div>
            <div className="fex-1">Word</div>
          </div>

          {transcriptionSingleWordItems.length > 0 && (
            <>
              <div className="h-[450px] overflow-y-scroll w-full">
                {transcriptionSingleWordItems.map((item, key) => (
                  <div key={key} className="p-1">
                    <TranscriptionItem
                    
                      handleStartTimeChange={(e) => {
                        if (e.target.value === "") {
                          return "";
                        }
                        updateSingleWordTranscriptionItem(key, "start", e);
                      }}
                      handleEndTimeChange={(e) => {
                        if (e.target.value === "") {
                          return "";
                        }
                        updateSingleWordTranscriptionItem(key, "end", e);
                      }}
                      handleWordChange={(e) =>
                        updateSingleWordTranscriptionItem(
                          key,
                          "punctuated_word",
                          e
                        )
                      }
                      item={item}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : lineCaptionsSelected ? (
        <div>
          <div className="flex w-full sticky top-0 pb-2 p-1  font-semibold tracking-wider">
            <div className="w-[130px]">Start</div>
            <div className="w-[130px]">Finish</div>
            <div className="fex-1">Line</div>
          </div>

          {transcriptionLineItems.length > 0 && (
            <>
              <div className="h-[450px] overflow-y-scroll w-full">
                {transcriptionLineItems.map((item, key) => (
                  <div key={key} className="p-1">
                    <TranscriptionItem
                      handleStartTimeChange={(e) => {
                        if (e.target.value === "") {
                          return "";
                        }
                        updateLineTranscriptionItem(key, "start", e);
                      }}
                      handleEndTimeChange={(e) => {
                        if (e.target.value === "") {
                          return "";
                        }
                        updateLineTranscriptionItem(key, "end", e);
                      }}
                      handleWordChange={(e) =>
                        updateLineTranscriptionItem(
                          key,
                          "text",
                          e
                        )
                      }
                      item={item}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <div className="flex w-full sticky top-0 pb-2 p-1  font-semibold tracking-wider">
            <div className="w-[130px]">Start</div>
            <div className="w-[130px]">Finish</div>
            <div className="fex-1">Sentence</div>
          </div>

          {transcriptionSingleWordItems.length > 0 && (
            <>
              <div className="h-[450px] overflow-y-scroll w-full">
                {transcriptionSentenceItems.map((item, key) => (
                  <div key={key} className="p-1">
                    <TranscriptionItem
                      handleStartTimeChange={(e) => {
                        if (e.target.value === "") {
                          return "";
                        }
                        updateSentenceTranscriptionItem(key, "start", e);
                      }}
                      handleEndTimeChange={(e) => {
                        if (e.target.value === "") {
                          return "";
                        }
                        updateSentenceTranscriptionItem(key, "end", e);
                      }}
                      handleWordChange={(e) =>
                        updateSentenceTranscriptionItem(key, "text", e)
                      }
                      item={item}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TranscriptionEditor;
