import MainComponent from "./components/global/main-component/MainComponent";
import Sidebar from "./components/global/sidebar/SideBar";
import { useSideBarContext } from "./contexts/SideBarContext";
import './App.css'

function App() {
  // TEST
  // const { sidePane } = useSideBarContext();

  return (
    <div className="bg-[#171717] h-screen w-full flex flex-row">
      <div className="w-[80px] h-full">
        <Sidebar />
      </div>
      <div className="w-full h-full text-white">
        <MainComponent />
      </div>
    </div>
  );
}

export default App;