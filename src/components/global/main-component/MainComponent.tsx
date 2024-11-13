import Map from "../map/Map";
import StatusBar from "../statusbar/StatusBar";

const MainComponent = () => {
  return (
    <div className="w-full h-full grid grid-rows-12">
      <div className="row-span-1 w-full h-full">
        <StatusBar />
      </div>
      <div className="row-span-11 w-full h-full">
        <Map />
      </div>
    </div>
  );
};

export default MainComponent;
