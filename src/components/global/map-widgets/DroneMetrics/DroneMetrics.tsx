import { useDroneUtilsContext } from "@/contexts/DroneStatusContext";
import {
  ArrowElbowDownRight,
  ArrowRight,
  ArrowUp,
} from "@phosphor-icons/react";
import { TiArrowUpThick } from "react-icons/ti";

const DroneMetrics = () => {
  const { droneStatus } = useDroneUtilsContext();
  return (
    <>
      <div className="inline-flex text-base justify-center items-center">
        <TiArrowUpThick size={20} />
        {droneStatus.coordinates.relative_alt.toFixed(2)}m
      </div>
      <div className="inline-flex text-base justify-center items-center">
        <ArrowUp size={20} />
        {droneStatus.metrics.drone.climb.toFixed(2)}m/s
      </div>
      <div className="inline-flex text-base justify-center items-center">
        <span className="text-sm inline-block">FD</span>&nbsp;
        {droneStatus.flightDistance.toFixed(2)}m
      </div>
      <div className="inline-flex text-base justify-center items-center">
        <ArrowElbowDownRight size={20} />
        {droneStatus.distanceBetweenHomeDrone.toFixed(2)}m
      </div>
      <div className="inline-flex text-base justify-center items-center">
        <ArrowRight size={20} />
        {droneStatus.metrics.drone.speed.toFixed(2)}m/s
      </div>
      <div className="inline-flex text-base justify-center items-center">
        <span className="text-sm inline-block">FT</span>&nbsp;
        {droneStatus.flightTime}
      </div>
    </>
  );
};

export default DroneMetrics;
