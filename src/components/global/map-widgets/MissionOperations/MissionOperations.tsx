import {
  openFileBox,
  planSurvey,
  planTakeOff,
  togglePlanAMission,
  useTogglePlanAMission,
} from "@/components/utils/map";
import { useDroneUtilsContext } from "@/contexts/DroneStatusContext";
import { useMapContext } from "@/contexts/MapContext";
import {
  AirplaneLanding,
  AirplaneTakeoff,
  ArrowCircleRight,
  FilePlus,
  GpsFix,
  KeyReturn,
  MapPinSimpleArea,
  Planet,
  Pulse,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { GoHome } from "react-icons/go";

const MissionOperations = () => {
  //  WIP: Complete all the functions
  const {
    planMission,
    droneStatus,
    takeOffObject,
    rTLObject,
    takeOffStatus,
    setTakeOffStatus,
    emptyPlanMissionState,
    historyMissions,
    roiObject,
    setDroneStatus,
    setHistoryMissions,
    setPlanMission,
    wayPointsObject,
  } = useDroneUtilsContext();

  const { mapObject, markers, roiRef, setMapObject, setMarkers, wayPointRef } =
    useMapContext();

  const handleTakeOff = () => {
    console.log("handleTakeOff");
  };

  const handleLandMode = () => {
    console.log("handleLandMode");
  };

  const confirmLandMode = () => {
    console.log("confirmLandMode");
  };

  const handleRTLMode = () => {
    console.log("handleRTLMode");
  };

  const confirmRTLMode = () => {
    console.log("confirmRTLMode");
  };

  const handleSmartRTLMode = () => {
    console.log("handleSmartRTLMode");
  };

  const confirmSmartRTLMode = () => {
    console.log("confirmSmartRTLMode");
  };

  const uploadMission = () => {
    console.log("uploadMission");
  };

  const downloadMission = () => {
    console.log("downloadMission");
  };

  const clearMission = () => {
    console.log("clearMission");
  };

  const toggleWayPoint = () => {
    console.log("toggleWayPoint");
  };

  const handleROI = () => {
    console.log("handleROI");
  };

  const planRTL = () => {
    console.log("planRTL");
  };

  const flyMission = () => {
    console.log("flyMission");
  };

  const toggleTakeOff = () => {
    console.log("toggleTakeOff");
  };

  const togglePlanAMission = () => {
    // useTogglePlanAMission(
    //   takeOffObject,
    //   wayPointsObject,
    //   roiObject,
    //   rTLObject,
    //   setPlanMission,
    //   emptyPlanMissionState,
    //   mapObject
    // );
    useTogglePlanAMission()
    // useTogglePlanAMission();
  };

  return (
    <>
      <div className="bg-black rounded-lg my-auto">
        {/* PLAN A MISSION */}
        <div className="p-1 text-center max-w-fit">
          {/* Activating Plan Mission */}
          <div onClick={togglePlanAMission} className="cursor-pointer">
            {/* Close if Active or Plan if Inactive  */}
            <div className="px-5">
              {planMission.isActive ? (
                <X size={30} className="text-red-500" />
              ) : (
                <Planet size={30} />
              )}
            </div>
            <span className="font-bold">
              {planMission.isActive ? "Close" : "Plan"}
            </span>
          </div>
          {planMission.isActive === true && (
            <>
              <div className="border-t-[1px] w-[70%] my-3 mx-auto"></div>

              {/* Survey */}
              <div
                className={`${
                  planMission.survey.surveyActive
                    ? "bg-white text-black rounded-lg"
                    : "bg-black text-white"
                } flex flex-col cursor-pointer justify-center items-center my-1 p-0.5`}
                onClick={planSurvey}
              >
                <Pulse size={25} />
                Survey
              </div>

              {/* File */}
              <div
                className={`${
                  planMission.fileActive
                    ? "bg-white text-black rounded-lg"
                    : "bg-black text-white"
                } flex flex-col cursor-pointer justify-center items-center my-1 p-0.5`}
                onClick={openFileBox}
              >
                <FilePlus size={25} />
                File
              </div>

              {/* Take Off */}
              <div
                className={`${
                  (takeOffObject.currentMarker !== null ||
                    planMission.survey.surveyActive === true) &&
                  "text-gray-700"
                } flex flex-col cursor-pointer justify-center items-center my-1 p-0.5`}
                onClick={() => {
                  if (planMission.survey.surveyActive === false) {
                    planTakeOff();
                  } else {
                  }
                }}
              >
                <UploadSimple size={25} />
                Take Off
              </div>

              {/* Waypoint */}
              <div
                className={`${
                  takeOffObject.currentMarker === null && "text-gray-700"
                } ${
                  planMission.wayPoint.wayPointActive &&
                  "bg-white text-black rounded-lg"
                } flex flex-col cursor-pointer justify-center items-center my-1 p-0.5`}
                onClick={
                  planMission.takeoff.marker !== null
                    ? () => {
                        toggleWayPoint();
                      }
                    : () => {
                        console.log("First, add takeoff...");
                      }
                }
              >
                <GpsFix size={25} />
                Way Point
              </div>

              {/* ROI */}
              <div
                className={`${
                  planMission.roi.roiActive
                    ? "bg-white text-black rounded-lg"
                    : `${
                        takeOffObject.currentMarker === null
                          ? "text-gray-700"
                          : "bg-black text-white"
                      }`
                } flex flex-col cursor-pointer justify-center items-center my-1 p-0.5`}
                onClick={
                  planMission.takeoff.marker !== null
                    ? () => {
                        handleROI();
                      }
                    : () => {
                        console.log("First, add takeoff...");
                      }
                }
              >
                <MapPinSimpleArea size={25} />
                {planMission.roi.start ? "Cancel ROI" : "Add ROI"}
              </div>

              {/* Return To Launch */}
              <div
                className={`${
                  rTLObject.currentMarker !== null && "text-gray-700"
                } ${
                  takeOffObject.currentMarker === null && "text-gray-700"
                } flex flex-col cursor-pointer justify-center items-center my-1 p-0.5`}
                onClick={
                  planMission.takeoff.marker !== null
                    ? planRTL
                    : () => {
                        console.log("First, add takeoff...");
                      }
                }
              >
                <GoHome size={25} />
                RTL
              </div>

              <div className="border-t-[1px] w-[70%] my-3 mx-auto"></div>

              {/* Fly Mission */}
              <div
                className="my-2 flex flex-col cursor-pointer justify-center items-center"
                onClick={flyMission}
              >
                <AirplaneTakeoff size={25} className="text-green-500" />
                Fly
              </div>
            </>
          )}
        </div>

        {/* TAKEOFF TO ALTITUDE */}
        {!planMission.isActive &&
          droneStatus.extendedSysState.landed_state === 1 && (
            <div
              className="text-center max-w-fit p-1 cursor-pointer"
              onClick={toggleTakeOff}
            >
              <div className="px-5">
                <AirplaneTakeoff size={30} />
              </div>
              <span className="font-bold">TakeOff</span>
              {takeOffStatus.isActive === true && (
                <>
                  <div>
                    Height:{" "}
                    <input
                      className="text-black w-[20%] rounded-sm"
                      defaultValue="10"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === "" || re.test(e.target.value))
                          setTakeOffStatus({
                            ...takeOffStatus,
                            altitude: Number(
                              parseFloat(e.target.value) > 0
                                ? parseFloat(e.target.value)
                                : 10
                            ),
                          });
                      }}
                    />
                    meters
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleTakeOff}
                      type="button"
                      className="border-white border-2 p-1 hover:text-black hover:bg-white"
                    >
                      Takeoff
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        {/* Land Mode */}
        {!planMission.isActive &&
          droneStatus.extendedSysState.landed_state !== 1 &&
          droneStatus.extendedSysState.landed_state !== null && (
            <div
              className={`text-center max-w-fit p-1 cursor-pointer ${
                droneStatus.extendedSysState.landed_state === 4
                  ? "text-gray-500"
                  : "text-white"
              }`}
            >
              <div className="px-5">
                {droneStatus.landMode ? (
                  <ArrowCircleRight
                    onClick={handleLandMode}
                    size={30}
                    className="text-green-500"
                  />
                ) : (
                  <AirplaneLanding onClick={confirmLandMode} size={30} />
                )}
              </div>
              <span className="font-bold">Land</span>
            </div>
          )}

        {/* Return To Launch */}
        {!planMission.isActive && (
          <div className="p-1 text-center max-w-fit">
            <div className="cursor-pointer">
              <div className="px-5">
                {droneStatus.rtlMode ? (
                  <ArrowCircleRight
                    onClick={handleRTLMode}
                    size={30}
                    className="text-green-500"
                  />
                ) : (
                  <KeyReturn
                    onClick={confirmRTLMode}
                    className={`${
                      droneStatus.extendedSysState.landed_state === 1 ||
                      droneStatus.mode.name === "RTL"
                        ? "text-gray-500"
                        : "text-white"
                    }`}
                    size={30}
                  />
                )}
              </div>
              <span
                className={`${
                  droneStatus.extendedSysState.landed_state === 1 ||
                  droneStatus.mode.name === "RTL"
                    ? "text-gray-500"
                    : "text-white"
                } font-bold`}
              >
                {droneStatus.rtlMode ? "Confirm?" : "Return"}
              </span>
            </div>
          </div>
        )}

        {/* Smart Return To Launch */}
        {!planMission.isActive && (
          <div className="p-1 text-center max-w-fit">
            <div className="cursor-pointer">
              <div className="px-5">
                {droneStatus.smartRtlMode ? (
                  <ArrowCircleRight
                    onClick={handleSmartRTLMode}
                    size={30}
                    className="text-green-500"
                  />
                ) : (
                  <KeyReturn
                    onClick={confirmSmartRTLMode}
                    className={`${
                      droneStatus.extendedSysState.landed_state === 1 ||
                      droneStatus.mode.name === "SMART RTL"
                        ? "text-gray-500"
                        : "text-white"
                    }`}
                    size={30}
                  />
                )}
              </div>
              <span
                className={`${
                  droneStatus.extendedSysState.landed_state === 1 ||
                  droneStatus.mode.name === "SMART RTL"
                    ? "text-gray-500"
                    : "text-white"
                } font-bold`}
              >
                {droneStatus.smartRtlMode ? "Confirm?" : "Smart RTL"}
              </span>
            </div>
          </div>
        )}

        {/* Pause - BRAKE mode */}
        {/* <div className="p-1 text-center max-w-fit">
          <div className="cursor-pointer">
            <div className="px-5">
              {rtlMode ? (
                <ArrowCircleRight
                  onClick={handleRTL}
                  size={30}
                  className="text-green-500"
                />
              ) : (
                <KeyReturn
                  onClick={confirmRTL}
                  className={`${
                    extendedSysState.landed_state === 1 ||
                    extendedSysState.landed_state === 4 ||
                    mode.name === "RTL"
                      ? "text-gray-500"
                      : "text-white"
                  }`}
                  size={30}
                />
              )}
            </div>
            <span
              className={`${
                extendedSysState.landed_state === 1 ||
                extendedSysState.landed_state === 4 ||
                mode.name === "RTL"
                  ? "text-gray-500"
                  : "text-white"
              } font-bold`}
            >
              {rtlMode ? "Confirm?" : "Return"}
            </span>
          </div>
        </div> */}
      </div>

      {/* File Operations */}
      {planMission.fileActive && (
        <div className="bg-black rounded-lg mx-auto w-80 p-5 h-fit">
          {/* File Operations */}
          <div className="text-lg text-center">File Operations</div>
          <div className="hidden">
            {/* Border */}
            <div className="border-t-[1px] my-2 mx-auto"></div>
            {/* Storage */}
            <div className="text-base">Storage</div>
            {/* Storage Operations */}
            <div className="flex justify-between my-2">
              {/* Open a File */}
              <div className="p-3 text-base cursor-pointer bg-[#1C1C1E] rounded-lg min-w-20 text-center hover:text-black hover:bg-white">
                Open
              </div>
              {/* Save a file */}
              <div className="p-3 text-base cursor-pointer bg-[#1C1C1E] rounded-lg min-w-20 text-center hover:text-black hover:bg-white">
                Save
              </div>
              {/* Save As a file */}
              <div className="p-3 text-base cursor-pointer bg-[#1C1C1E] rounded-lg min-w-20 text-center hover:text-black hover:bg-white">
                Save As
              </div>
            </div>
          </div>
          {/* Border */}
          <div className="border-t-[1px] mt-5 my-2 mx-auto"></div>
          {/* Mission */}
          <div className="text-base text-center">Mission</div>
          {/* Vehicle Operations */}
          <div className="flex justify-between my-2">
            {/* Upload a mission */}
            <div
              onClick={uploadMission}
              className="p-3 text-base cursor-pointer bg-[#1C1C1E] rounded-lg min-w-20 text-center hover:text-black hover:bg-white"
            >
              Upload
            </div>
            {/* Download a mission */}
            <div
              onClick={downloadMission}
              className="p-3 text-base cursor-pointer bg-[#1C1C1E] rounded-lg min-w-20 text-center hover:text-black hover:bg-white"
            >
              Download
            </div>
            {/* Clear a mission */}
            <div
              onClick={clearMission}
              className="p-3 text-base cursor-pointer bg-[#1C1C1E] rounded-lg min-w-20 text-center hover:text-black hover:bg-white"
            >
              Clear
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MissionOperations;
