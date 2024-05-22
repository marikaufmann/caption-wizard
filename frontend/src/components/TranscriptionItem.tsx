const TranscriptionItem = ({
  handleStartTimeChange,
  handleEndTimeChange,
  handleWordChange,
  item,
}: {
  handleStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  item: {
    punctuated_word?: string;
    start: number;
    end: number;
    text?: string;
  };
}) => {
  return (
    <div className="flex w-full gap-2 tracking-wider">
      <input
        type="number"
        aria-label='start time'
        className="bg-lightGray text-white p-1 rounded remove-arrow  w-[120px]"
        value={item.start}
        onChange={handleStartTimeChange}
      />
      <input
        type="number"
        aria-label='end time'
        className="bg-lightGray text-white p-1 rounded remove-arrow w-[120px]"
        value={item.end}
        onChange={handleEndTimeChange}
      />
      <input
        type="text"
        aria-label='text'
        className="bg-lightGray text-white p-1 rounded flex-1"
        value={item.punctuated_word ?? item.text}
        onChange={handleWordChange}
      />
    </div>
  );
};

export default TranscriptionItem;
