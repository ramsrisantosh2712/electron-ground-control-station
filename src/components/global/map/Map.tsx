import { useMapContext } from "@/contexts/MapContext";
import { useEffect, useRef } from "react";

import NavigationArrowImage from "@/images/NavigationArrow.png";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useDroneStatusContext } from "@/contexts/DroneStatusContext";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2hzYW50bzI3MTIiLCJhIjoiY2x0ODcxMXluMGlicDJvcnhzNmRqdmMwZSJ9._y02OmguIiSiJ1YDvrDrjA";

const Map = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapDrawRef = useRef<HTMLDivElement | null>(null);

  const { mapObject, setMapObject, setMarkers } = useMapContext();
  const { droneStatus } = useDroneStatusContext();

  useEffect(() => {
    if (mapObject.map || !mapRef.current) return;

    if (mapRef.current) {
      const mapInstance = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        zoom: 17.5,
      });

      mapInstance.dragRotate.disable();

      mapRef.current = mapInstance;

      function initDroneInstance() {
        // Create a DOM element for Drone Element and below are the properties.
        const drone = document.createElement("div");
        const width = 50;
        const height = 60;
        drone.className = `drone-marker`;
        drone.style.backgroundImage = `url(${NavigationArrowImage})`;
        // drone.style.backgroundImage = `url(${DroneImage})`;
        drone.style.backgroundRepeat = "no-repeat";
        drone.style.zIndex = "0";
        drone.style.width = `${width}px`;
        drone.style.height = `${height}px`;
        drone.style.backgroundSize = "100%";

        // const drone = document.createElement("div");
        // const width = 150;
        // const height = 160;

        // drone.className = "drone-marker";
        // drone.innerHTML = "D";
        // drone.style.width = `${width}px`;
        // drone.style.height = `${height}px`;
        // drone.style.color = "black";
        // drone.style.backgroundColor = "pink";
        // drone.style.borderRadius = "50%";
        // drone.style.display = "flex";
        // drone.style.alignItems = "center";
        // drone.style.justifyContent = "center";
        // drone.style.fontSize = "15px";
        // drone.style.fontWeight = "bold";
        // drone.style.zIndex = "10";
        // drone.style.backgroundSize = "100%";

        // Adding a `click` event listener
        drone.addEventListener("click", () => {
          // Alerting user
          window.alert("Zebu Wingman");
        });

        // Creating a drone instance to the Map object at the Drone's longitude and latitude
        const droneInstance = new mapboxgl.Marker(drone)
          .setLngLat([
            droneStatus.coordinates.longitude,
            droneStatus.coordinates.latitude,
          ])
          .addTo(mapInstance);

        // Handles the state of the Drone marker
        // setDroneMarker(droneInstance)
        setMarkers((prev) => ({ ...prev, drone: droneInstance }));
      }

      function initHomeInstance() {
        // Create a DOM element for Home Element and below are the properties.
        const home = document.createElement("div");
        const width = 25;
        const height = 25;

        // Set up the home marker with a circle and an "H" in the center
        home.className = "home-marker";
        home.innerHTML = "H";

        // Style the circle
        home.style.width = `${width}px`;
        home.style.height = `${height}px`;
        home.style.color = "black";
        home.style.backgroundColor = "white";
        home.style.borderRadius = "50%";
        home.style.display = "flex";
        home.style.alignItems = "center";
        home.style.justifyContent = "center";
        home.style.fontSize = "15px";
        home.style.fontWeight = "bold";
        home.style.zIndex = "10";
        home.style.backgroundSize = "100%";

        // Adding a `click` event listener
        home.addEventListener("click", () => {
          // Alerting user
          window.alert("Home");
        });

        // Creating a home instance to the Map object at the home position longitude and latitude
        const homeInstance = new mapboxgl.Marker(home)
          .setLngLat([
            droneStatus.homePosition.longitude,
            droneStatus.homePosition.latitude,
          ])
          .addTo(mapInstance);
        console.log(homeInstance);

        // Handles the state of the Home marker
        // setHomeMarker(homeInstance)
        setMarkers((prev) => ({ ...prev, home: homeInstance }));
      }

      initDroneInstance();
      initHomeInstance();

      const mapBoxDrawInstance = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        styles: [
          // ACTIVE (being drawn)
          // line stroke
          {
            id: "gl-draw-line",
            type: "line",
            filter: ["all", ["==", "$type", "LineString"]],
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "orange",
              "line-dasharray": [0.2, 2],
              "line-width": 2,
            },
          },
          // polygon fill
          {
            id: "gl-draw-polygon-fill",
            type: "fill",
            filter: ["all", ["==", "$type", "Polygon"]],
            paint: {
              "fill-color": "#D20C0C",
              "fill-outline-color": "#D20C0C",
              "fill-opacity": 0.1,
            },
          },
          // polygon mid points
          {
            id: "gl-draw-polygon-midpoint",
            type: "circle",
            filter: [
              "all",
              ["==", "$type", "Point"],
              ["==", "meta", "midpoint"],
            ],
            paint: {
              "circle-radius": 10,
              "circle-color": "#fbb03b",
            },
          },
          // polygon outline stroke
          // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
          {
            id: "gl-draw-polygon-stroke-active",
            type: "line",
            filter: ["all", ["==", "$type", "Polygon"]],
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "orange",
              "line-dasharray": [0.2, 2],
              "line-width": 2,
            },
          },
          // vertex points
          {
            id: "gl-draw-polygon-and-line-vertex-active",
            type: "circle",
            filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
            paint: {
              "circle-radius": 13,
              "circle-color": "green",
            },
          },
        ],
        defaultMode: "draw_polygon",
      });
      mapDrawRef.current = mapBoxDrawInstance;

      setMapObject((prev) => ({
        ...prev,
        map: mapInstance,
      }));

      mapInstance.on("load", () => {
        mapInstance.addSource("drone-path", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: [],
                },
                properties: {},
              },
            ],
          },
        });

        mapInstance.addLayer({
          id: "drone-path-layer",
          type: "line",
          source: "drone-path",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "blue",
            "line-width": 4,
          },
        });
      });
    }
  }, [mapObject.map]);

  return (
    <div className="p-2 h-full">
      <div ref={mapRef} id="map" className="h-full rounded-xl"></div>
    </div>
  );
};

export default Map;