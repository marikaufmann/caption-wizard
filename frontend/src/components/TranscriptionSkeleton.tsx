import { Skeleton } from "@mui/material";

const TranscriptionSkeleton = () => {
  const array = [];
  for (var i = 1; i < 10; i++) {
    array.push(i);
  }
  return (
    <div
      className="
        h-full  flex flex-col  w-full "
    >
      <div className="flex w-full sticky top-0 pb-2 p-1 ">
        <div className="w-[130px]">Start</div>
        <div className="w-[130px]">Finish</div>
        <div className="fex-1">Word</div>
      </div>
      <div className="flex flex-col gap-2">
        {array.map((value, index) => (
          <div className="flex w-full gap-2" key={index}>
            <Skeleton
              variant="rectangular"
              height={32}
              width={120}
              sx={{
                borderRadius: "8px",
                bgcolor: "#404349",
                width: "100%",
                display: "flex",
              }}
              animation="pulse"
              className="bg-lightGray text-white p-1 rounded remove-arrow  w-[120px]"
            />
            <Skeleton
              variant="rounded"
              height={32}
              width={120}
              sx={{
                borderRadius: "8px",
                bgcolor: "#404349",
                width: "100%",
                display: "flex",
              }}
              animation="pulse"
              className="bg-lightGray text-white p-1 rounded remove-arrow  w-[120px]"
            />
            <Skeleton
              variant="rounded"
              height={32}
              sx={{
                borderRadius: "8px",
                bgcolor: "#404349",
                width: "100%",
                display: "flex",
              }}
              animation="pulse"
              className="bg-lightGray text-white p-1 rounded remove-arrow  w-[120px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptionSkeleton;
