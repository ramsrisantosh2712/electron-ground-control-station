import { createContext, RefObject, useContext, useRef, useState } from "react";
import { MapContextType } from "./types";

type Props = {
  children: React.ReactNode;
};

export type MapMarkersState = {
  drone: mapboxgl.Marker | null;
  home: mapboxgl.Marker | null;
};

export type MapObjectState = {
  map: mapboxgl.Map | null;
  miniMap: mapboxgl.Map | null;
  mapBoxDraw: mapboxgl.Map | null;
};

const AppContext = createContext<MapContextType | undefined>(undefined);

export const MapContext = ({ children }: Props) => {
  const [markers, setMarkers] = useState<MapMarkersState>({
    drone: null,
    home: null,
  });

  const [mapObject, setMapObject] = useState<MapObjectState>({
    map: null,
    miniMap: null,
    mapBoxDraw: null,
  });

  return (
    <AppContext.Provider
      value={{ markers, setMarkers, mapObject, setMapObject }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};