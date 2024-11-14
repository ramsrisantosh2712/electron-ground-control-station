import { useDroneUtilsContext } from "@/contexts/DroneStatusContext";
import { GoDotFill } from "react-icons/go";
import ICGImage from "@/images/ICG_Image.png";
import ZebuLogo from "@/images/ZEBU_LOGO.png";
import { useSideBarContext } from "@/contexts/SideBarContext";
import {
  Atom,
  Compass,
  Crosshair,
  Drone,
  Engine,
  Joystick,
  Ruler,
  Speedometer,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useMapContext } from "@/contexts/MapContext";

const StatusBar = () => {
  const { droneStatus } = useDroneUtilsContext();
  const { sensorStatusToggle } = useSideBarContext();
  return (
    <div className="bg-[#1C1C1E] flex justify-between p-3 m-2 items-center rounded-xl">
      {/* ARM + MODE + CONNECTION Status */}
      <div className="rounded-xl flex gap-x-3">
        <img
          src={ICGImage}
          className="w-10 flex justify-center items-center rounded-lg"
          alt="icg-logo"
        />

        {/* Arm Status */}
        <div
          className={cn(
            `text-sm flex justify-center items-center font-bold`,
            droneStatus.arm ? "text-green-500" : "text-red-500"
          )}
        >
          {droneStatus.arm ? "ARM" : "DISARM"}
        </div>

        {/* Mode Status */}
        <div className="flex justify-center items-center text-sm font-bold text-yellow-300">
          {droneStatus.mode.name}
        </div>

        {/* Connection Status */}
        <div className="flex items-center">
          <div className="text-white w-full rounded-full flex items-center justify-center">
            <GoDotFill
              className={`text-${droneStatus.status.statusColor}-500`}
            />
            {droneStatus.status.status}
          </div>
        </div>
      </div>

      {/* Mini Logs + Sensor Status */}
      <div className="flex items-center gap-10">
        {/* Drone Mini Logs */}
        <div className="flex items-center">
          <div
            className={
              droneStatus.droneErrorStatus.message_color === "white"
                ? "rounded-md px-1 font-bold text-black bg-white"
                : `px-1 rounded-md  font-bold text-white bg-${droneStatus.droneErrorStatus.message_color}-600 }`
            }
          >
            {droneStatus.droneErrorStatus.text}
          </div>
        </div>

        {/* Sensor Status */}
        <div className="flex items-center">
          {sensorStatusToggle && (
            <div className="flex items-center gap-x-2 transition-colors duration-200">
              <div
                title="Gyrometer"
                className="w-16 flex justify-center flex-col px-1 border border-zinc-400 rounded-md"
              >
                <Atom
                  weight="light"
                  size={25}
                  className={`text-${droneStatus.droneSensorStatus.gyro}-500 mx-auto transition-colors duration-300`}
                />
                <div className="text-sm text-center text-slate-200">Gyro</div>
              </div>
              <div
                title="Speedometer"
                className="w-16 flex justify-center flex-col px-1 border border-zinc-400 rounded-md"
              >
                <Speedometer
                  weight="light"
                  size={25}
                  className={`text-${droneStatus.droneSensorStatus.accelerometer}-500 mx-auto transition-colors duration-300`}
                />
                <div className="text-sm text-center text-slate-200">Accel</div>
              </div>
              <div
                title="Magnetometer"
                className="w-16 flex justify-center flex-col px-1 border border-zinc-400 rounded-md"
              >
                <Compass
                  weight="light"
                  size={25}
                  className={`text-${droneStatus.droneSensorStatus.magnetometer}-500 mx-auto transition-colors duration-300`}
                />
                <div className="text-sm text-center text-slate-200">Mag</div>
              </div>
              <div
                title="GPS"
                className="w-16 flex justify-center flex-col px-1 border border-zinc-400 rounded-md"
              >
                <Crosshair
                  weight="light"
                  size={25}
                  className={`text-${droneStatus.droneSensorStatus.gps}-500 mx-auto transition-colors duration-300`}
                />
                <div className="text-sm text-center text-slate-200">GPS</div>
              </div>
              <div
                title="Motors"
                className="w-16 flex justify-center flex-col px-1 border border-zinc-400 rounded-md"
              >
                <Engine
                  weight="light"
                  size={25}
                  className={`text-${droneStatus.droneSensorStatus.motors}-500 mx-auto transition-colors duration-300`}
                />
                <div className="text-sm text-center text-slate-200">Motor</div>
              </div>
              <div
                title="Proximity"
                className="w-16 flex justify-center flex-col px-1 border border-zinc-400 rounded-md"
              >
                <Ruler
                  weight="light"
                  size={25}
                  className={`text-${droneStatus.droneSensorStatus.proximity}-500 mx-auto transition-colors duration-300`}
                />
                <div className="text-sm text-center text-slate-200">Prox</div>
              </div>
              <div
                title="RC"
                className="w-16 flex justify-center flex-col px-1 border border-zinc-400 rounded-md"
              >
                <Joystick
                  weight="light"
                  size={25}
                  className={`text-${droneStatus.droneSensorStatus.rc}-500 mx-auto transition-colors duration-300`}
                />
                <div className="text-sm text-center text-slate-200">RC</div>
              </div>
              <div
                title="Pre-Arm Check"
                className="w-16 flex justify-center flex-col px-1 border border-zinc-400 rounded-md"
              >
                <Drone
                  weight="light"
                  size={25}
                  className={`text-${droneStatus.droneSensorStatus.arm}-500 mx-auto transition-colors duration-300`}
                />
                <div className="text-wrap text-sm text-center text-slate-200">
                  Pre-Arm
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg flex justify-center items-center">
          <img
            src={ZebuLogo}
            className="w-28 flex justify-center items-center"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
