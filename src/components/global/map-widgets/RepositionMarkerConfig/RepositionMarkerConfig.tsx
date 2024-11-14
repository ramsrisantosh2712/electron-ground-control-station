import { clearUserPosition, handleFlyToPoint } from "@/components/utils/map";
import { useDroneUtilsContext } from "@/contexts/DroneStatusContext";
import { AirplaneTilt, XCircle } from "@phosphor-icons/react";
import React from "react";

const RepositionMarkerConfig = () => {
  const { planMission, setPlanMission } = useDroneUtilsContext();
  if (planMission.reposition.isActive && !planMission.isActive) {
    return (
      <>
        <div className="flex">
          <div className="flex justify-evenly items-center">
            Marker Height:{" "}
            <input
              className="text-black w-[20%] rounded-sm"
              defaultValue="10"
              onChange={(e) => {
                const re = /^[0-9\b]+$/;
                const altValue = e.target.value;
                const altitude =
                  altValue === "" || !re.test(altValue) ? 10 : Number(altValue);
                // setFlyToPoint({ ...flyToPoint, altitude: Number(e.target.value > 0 ? e.target.value : 10) })
                setPlanMission((prev) => ({
                  ...prev,
                  reposition: { ...prev.reposition, altitude: altitude },
                }));
              }}
            />{" "}
            meters
          </div>
          <div
            onClick={clearUserPosition}
            className="flex justify-center items-center"
          >
            <XCircle size={30} className="bg-black text-red-500" />
          </div>
          <div
            className="flex justify-center items-center"
            onClick={handleFlyToPoint}
          >
            <AirplaneTilt size={30} className="bg-black text-[#008000]" />
          </div>
        </div>

        <div className="flex justify-between mx-5">
          <div>
            <span className="font-bold">Lng:</span>
            {planMission.reposition.coordinates[0]?.toFixed(7)}
          </div>
          <span className="font-bold">|</span>
          <div>
            <span className="font-bold">Lat:</span>
            {planMission.reposition.coordinates[1]?.toFixed(7)}
          </div>
        </div>
      </>
    );
  }
};

export default RepositionMarkerConfig;
