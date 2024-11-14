import MainComponent from "./components/global/main-component/MainComponent";

import Sidebar from "./components/global/sidebar/SideBar";
import "./App.css";
import StartUp from "./components/global/startup/StartUp";
import { useEffect, useRef } from "react";
import { getSocket } from "./lib/utils";
import { useDroneUtilsContext } from "./contexts/DroneStatusContext";

import { MAV_RESULT } from "./Constants/Constants";

const socket = getSocket();

function App() {
  const {
    droneStatus,
    setDroneStatus,
    planMission,
    setPlanMission,
    historyMissions,
    setHistoryMissions,
  } = useDroneUtilsContext();

  let debug = false;

  const batteryPercentageColor = (percent: number) => {
    if (percent <= 10) return "red";
    else if (percent <= 30) return "yellow";
    else return "green";
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debug
    console.log("Socket Connection Initializing...");

    // Handles the socket `connect` event. This event `connect` is triggered when the socket is ready to connect to the server.
    socket.on("connect", () => {
      console.log("Socket Connected Successful");
    });

    // Handles after the socket `connect` event. This event `connection` is triggered when the socket successfully connects to the server.
    socket.on("connection", (data) => {
      console.log(`User ${data.sid} connected`);

      // Setting status after the connection is established
      setDroneStatus((prev: any) => ({
        ...prev,
        connectButton: true,
        status: {
          status: "Drone Connected Successfully",
          statusColor: "green",
          connected: true,
        },
      }));
    });

    // Handles the socket `disconnect` event. This event `disconnect` is triggered when the socket disconnects to the server.
    socket.on("disconnect", () => {
      console.log("Socket Disconnected");

      // Setting status after the disconnection
      setDroneStatus((prev) => ({
        ...prev,
        connectButton: false,
        status: {
          statusColor: "red",
          status: "Drone Disconnected",
          connected: false,
        },
      }));
    });
  }, [socket]);

  useEffect(() => {
    socket.on("heartbeat", (data) => {
      // Debug
      // console.log("HEARTBEAT: ", data)

      if (debug) console.log("HEARTBEAT: ", data);
    });
    socket.on("battery_status", (data) => {
      // Debug
      if (debug) console.log("Battery: ", data);

      // Updates the battery state with temperature, percentage, and calculated percentage color
      // setBattery({ temperature: data.temperature, percentage: data.percentage, percentageColor: batteryPercentageColor(data.percentage) })
      setDroneStatus((prev) => ({
        ...prev,
        battery: {
          temperature: data.temperature,
          percentage: data.percentage,
          percentageColor: batteryPercentageColor(data.percentage),
        },
      }));
    });
    socket.on("arm_status", (data) => {
      // Debug
      if (debug) console.log("Arm: ", data);

      // Updates the arm state with true (arm) or false (disarm)
      // setArm(data)
      setDroneStatus((prev) => ({ ...prev, arm: data }));
    });
    socket.on("coordinates_status", (data) => {
      // Debug
      // console.log(data)
      if (debug) console.log("Coordinates: ", data);
      // setRender(!render)

      // if (data.relative_alt.toFixed(0) > 0) {
      //     setFlying(true)
      // }
      // else {
      //     setFlying(false)
      // }

      // Updates the coordinates state with the received data
      // setCoordinates(data)
      setDroneStatus((prev) => ({ ...prev, coordinates: data }));
    });
    socket.on("gps_raw_int", (data) => {
      // Debug
      // console.log(data)
      if (debug) console.log("Gps Raw Int: ", data);
      // setRender(!render)

      // if (data.relative_alt.toFixed(0) > 0) {
      //     setFlying(true)
      // }
      // else {
      //     setFlying(false)
      // }

      // Updates the coordinates state with the received data
      // setCoordinates(data)
      setDroneStatus((prev) => ({ ...prev, gpsRawInt: data }));
    });
    socket.on("metric_status", (data) => {
      // Debug
      if (debug) console.log("Metrics: ", data);

      // Updates the Metrics state with the received data
      // setMetrics(data)
      setDroneStatus((prev) => ({ ...prev, metrics: data }));
    });
    socket.on("mode_status", (data) => {
      // Debug
      if (debug) console.log("Mode: ", data);

      // Updates the Mode state with the received data
      // setMode(data)
      setDroneStatus((prev) => ({
        ...prev,
        mode: { mode: data.mode, name: data.name },
      }));
    });
    socket.on("home_position", (data) => {
      // Debug
      // console.log("Home: ", data)

      if (debug) console.log("Home: ", data);

      // Updates the Home Position state with the received data
      // setHomePosition(data)
      setDroneStatus((prev) => ({ ...prev, homePosition: data }));
    });
    socket.on("command_ack", (data) => {
      // Debug
      if (debug)
        console.log(
          `CMD: ${data.command} RESPONSE: ${MAV_RESULT[data.result].code}`
        );

      // Updates the Command Status state with the received data if any
      // setStatus(`CMD: ${data.command} RESPONSE: ${MAV_RESULT[data.result].code}`)
      // }
      setDroneStatus((prev) => ({
        ...prev,
        status: {
          status: `CMD: ${data.command} RESPONSE: ${
            MAV_RESULT[data.result].code
          }`,
          statusColor: "green",
        },
      }));
    });
    socket.on("sensor_status", (data) => {
      // Debug
      if (debug) console.log(data);

      // Updates the Drone Sensor Status state with the received data if any
      // setDroneSensorStatus(data)
      setDroneStatus((prev) => ({ ...prev, droneSensorStatus: data }));
    });
    socket.on("drone_error_status", (data) => {
      // Debug
      if (debug) console.log("Drone Error: ", data);

      // Updates the Drone error Status state with the received data if any
      // setDroneErrorStatus(data)
      setDroneStatus((prev) => ({ ...prev, droneErrorStatus: data }));
    });
    socket.on("servo_output_raw", (data) => {
      // Debug
      if (debug) console.log("Servo Output: ", data);

      // Updates the Servo Raw with the received data if any
      // setServoOutputRaw(data)
      setDroneStatus((prev) => ({ ...prev, servoOutputRaw: data }));
    });
    socket.on("extended_sys_state", (data) => {
      // Debug
      // console.log(data)
      if (debug) console.log("Extended Sys State Output: ", data);

      // Updates the Extended Sys state with the received data if any
      // setExtendedSysState(data)
      if (data.landed_state === 1) {
        setDroneStatus((prev) => ({
          ...prev,
          extendedSysState: data,
          flying: false,
        }));
      } else {
        setDroneStatus((prev) => ({
          ...prev,
          extendedSysState: data,
          flying: true,
        }));
      }
    });
    socket.on("download_mission", (data) => {
      if (data.status === "success") {
        if (data.mission_count > 0) {
          setPlanMission((prev) => ({
            ...prev,
            clearMission: true,
            downloadedMission: data,
          }));
        } else {
          console.log("No Missions");
        }
      } else if (data.status === "failed") {
        console.log("Downloading Failed");
      }
    });
    socket.on("upload_mission", (data) => {
      console.log(data);
    });
    socket.on("clear_mission", (data) => {
      console.log(data);
    });
    socket.on("history_mission", (data) => {
      // console.log(data)
      setHistoryMissions((prev) => ({ ...prev, missions: data }));
    });
    socket.on("history_mission_count", (data) => {
      setHistoryMissions((prev) => ({ ...prev, missionCount: data }));
    });

    socket.on("video_frame", (data) => {
      // console.log(data.frame)
      setDroneStatus((prev) => ({
        ...prev,
        camera: { ...prev.camera, image: data.frame, isPresent: true },
      }));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a timeout to reset the image after 2 seconds if no new data arrives
      timeoutRef.current = setTimeout(() => {
        setDroneStatus((prev) => ({
          ...prev,
          camera: { image: "", isPresent: false },
        }));
      }, 2000); // 2 seconds
    });

    // Cleans up socket event listeners when the component is unmounted
    return () => {
      socket.off("battery_status", () => {
        console.log("data event was removed");
      });
      socket.off("arm_status", () => {
        console.log("data event was removed");
      });
      socket.off("coordinates_status", () => {
        console.log("data event was removed");
      });
      socket.off("metric_status", () => {
        console.log("data event was removed");
      });
      socket.off("mode_status", () => {
        console.log("data event was removed");
      });
      socket.off("home_position", () => {
        console.log("data event was removed");
      });
      socket.off("home_position", () => {
        console.log("data event was removed");
      });
      socket.off("drone_error_status", () => {
        console.log("data event was removed");
      });
      socket.off("sensor_status", () => {
        console.log("data event was removed");
      });
      socket.off("servo_output_raw", () => {
        console.log("data event was removed");
      });
      socket.off("extended_sys_state", () => {
        console.log("data event was removed");
      });
      socket.off("download_mission", () => {
        console.log("data event was removed");
      });
      socket.off("video_frame", () => {
        setDroneStatus((prev) => ({
          ...prev,
          camera: { image: "", isPresent: false },
        }));
      });
    };
  }, [socket]);

  return (
    <div>
      <StartUp />
      <div className="bg-[#171717] h-screen w-full flex flex-row">
        <div className="w-[80px] h-full">
          <Sidebar />
        </div>
        <div className="w-full h-full text-white">
          <MainComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
