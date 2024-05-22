import { useContext } from "react";
import { AppContext, AppContextType } from '../contexts/AppContext';

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContextType;
};
