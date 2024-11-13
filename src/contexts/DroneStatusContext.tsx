import { DroneStatusState } from "@/types/index.type";
import { createContext, useContext, useState } from "react";
import { DroneStatusContextType } from "./types";

type Props = {
  children: React.ReactNode;
};

const AppContext = createContext<DroneStatusContextType | undefined>(undefined);

export const DroneStatusContext = ({ children }: Props) => {
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

  return (
    <AppContext.Provider value={{ droneStatus, setDroneStatus }}>
      {children}
    </AppContext.Provider>
  );
};

export const useDroneStatusContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
