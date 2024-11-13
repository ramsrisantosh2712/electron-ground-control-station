import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SideBarContext } from "./contexts/SideBarContext.tsx";
import { DroneStatusContext } from "./contexts/DroneStatusContext.tsx";
import { MapContext } from "./contexts/MapContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MapContext>
    <DroneStatusContext>
      <SideBarContext>
        <App />
      </SideBarContext>
    </DroneStatusContext>
  </MapContext>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
