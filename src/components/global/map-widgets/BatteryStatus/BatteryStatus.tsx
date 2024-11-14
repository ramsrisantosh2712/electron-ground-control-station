import { useDroneUtilsContext } from "@/contexts/DroneStatusContext";
import { useMapContext } from "@/contexts/MapContext";
import { NavigationArrow } from "@phosphor-icons/react";

const BatteryStatus = () => {
  const { droneStatus, planMission } = useDroneUtilsContext();
  const { mapObject } = useMapContext();

  const easeMapToDrone = () => {
    mapObject.map &&
      mapObject.map.easeTo({
        center: [
          droneStatus.coordinates.longitude,
          droneStatus.coordinates.latitude,
        ],
        zoom: 17,
        duration: 1000,
      });
  };

  return (
    <>
      <div
        onClick={easeMapToDrone}
        className="cursor-pointer backdrop-blur-2xl w-fit mx-auto p-2 my-3 rounded-lg bg-opacity-50 bg-black hover:bg-opacity-75 transition-all duration-200"
      >
        <NavigationArrow size={20} />
      </div>
      {!planMission.isActive && (
        <div className="backdrop-blur-2xl p-1 rounded-lg bg-opacity-50 bg-black hover:bg-opacity-75 transition-all duration-200">
          <div className="text-center">Battery</div>
          <div className="font-bold inline-block">Status: </div>{" "}
          <span
            className={`font-bold text-${droneStatus.battery.percentageColor}-500`}
          >
            {droneStatus.battery?.percentage}%
          </span>
          <br />
          <div className="font-bold inline-block">Temp:</div>
          {droneStatus.battery?.temperature === 32767 ||
          droneStatus.battery?.temperature === 0
            ? "-"
            : droneStatus.battery?.temperature}
          °C{" "}
        </div>
      )}
    </>
  );
};

export default BatteryStatus;
