import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};
const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);
  const styles =
    type === "SUCCESS"
      ? "fixed bottom-4 right-4 p-3 bg-[#25282D] text-white/90 w-[350px]  rounded-xl shadow-xl border-t-4 border-[#4E8C7C]"
      : "fixed bottom-4 right-4 p-3 px-6 bg-[#25282D] text-white/90 w-[350px]  rounded-xl shadow-xl border-t-4 border-[#DB3056]";
  return (
    <div className={styles}>
      {type === "ERROR" ? (
        <div className="flex gap-4 items-center w-full">
          <AlertCircle className="w-6 h-6 text-[#851D41]" />
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-xl tracking-wider">
              Oh snap!
            </span>
            <span className="font-semibold tracking-wide">{message}</span>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-center w-full">
          <CheckCircle2 className="w-6 h-6 text-[#025761]" />
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-xl tracking-wider">
              Well done!
            </span>
            <span className="font-semibold tracking-wide">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toast;
