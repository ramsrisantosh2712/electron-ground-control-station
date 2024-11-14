import {
  DroneStatusState,
  HistoryMissionState,
  MarkerClass,
  PlanMissionState,
  RepositionStatusState,
} from "@/types/index.type";
import { createContext, useContext, useState } from "react";
import {
  DroneStatusContextType,
  HistoryMissionContextType,
  MarkerClassObjectsContextType,
  PlanMissionContextType,
  RepositionStatusContextType,
} from "./types";

type Props = {
  children: React.ReactNode;
};

export type DroneUtilsContextType = DroneStatusContextType &
  PlanMissionContextType &
  MarkerClassObjectsContextType &
  HistoryMissionContextType &
  RepositionStatusContextType;

const AppContext = createContext<DroneUtilsContextType | undefined>(undefined);

export const DroneUtilsContext = ({ children }: Props) => {
  const [droneStatus, setDroneStatus] = useState<DroneStatusState>({
    connectButton: false,

    camera: {
      image: "",
      isPresent: false,
      show: true,
    },

    status: {
      connected: false,
      status: "",
      statusColor: "red",
    },

    mode: {
      mode: -1,
      name: "STABILIZE",
    },

    flying: false,
    flightDistance: 0,
    distanceBetweenHomeDrone: 0,
    flightTime: "00:00:00",

    arm: false,
    rtlMode: false,
    smartRtlMode: false,
    landMode: false,

    coordinates: {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      relative_alt: 0,
      speed_x: 0,
      speed_y: 0,
      speed_z: 0,
      yaw_angle: 65535,
    },

    gpsRawInt: {
      fix_type: 0,
      lat: 0,
      lon: 0,
      alt: 0,
      vel: 0,
      hdop: 0,
      vdop: 0,
      cog: 0,
      satellites_visible: 0,
    },

    battery: {
      percentage: 0,
      temperature: 0,
      percentageColor: "white",
    },

    metrics: {
      drone: {
        climb: 0,
        direction: 0,
        speed: 0,
        throttle: 0,
      },
      wind: {
        direction: 0,
        speed: 0,
      },
    },

    homePosition: {
      latitude: 0,
      longitude: 0,
      altitude: 0,
    },

    servoOutputRaw: {
      servo_count: 0,
      servo_1: null,
      servo_2: null,
      servo_3: null,
      servo_4: null,
      servo_5: null,
      servo_6: null,
      servo_7: null,
      servo_8: null,
    },

    extendedSysState: {
      vtol_state: null,
      landed_state: null,
    },

    droneSensorStatus: {
      gyro: "grey",
      accelerometer: "grey",
      magnetometer: "grey",
      gps: "grey",
      motors: "grey",
      proximity: "grey",
      rc: "grey",
      arm: "grey",
    },

    droneErrorStatus: {
      message_type: null,
      message_color: "white",
      severity: null,
      text: null,
      id: null,
      chunk_seq: null,
    },
  });

  const [takeOffStatus, setTakeOffStatus] = useState<RepositionStatusState>({
    isActive: false,
    altitude: 10,
  });

  const [planMission, setPlanMission] = useState<PlanMissionState>({
    isActive: false,
    missionOpen: "mission-start",
    clearMission: false,

    initialWayPointAltitude: 50,
    savedInitialWayPointAltitude: 50,

    reposition: {
      isActive: false,
      coordinates: [],
      altitude: 10,
      marker: null,
    },

    modifyMission: {
      type: null,
      id: -1,
    },

    takeoff: {
      coordinates: [],
      marker: null,

      modifyTakeoff: {
        marker: null,
      },
    },

    wayPoint: {
      wayPointActive: false,

      coordinates: [],
      markers: [],
      modifyWaypoint: {
        marker: null,
        id: -1,
      },
    },

    roi: {
      start: false,
      startROIIds: [],
      cancelROIIds: [],
      roiActive: false,
      coordinates: [],
      markers: [],
      roiCount: 0,
      roiIndex: [],

      modifyRoi: {
        marker: null,
        id: -1,
      },
    },

    survey: {
      surveyActive: false,

      surveyRotateWayPoints: false,
      surveyPolygon: null,
      markers: [],
      coordinates: [],
      surveyConfig: {
        altitude: 50,
        spacing: 25,
        angle: 0,
      },
    },

    rtl: {
      coordinates: [],
      marker: null,
    },

    fileActive: false,

    missionStatistics: {
      distance: 0,
      timeTaken: "00:00:00",
      maxTelemDist: 0,
      totalArea: 0,
    },

    downloadedMission: {
      status: "",
      mission_count: 0,
      takeoff: [],
      waypoint: [],
      roi: [],
      roiIndex: [],
      rtl: [],
    },
  });

  const [historyMissions, setHistoryMissions] = useState<HistoryMissionState>({
    isActive: false,

    selectedMission: {
      id: -1,
      map: null,
      mission_count: 0,
      takeoff: [],
      waypoint: [],
      roi: [],
      roiIndex: [],
      rtl: [],
      created_on: "",
      filename: "",
    },
    missionCount: 0,
    missions: [],
  });

  let emptyPlanMissionState: PlanMissionState = {
    isActive: false,
    missionOpen: "mission-start",
    clearMission: false,

    initialWayPointAltitude: 50,
    savedInitialWayPointAltitude: 50,

    reposition: {
      isActive: false,
      coordinates: [],
      altitude: 10,
      marker: null,
    },

    modifyMission: {
      type: null,
      id: -1,
    },

    takeoff: {
      coordinates: [],
      marker: null,

      modifyTakeoff: {
        marker: null,
      },
    },

    wayPoint: {
      wayPointActive: false,

      coordinates: [],
      markers: [],
      modifyWaypoint: {
        marker: null,
        id: -1,
      },
    },

    roi: {
      start: false,
      startROIIds: [],
      cancelROIIds: [],
      roiActive: false,
      coordinates: [],
      markers: [],
      roiCount: 0,
      roiIndex: [],

      modifyRoi: {
        marker: null,
        id: -1,
      },
    },

    survey: {
      surveyActive: false,

      surveyRotateWayPoints: false,
      surveyPolygon: null,
      markers: [],
      coordinates: [],
      surveyConfig: {
        altitude: 50,
        spacing: 25,
        angle: 0,
      },
    },

    rtl: {
      coordinates: [],
      marker: null,
    },

    fileActive: false,

    missionStatistics: {
      distance: 0,
      timeTaken: "00:00:00",
      maxTelemDist: 0,
      totalArea: 0,
    },

    downloadedMission: {
      status: "",
      mission_count: 0,
      takeoff: [],
      waypoint: [],
      roi: [],
      roiIndex: [],
      rtl: [],
    },
  };

  let takeOffObject: MarkerClass = new MarkerClass();
  let wayPointsObject: Array<MarkerClass> = [];
  let roiObject: Array<mapboxgl.Marker> = [];
  let rTLObject: MarkerClass = new MarkerClass();

  return (
    <AppContext.Provider
      value={{
        droneStatus,
        setDroneStatus,
        planMission,
        setPlanMission,
        emptyPlanMissionState,
        takeOffStatus,
        setTakeOffStatus,
        historyMissions,
        setHistoryMissions,
        takeOffObject,
        wayPointsObject,
        roiObject,
        rTLObject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useDroneUtilsContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
