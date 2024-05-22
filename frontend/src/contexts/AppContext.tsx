import React, { createContext, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import Toast from "../components/Toast";
import { FFmpeg } from "@ffmpeg/ffmpeg";
type ToastPayloadType = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

export type AppContextType = {
  showToast: (payload: ToastPayloadType) => void;
  isLoggedIn: boolean;
  ffmpegRef: React.MutableRefObject<FFmpeg>;
  loaded: boolean;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  chrome: boolean;
};
export const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastPayloadType | undefined>(undefined);

  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });
  const ffmpegRef = useRef(new FFmpeg());
  const [loaded, setLoaded] = useState(false);
  const chromeBrowser = useMemo(() => {
    if (navigator.userAgent.indexOf("Chrome") === -1) {
      return false;
    } else {
      return true;
    }
  }, []);
  return (
    <AppContext.Provider
      value={{
        isLoggedIn: !isError,
        showToast: (payload) => setToast(payload),
        ffmpegRef,
        loaded,
        setLoaded: (value) => setLoaded(value),
        chrome: chromeBrowser,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
    </AppContext.Provider>
  );
};
