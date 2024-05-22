import { Skeleton } from "@mui/material";
const SkeletonLoader = () => {
  return (
    <div
      className="
    h-full sm:px-10 px-2 flex flex-col  max-w-7xl mx-auto w-full py-14"
    >
      <div className="flex flex-col gap-5">
        <Skeleton
          variant="rounded"
          height={80}
          sx={{
            borderRadius: "8px",
            bgcolor: "#292A2F",
            width: "100%",
            display: "flex",
          }}
          animation="pulse"
        />
        <Skeleton
          variant="rounded"
          height={80}
          sx={{
            borderRadius: "8px",
            bgcolor: "#292A2F",
            width: "100%",
            display: "flex",
          }}
          animation="pulse"
        />
        <Skeleton
          variant="rounded"
          height={80}
          sx={{
            borderRadius: "8px",
            bgcolor: "#292A2F",
            width: "100%",
            display: "flex",
          }}
          animation="pulse"
        />
        <Skeleton
          variant="rounded"
          height={80}
          sx={{
            borderRadius: "8px",
            bgcolor: "#292A2F",
            width: "100%",
            display: "flex",
          }}
          animation="pulse"
        />
        <Skeleton
          variant="rounded"
          height={80}
          sx={{
            borderRadius: "8px",
            bgcolor: "#292A2F",
            width: "100%",
            display: "flex",
          }}
          animation="pulse"
        />
        <Skeleton
          variant="rounded"
          height={80}
          sx={{
            borderRadius: "8px",
            bgcolor: "#292A2F",
            width: "100%",
            display: "flex",
          }}
          animation="pulse"
        />
        <Skeleton
          variant="rounded"
          height={80}
          sx={{
            borderRadius: "8px",
            bgcolor: "#292A2F",
            width: "100%",
            display: "flex",
          }}
          animation="pulse"
        />
        <Skeleton
          variant="rounded"
          height={80}
          sx={{
            borderRadius: "8px",
            bgcolor: "#292A2F",
            width: "100%",
            display: "flex",
          }}
          animation="pulse"
        />
        <Skeleton
          variant="rounded"
          height={80}
          sx={{
            borderRadius: "8px",
            bgcolor: "#292A2F",
            width: "100%",
            display: "flex",
          }}
          animation="pulse"
        />
      </div>
    </div>
  );
};

export default SkeletonLoader;
