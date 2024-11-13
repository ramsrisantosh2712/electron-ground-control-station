import { createContext, useContext, useState } from "react";
import { SideBarContextType } from "./types";

export type SidePaneState = {
  type: string;
  isActive: boolean;
};

type Props = {
  children: React.ReactNode;
};

const AppContext = createContext<SideBarContextType | undefined>(undefined);

export const SideBarContext = ({ children }: Props) => {
  const [sidePane, setSidePane] = useState<SidePaneState>({
    type: "",
    isActive: false,
  });
  const [sensorStatusToggle, setSensorStatusToggle] = useState(false);

  // All the remaining states

  return (
    <AppContext.Provider
      value={{
        sidePane,
        setSidePane,
        sensorStatusToggle,
        setSensorStatusToggle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useSideBarContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
