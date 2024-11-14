import { useDroneUtilsContext } from "@/contexts/DroneStatusContext";

const MissionStatistics = () => {
  const { planMission } = useDroneUtilsContext();
  if (planMission.isActive) {
    return (
      <div className="">
        <div className="font-bold text-center">
          Total Mission{" "}
          {planMission.missionStatistics.totalArea !== 0
            ? ` Area ${planMission.missionStatistics.totalArea} Sqm`
            : ""}
        </div>
        <div className="flex gap-10 justify-around">
          <div>Distance: {planMission.missionStatistics.distance} m</div>
          <div>Time: {planMission.missionStatistics.timeTaken}</div>
          <div>
            Max telem dist: {planMission.missionStatistics.maxTelemDist} m
          </div>
        </div>
      </div>
    );
  }
};

export default MissionStatistics;
