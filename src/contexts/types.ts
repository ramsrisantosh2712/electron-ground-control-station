import { DroneStatusState } from "@/types/index.type";
import { SidePaneState } from "./SideBarContext";
import { MapMarkersState, MapObjectState } from "./MapContext";

export type DroneStatusContextType = {
    droneStatus: DroneStatusState;
    setDroneStatus: (sidePane: DroneStatusState) => void;
};

export type SideBarContextType = {
    sidePane: SidePaneState;
    setSidePane: (sidePane: SidePaneState) => void;

    sensorStatusToggle: boolean;
    setSensorStatusToggle: (sensorStatusToggle: boolean) => void
};

export type MapContextType = {
    markers: MapMarkersState;
    setMarkers: (markers: MapMarkersState) => void;

    mapObject: MapObjectState
    setMapObject: (mapObject: MapObjectState) => void;
}