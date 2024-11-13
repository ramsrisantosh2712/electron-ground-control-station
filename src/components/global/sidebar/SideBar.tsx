import { Broadcast, Engine } from "@phosphor-icons/react";
import { LiaSatelliteSolid } from "react-icons/lia";
import { cn } from "@/lib/utils";
import { useSideBarContext } from "@/contexts/SideBarContext";

type SidePane = {
  type: string;
  isActive: boolean;
};

const Sidebar = () => {
  const { sidePane, setSidePane, sensorStatusToggle, setSensorStatusToggle } =
    useSideBarContext();

  const toggleSidePane = (value: SidePane) => {
    setSidePane({
      type: value.type, // Example type
      isActive: value.isActive,
    });
  };
  return (
    <div className="h-full rounded-lg bg-[#111111] text-white select-none flex flex-col justify-start items-center pt-5 gap-y-5">
      {/* Sensors */}
      <div
        title="Sensors"
        onClick={() => setSensorStatusToggle(!sensorStatusToggle)}
        className={cn(
          "cursor-pointer w-16 px-1 rounded-md",
          sensorStatusToggle && "bg-white text-black"
        )}
      >
        <Broadcast size={30} className={`mx-auto`} />
        <div className="text-wrap text-sm text-center">Sensors</div>
      </div>

      {/* Motors */}
      <div
        title="Motors"
        onClick={() =>
          toggleSidePane(
            sidePane.isActive && sidePane.type === "motors"
              ? { isActive: false, type: "motors" }
              : { isActive: true, type: "motors" }
          )
        }
        className={`${
          sidePane.type == "motors" && sidePane.isActive
            ? "bg-white text-black"
            : ""
        } cursor-pointer w-16 flex justify-center flex-col px-1 rounded-md`}
      >
        <Engine size={30} className={`mx-auto`} />
        <div className="text-wrap text-sm text-center">Motors</div>
      </div>

      {/* Gps */}
      <div
        title="GPS"
        onClick={() =>
          toggleSidePane(
            sidePane.isActive && sidePane.type === "gps"
              ? { isActive: false, type: "gps" }
              : { isActive: true, type: "gps" }
          )
        }
        className={`${
          sidePane.type == "gps" && sidePane.isActive
            ? "bg-white text-black"
            : ""
        } cursor-pointer w-16 flex justify-center flex-col px-1 rounded-md`}
      >
        <div className="flex items-center">
          <LiaSatelliteSolid size={35} className={`mx-auto`} />
          <div className="flex flex-col"></div>
        </div>
        <div className="text-wrap text-sm text-center">GPS</div>
      </div>
    </div>
  );
};

export default Sidebar;
