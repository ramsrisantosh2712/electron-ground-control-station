import { DroneStatusState, HistoryMissionState, MarkerClass, PlanMissionState, RepositionStatusState } from "@/types/index.type";
import { SidePaneState } from "./SideBarContext";
import { MapMarkersState, MapObjectState } from "./MapContext";
import { RefObject } from "react";

export type DroneStatusContextType = {
    droneStatus: DroneStatusState;
    setDroneStatus: (sidePane: DroneStatusState) => void;
};

export type PlanMissionContextType = {
    planMission: PlanMissionState;
    setPlanMission: (planMission: PlanMissionState) => void;
    emptyPlanMissionState: PlanMissionState
}

export type MarkerClassObjectsContextType = {
    takeOffObject: MarkerClass
    wayPointsObject: Array<MarkerClass>
    roiObject: Array<mapboxgl.Marker>
    rTLObject: MarkerClass
}

export type HistoryMissionContextType = {
    historyMissions: HistoryMissionState;
    setHistoryMissions: (historyMissions: HistoryMissionState) => void
}

export type RepositionStatusContextType = {
    takeOffStatus: RepositionStatusState;
    setTakeOffStatus: (takeOffStatus: RepositionStatusState) => void
}

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

    wayPointRef: React.MutableRefObject<((event: any) => void) | null>;
}