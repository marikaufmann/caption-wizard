import { Loader2 } from "lucide-react";
const Loader = ({ styles}: { styles?: string}) => {
  return (
    <div>
      <Loader2 className={`${styles} animate-spin text-white/80`}/>
    </div>
  );
};

export default Loader;
