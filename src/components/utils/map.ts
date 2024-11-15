import { useDroneUtilsContext } from "@/contexts/DroneStatusContext"
import { MapObjectState, useMapContext } from "@/contexts/MapContext"
import { getSocket } from "@/lib/utils"
import { DroneStatusState, HistoryMissionState, MarkerClass, PlanMissionState, RepositionStatusState } from "@/types/index.type"
import { GeoJSONSource, MapMouseEvent } from "mapbox-gl";
import * as turf from "@turf/turf";
import { Feature, Polygon } from "geojson";
import { v4 as uuidv4 } from 'uuid'
import mapboxgl from 'mapbox-gl'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


export const clearUserPosition = (
    planMission: PlanMissionState,
    setPlanMission: (planMission: PlanMissionState) => void,
    setTakeOffStatus: (takeOffStatus: RepositionStatusState) => void,
    setDroneStatus: (droneStatus: DroneStatusState) => void,
    setHistoryMissions: (historyMissions: HistoryMissionState) => void
) => {
    setTakeOffStatus((prev) => ({ ...prev, isActive: false }))
    setDroneStatus((prev) => ({ ...prev, rtlMode: false, landMode: false, smartRtlMode: false }))
    if (planMission.reposition.marker) {
        planMission.reposition.marker.remove()
    }
    setPlanMission((prev) => ({
        ...prev,
        fileActive: false,
        survey: { ...prev.survey, surveyActive: false },
        reposition: { ...prev.reposition, altitude: 10, coordinates: [], isActive: false, marker: null },

    }))
    setHistoryMissions((prev) => ({
        ...prev,
        isActive: false,
        missions: [],
        selectedMission: {
            status: "",
            id: -1,
            map: null,
            mission_count: 0,
            takeoff: [],
            waypoint: [],
            rtl: [],
            created_on: "",
            filename: "",
        },
    }))
}

export const handleFlyToPoint = () => {
    const { planMission, setPlanMission } = useDroneUtilsContext()
    const socket = getSocket()

    // Debug
    console.log("handleFlyToPoint")

    // Update the state of active to false
    // setFlyToPoint({ ...flyToPoint, isActive: false })
    // planMission.reposition.marker?.remove()
    setPlanMission((prev) => ({
        ...prev,
        reposition: {
            ...prev.reposition,
            altitude: 10,
            coordinates: [],
            isActive: false,
        }
    }))

    // This function emits `send_to_waypoint` event to the backend with a parameter of [longitude, latitude, altitude]
    socket.emit('send_to_waypoint', planMission.reposition.coordinates[0], planMission.reposition.coordinates[1], planMission.reposition.altitude)
}

export const removeWayPointEventListener = () => {
    const { mapObject, wayPointRef } = useMapContext()
    const { setPlanMission } = useDroneUtilsContext()
    if (!mapObject.map || !wayPointRef.current) return;

    mapObject.map.off('click', wayPointRef.current);
    wayPointRef.current = null;
    // setFlyToPoint({ ...flyToPoint, isActive: false })
    setPlanMission((prev) => ({
        ...prev,
        reposition: {
            altitude: 10,
            coordinates: [],
            isActive: false,
            marker: null
        }
    }))
};

export const addWayPointEventListener = () => {

    const { wayPointRef, mapObject } = useMapContext()
    const { takeOffObject, wayPointsObject, rTLObject, planMission, setPlanMission } = useDroneUtilsContext()

    // Creates a new waypoint
    const planWayPoint = (e: MapMouseEvent) => {
        // Creating a waypoint object of MarkerClass
        const newWayPointObject = new MarkerClass()
        let noOfWayPoints = wayPointsObject.length

        // Create a newMarker()
        const wayPoint = newMarker('#ff9f00', [e.lngLat.lng, e.lngLat.lat], "<p style='color: black'>Way Point</p>", 'waypoint', undefined, (wayPointsObject.length + 1).toString(), mapObject.map!)

        let tempCoordiantes = planMission.wayPoint.coordinates
        if (tempCoordiantes.length === 0)
            tempCoordiantes.push([e.lngLat.lng, e.lngLat.lat, 50, 0, false, 5])
        else
            tempCoordiantes.push([e.lngLat.lng, e.lngLat.lat, 50, 0, false, tempCoordiantes[tempCoordiantes.length - 1][5]])

        let tempMarkers = planMission.wayPoint.markers

        tempMarkers.push(wayPoint!)

        // Updating a mew plan mission with the new waypoint marker
        // setPlanMission((prev) => {
        //     const newState = { ...prev, wayPointsMarkers: tempMarkers, wayPointsCoordinates: tempCoordiantes }
        //     return newState
        // })

        setPlanMission((prev) => ({
            ...prev,
            wayPoint: { ...prev.wayPoint, markers: tempMarkers, coordinates: tempCoordiantes }
        }))

        // Adding routes and updating the MarkerClass Object
        let routeNo = uuidv4()
        newWayPointObject.currentMarker = wayPoint

        // Adding this data to the MarkerClass objects
        if (noOfWayPoints > 0) {
            let prevPoint = wayPointsObject[noOfWayPoints - 1]
            prevPoint.rightMarker = wayPoint
            newWayPointObject.leftMarker = prevPoint.currentMarker
            prevPoint.rightSourceId = `${routeNo}`
            newWayPointObject.leftSourceId = `${routeNo}`
            if (rTLObject.currentMarker !== null) {
                let route = uuidv4()
                mapObject.map!.removeLayer(rTLObject.leftSourceId!)
                newWayPointObject.rightMarker = rTLObject.currentMarker
                rTLObject.leftMarker = wayPoint
                newWayPointObject.rightSourceId = `${route}`
                rTLObject.leftSourceId = `${route}`

                addPath(`${route}`,
                    [rTLObject.currentMarker!.getLngLat().lng, rTLObject.currentMarker!.getLngLat().lat],
                    [rTLObject.leftMarker!.getLngLat().lng, rTLObject.leftMarker!.getLngLat().lat],
                    'green', mapObject.map!)
            }
        }
        else {
            if (takeOffObject.currentMarker !== null && rTLObject.currentMarker !== null) {
                // map.removeLayer(takeOffObject.rightSourceId)
                // TAKEOFF
                newWayPointObject.leftMarker = takeOffObject.currentMarker
                takeOffObject.rightMarker = wayPoint
                newWayPointObject.leftSourceId = `${routeNo}`
                takeOffObject.rightSourceId = `${routeNo}`

                // RTL
                let tempRouteNo = uuidv4()
                rTLObject.leftMarker = wayPoint
                newWayPointObject.rightMarker = rTLObject.currentMarker
                rTLObject.leftSourceId = `${tempRouteNo}`
                newWayPointObject.rightSourceId = `${tempRouteNo}`

                addPath(`${tempRouteNo}`,
                    [newWayPointObject.currentMarker!.getLngLat().lng, newWayPointObject.currentMarker!.getLngLat().lat],
                    [rTLObject.currentMarker!.getLngLat().lng, rTLObject.currentMarker!.getLngLat().lat],
                    'green', mapObject.map!)
            }
            else if (takeOffObject.currentMarker !== null) {
                newWayPointObject.leftMarker = takeOffObject.currentMarker
                takeOffObject.rightMarker = wayPoint
                newWayPointObject.leftSourceId = `${routeNo}`
                takeOffObject.rightSourceId = `${routeNo}`
            }
        }

        // Pushing the new waypoint marker to the wayPointsMarker object
        wayPointsObject.push(newWayPointObject)


        // Adding the path between left and right marker of the new waypoint
        addPath(`${routeNo}`,
            [newWayPointObject.currentMarker!.getLngLat().lng, newWayPointObject.currentMarker!.getLngLat().lat],
            [newWayPointObject.leftMarker!.getLngLat().lng, newWayPointObject.leftMarker!.getLngLat().lat],
            'yellow', mapObject.map!)

    }

    // Sets up the waypoint planning by assigning a click event handler to the map.
    wayPointRef.current = planWayPoint

    // Set up the click event listener on the map
    mapObject.map!.on('click', planWayPoint)

}

export const useTogglePlanAMission = (
    // takeOffObject: MarkerClass,
    // wayPointsObject: MarkerClass[],
    // roiObject: any[],
    // rTLObject: MarkerClass,
    // setPlanMission: (planMission: PlanMissionState) => void,
    // emptyPlanMissionState: PlanMissionState,
    // mapObject: MapObjectState
) => {

    // let {takeOffObject, wayPointsObject, roiObject, rTLObject, setPlanMission, emptyPlanMissionState } = useDroneUtilsContext()
    // const { mapObject} = useMapContext()
    console.log("HERE")
    const count = useSelector((state: RootState) => state.example.count)
    console.log(count)
    // Clears the user's position
    // clearUserPosition()

    const clearMission = () => {
        // let tempMission = planMission
        console.log("CLEAR if any existing plan")
        // REMOVE LAYERS
        if (mapObject.map && mapObject.map.getSource('area')) {
            mapObject.map.removeLayer('area')
            mapObject.map.removeSource('area')
        }

        if (mapObject.map && mapObject.mapBoxDraw && mapObject.map.hasControl(mapObject.mapBoxDraw)) {
            mapObject.map.removeControl(mapObject.mapBoxDraw)
        }

        if (takeOffObject.currentMarker !== null) {
            if (takeOffObject.rightSourceId !== null && mapObject.map)
                mapObject.map.removeLayer(takeOffObject.rightSourceId)

            wayPointsObject?.forEach(wayPoint => {
                if (wayPoint.rightSourceId !== null && mapObject.map)
                    mapObject.map.removeLayer(wayPoint.rightSourceId)
            })
        }
        takeOffObject.currentMarker?.remove()
        wayPointsObject.forEach(marker => marker.currentMarker && marker.currentMarker.remove())
        roiObject.forEach(marker => marker.remove())
        rTLObject.currentMarker?.remove()

        // NEW INSTANCES
        takeOffObject = new MarkerClass()
        wayPointsObject = []
        rTLObject = new MarkerClass()
        // setPlanMission(() => {
        //     const newState = { isActive: !planMission.isActive, initialWayPointAltitude: 50, takeOffCoordinates: [], takeOffMarker: null, wayPointsCoordinates: [], wayPointsMarkers: [], rtlCoordinates: [], rtlMarker: null, surveyCoordinates: [], surveyMarkers: [], surveyAltitude: 50, surveyAngle: 0, surveySpacing: 25 }
        //     return newState
        // })
        setPlanMission((prev) => ({ ...emptyPlanMissionState, isActive: !prev.isActive }))
        // setPlanMission((prev) => ({
        //     ...prev,
        //     missionStatistics: { distance: 0, timeTaken: "00:00:00", maxTelemDist: 0, totalArea: 0 }
        // }))
        // setMissionStatistics({ distance: 0, timeTaken: "00:00:00", maxTelemDist: 0, totalArea: 0 })
        removeWayPointEventListener()
        // setIsWayPointActive(false);
        // setFileActive(false)
    }

    // Calling the function to clear the mission
    // clearMission()

    // Setting the waypoint planning is not active
    // setIsWayPointActive(false)
}

export function addSurvey(e: { features: Feature<Polygon>[] }): void {
    let { setPlanMission, wayPointsObject } = useDroneUtilsContext()
    const { mapObject } = useMapContext()
    // Update the survey polygon state with the new polygon data
    // setSurveyPolygon(e)
    setPlanMission((prev) => ({
        ...prev,
        survey: { ...prev.survey, surveyPolygon: e }
    }))

    // Extract the polygon and its coordinates from the event object
    const polygon = e.features[0];
    const coordinates = polygon.geometry.coordinates[0];

    // Retrieve all features from the Mapbox Draw control
    const data = mapObject.mapBoxDraw && mapObject.mapBoxDraw.getAll();

    // If an existing area source is present on the map, remove its related waypoints and layers
    if (mapObject.map && mapObject.map.getSource('area') !== undefined) {
        for (let i = 0; i < wayPointsObject.length; i++) {
            let wayPoint = wayPointsObject[i]
            mapObject.map.removeLayer(wayPoint.leftSourceId!)
            wayPoint.currentMarker && wayPoint.currentMarker.remove()
        }
        if (wayPointsObject.length > 0)
            mapObject.map.removeLayer(wayPointsObject[wayPointsObject.length - 1].rightSourceId!)
        wayPointsObject = []
        update = false
    }

    // Update the existing area source or add a new one with the new polygon data
    if (mapObject.map && mapObject.map.getSource('area')) {
        let source = mapObject.map.getSource('area')
        if (source && source.type === 'geojson') {
            const geojsonSource = source as GeoJSONSource;

            // Create a new GeoJSON object with updated coordinates
            const newData: GeoJSON.Feature<GeoJSON.Geometry> = {
                type: "Feature",
                geometry: {
                    type: "Polygon", // or "Point", "LineString", etc., depending on your use case
                    coordinates: [coordinates],
                },
                properties: {},
            };

            // Update the source data
            geojsonSource.setData(newData);
        }
    }
    else {
        mapObject.map && mapObject.map.addSource('area', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [coordinates]
                },
                properties: {}
            }
        })

        mapObject.map && mapObject.map.addLayer({
            id: 'area',
            source: 'area',
            type: 'fill',
            paint: {
                'fill-color': 'green',
                'fill-opacity': 0.3
            }
        })
    }


    // If there are features in the Mapbox Draw control, create parallel lines for the survey area
    if (data && data.features.length > 0) {
        createParallelLines(polygon)
    }
}

const createParallelLines = (polygon: Feature<Polygon>): void => {
    const metersToLatDegrees = (meters: number) => {
        const earthCircumference = 40075000;
        return meters / earthCircumference * 360;
    };

    const { planMission } = useDroneUtilsContext()
    let parallelLines = []
    let box = turf.bbox(polygon)
    let [minLat, minLon, maxLat, maxLon] = box
    let offSet = planMission.survey.surveyConfig.spacing
    let offSetMetersToLat = metersToLatDegrees(offSet)
    let degrees = planMission.survey.surveyConfig.angle

    let currentForwardLon = minLon
    let currentBackwardLon = minLon
    let i = 0
    // let diameterOfArea = turf.lineString([[minLat, maxLon], [maxLat, minLon]])
    // let diameter = turf.length(diameterOfArea, { units: "meters" })
    let back = []
    let front = []

    while (true) {

        if (i == 1000) break;

        const forwardLine = turf.lineString([
            [minLat, currentForwardLon],
            [maxLat, currentForwardLon],
        ])

        const backwardLine = turf.lineString([
            [minLat, currentBackwardLon],
            [maxLat, currentBackwardLon],
        ])

        // Create forward and backward lines based on current longitude positions
        let forwardRotate = turf.transformRotate(forwardLine, degrees, { pivot: [minLat, maxLon] })
        let backwardRotate = turf.transformRotate(backwardLine, degrees, { pivot: [minLat, maxLon] })

        // Extend the lines to ensure they cover the polygon area
        let forwardLeftExtendDestination = turf.destination(forwardRotate.geometry.coordinates[0], 1, -90 + degrees, { units: 'kilometers' })
        let forwardRightExtendDestination = turf.destination(forwardRotate.geometry.coordinates[1], 1, 90 + degrees, { units: 'kilometers' })

        // Create extended lines
        let backwardLeftExtendDestination = turf.destination(backwardRotate.geometry.coordinates[0], 1, -90 + degrees, { units: 'kilometers' })
        let backwardRightExtendDestination = turf.destination(backwardRotate.geometry.coordinates[1], 1, 90 + degrees, { units: 'kilometers' })

        // Check if the extended lines intersect with the survey polygon
        const forwardExtendedLines = turf.lineString([forwardLeftExtendDestination.geometry.coordinates, forwardRightExtendDestination.geometry.coordinates])
        const backwardExtendedLines = turf.lineString([backwardLeftExtendDestination.geometry.coordinates, backwardRightExtendDestination.geometry.coordinates])

        let forwardLineIntersected = turf.lineIntersect(forwardExtendedLines, polygon)
        let backwardLineIntersected = turf.lineIntersect(backwardExtendedLines, polygon)
        // if (intersected.features.length > 0) {
        currentForwardLon += offSetMetersToLat
        currentBackwardLon -= offSetMetersToLat

        // Add intersected lines to the front or back arrays
        if (i == 0) {
            if (forwardLineIntersected.features.length > 0) {
                front.push(forwardExtendedLines)
            }
            i++
            continue
        }
        if (forwardLineIntersected.features.length > 0) {
            front.push(forwardExtendedLines)
        }
        if (backwardLineIntersected.features.length > 0) {
            back.push(backwardExtendedLines)
        }
        i++
    }

    // Reverse back lines for the zig-zag way and then push those intersected lines
    back.reverse()
    parallelLines.push(...back)
    parallelLines.push(...front)

    // Rotate the waypoints if the state of the rotateWayPoints is triggered
    if (planMission.survey.surveyRotateWayPoints)
        parallelLines.reverse()

    const intersectionPoints = [];
    let intersectionCoordinates: Array<Array<number>> = []

    // After each intersecting points change the direction for the zig-zag waypoints
    let changeDirection = false
    parallelLines.forEach((line) => {
        const intersected = turf.lineIntersect(line, polygon);
        intersectionPoints.push(...intersected.features);
        if (changeDirection) {
            // Reverse the intersected points
            intersected.features.reverse()
            intersected.features.forEach((point) => {
                intersectionCoordinates.push(point.geometry.coordinates)
            })
            changeDirection = false
        }
        else {
            intersected.features.forEach((point) => {
                intersectionCoordinates.push(point.geometry.coordinates)
            })
            changeDirection = true
        }

    });

    // Create survey waypoints based on intersection coordinates
    createSurveyWaypoints(intersectionCoordinates)
}

const createSurveyWaypoints = (coordinates: Array<Array<number>>) => {

    const { takeOffObject, wayPointsObject, rTLObject, droneStatus, setPlanMission } = useDroneUtilsContext()
    const { mapObject } = useMapContext()

    let takeOff: mapboxgl.Marker | null | undefined
    let rtl: mapboxgl.Marker | null | undefined
    let init = false

    if (takeOffObject.currentMarker === null) {
        // Creating takeOffObject
        init = true
        takeOff = newMarker('green', [droneStatus.homePosition.longitude, droneStatus.homePosition.latitude], "<p style='color: black'>Take Off</p>", 'takeoff', undefined, undefined, mapObject.map)
        takeOffObject.currentMarker = takeOff

        let takeOffCoordinates = takeOffObject.currentMarker!.getLngLat()
        // Creating rtlObject
        rtl = newMarker('gray', [takeOffCoordinates.lng, takeOffCoordinates.lat], "<p style='color: black'>Return To Home</p>", 'rtl', undefined, undefined, mapObject.map)
        let routeNo = uuidv4()

        rTLObject.currentMarker = rtl
        rTLObject.leftMarker = null;
        rTLObject.rightMarker = null;
        rTLObject.leftSourceId = `${routeNo}`;
        rTLObject.rightSourceId = null

        if (wayPointsObject.length === 0 && takeOffObject.currentMarker !== null) {
            takeOffObject.rightMarker = rTLObject.currentMarker
            rTLObject.leftMarker = takeOffObject.currentMarker
            takeOffObject.rightSourceId = `${routeNo}`
            rTLObject.leftSourceId = `${routeNo}`
        }
        if (rTLObject && rTLObject.leftMarker) {
            addPath(`${routeNo}`,
                [rTLObject.currentMarker!.getLngLat().lng, rTLObject.currentMarker!.getLngLat().lat],
                [rTLObject.leftMarker.getLngLat().lng, rTLObject.leftMarker.getLngLat().lat],
                'green', mapObject.map!)
        }
    }

    let surveyMarkers = []

    for (let i = 0; i < coordinates.length; i++) {

        let currentLat = coordinates[i][0]
        let currentLng = coordinates[i][1]
        let currentCoordinates = [currentLat, currentLng]

        if (i == 0) {
            let waypoint = newMarker('violet', currentCoordinates, "<p style='color: black'>WayPoint</p>", 'survey', false, (wayPointsObject.length + 1).toString(), mapObject.map)
            let routeNo = uuidv4()
            let newWayPointMarker = new MarkerClass()
            takeOffObject.rightMarker = waypoint
            takeOffObject.rightSourceId = routeNo
            newWayPointMarker.currentMarker = waypoint
            newWayPointMarker.leftMarker = takeOffObject.currentMarker
            newWayPointMarker.leftSourceId = routeNo

            let leftMarkerCoordinates = [takeOffObject.currentMarker!.getLngLat().lng, takeOffObject.currentMarker!.getLngLat().lat]
            let rightMarkerCoordinates = currentCoordinates
            wayPointsObject.push(newWayPointMarker)
            addPath(routeNo, leftMarkerCoordinates, rightMarkerCoordinates, 'green', mapObject.map!)
            surveyMarkers.push(waypoint)
        }
        else if (i == coordinates.length - 1) {
            let waypoint = newMarker('brown', currentCoordinates, "<p style='color: black'>WayPoint</p>", 'survey', false, (wayPointsObject.length + 1).toString(), mapObject.map!)
            let noOfWayPoints = wayPointsObject.length
            let lastWayPoint = wayPointsObject[noOfWayPoints - 1]
            let newWayPointMarker = new MarkerClass
            let routeNo = uuidv4()
            newWayPointMarker.currentMarker = waypoint
            newWayPointMarker.leftMarker = lastWayPoint.currentMarker
            newWayPointMarker.leftSourceId = routeNo
            lastWayPoint.rightMarker = waypoint
            lastWayPoint.rightSourceId = routeNo

            let leftMarkerCoordinates = [lastWayPoint.currentMarker!.getLngLat().lng, lastWayPoint.currentMarker!.getLngLat().lat]
            let rightMarkerCoordinates = currentCoordinates
            wayPointsObject.push(newWayPointMarker)
            addPath(routeNo, leftMarkerCoordinates, rightMarkerCoordinates, 'yellow', mapObject.map!)

            noOfWayPoints = wayPointsObject.length
            lastWayPoint = wayPointsObject[noOfWayPoints - 1]
            routeNo = uuidv4()
            lastWayPoint.rightSourceId = routeNo
            lastWayPoint.rightMarker = rTLObject.currentMarker
            rTLObject.leftMarker = waypoint
            rTLObject.leftSourceId = routeNo

            leftMarkerCoordinates = [rTLObject.currentMarker!.getLngLat().lng, rTLObject.currentMarker!.getLngLat().lat]
            rightMarkerCoordinates = [lastWayPoint.currentMarker!.getLngLat().lng, lastWayPoint.currentMarker!.getLngLat().lat]
            addPath(routeNo, leftMarkerCoordinates, rightMarkerCoordinates, 'brown', mapObject.map!)
            surveyMarkers.push(waypoint)
        }
        else {
            let waypoint = newMarker('green', currentCoordinates, "<p style='color: black'>WayPoint</p>", 'survey', undefined, (wayPointsObject.length + 1).toString(), mapObject.map!)
            let newWayPointMarker: MarkerClass = new MarkerClass()
            let routeNo = uuidv4()
            let noOfWayPoints = wayPointsObject.length
            let lastWayPoint = wayPointsObject[noOfWayPoints - 1]
            newWayPointMarker.leftMarker = lastWayPoint.currentMarker
            newWayPointMarker.leftSourceId = routeNo
            newWayPointMarker.currentMarker = waypoint
            lastWayPoint.rightMarker = waypoint
            lastWayPoint.rightSourceId = routeNo

            let leftMarkerCoordinates = [lastWayPoint.currentMarker!.getLngLat().lng, lastWayPoint.currentMarker!.getLngLat().lat]
            let rightMarkerCoordinates = currentCoordinates
            wayPointsObject.push(newWayPointMarker)
            addPath(routeNo, leftMarkerCoordinates, rightMarkerCoordinates, 'yellow', mapObject.map!)
            surveyMarkers.push(waypoint)

        }

        if (init === true) {
            setPlanMission((prev: PlanMissionState) => ({
                ...prev,
                takeoff: { ...prev.takeoff, coordinates: [droneStatus.homePosition.longitude, droneStatus.homePosition.latitude, 50], marker: takeOff },
                survey: { ...prev.survey, coordinates: coordinates, markers: surveyMarkers, },
                rtl: { ...prev.rtl, coordinates: [droneStatus.homePosition.longitude, droneStatus.homePosition.latitude], marker: rtl }
            }))
        }
        else {
            setPlanMission((prev) => ({
                ...prev,
                survey: { ...prev.survey, coordinates: coordinates, markers: surveyMarkers, },
            }))
        }

    }
};

export const modifyWayPointMarker = (e: any) => {
    const { setPlanMission } = useDroneUtilsContext()
    const modifiedMarker = e.target
    const wayPointId = Number(modifiedMarker._element.id)
    // setModifyWaypoint({ id: wayPointId, marker: modifiedMarker })
    setPlanMission((prev) => ({
        ...prev,
        wayPoint: { ...prev.wayPoint, modifyWaypoint: { id: wayPointId, marker: modifiedMarker } }
    }))
}

export const modifyTakeOffMarker = (e: any) => {
    const { setPlanMission } = useDroneUtilsContext()
    const modifiedMarker = e.target
    setPlanMission((prev) => ({
        ...prev,
        takeoff: { ...prev.takeoff, modifyTakeoff: { marker: modifiedMarker } }
    }))
}

export const modifyROIMarker = (e: any) => {
    // WIP: ROI functionality

    console.log(e.target)
}

export const newMarker = (color: string, coordinates: Array<number>, popUpText: string, type: string, showMarkers = true, markerContent: string | null, map: mapboxgl.Map) => {
    const { wayPointsObject } = useDroneUtilsContext()
    if (type === 'waypoint') {
        // Create a marker element with the following properties
        const noOfWayPoints = wayPointsObject.length; // Increment for new waypoint number
        const markerDiv = document.createElement('div');
        markerDiv.className = 'marker';
        // markerDiv.textContent = noOfWayPoints + 1;
        markerDiv.textContent = markerContent;
        markerDiv.style.backgroundColor = color;
        markerDiv.style.borderRadius = '100%';
        markerDiv.style.color = 'white';
        markerDiv.style.width = '20px';
        markerDiv.style.height = '20px';
        markerDiv.style.display = 'flex';
        markerDiv.style.justifyContent = 'center';
        markerDiv.style.alignItems = 'center';
        markerDiv.style.fontSize = '14px';
        markerDiv.style.fontSize = '14px';
        markerDiv.style.zIndex = '20';

        // Creating a MapBox Marker at given coordinates with given popup text and adding to the map instance
        const wayPointMarker = new mapboxgl.Marker({
            element: markerDiv,
            draggable: true
        }).setLngLat(coordinates as [number, number])
            .setPopup(popUpText ? new mapboxgl.Popup().setHTML(popUpText).addTo(map) : null)
            .addTo(map);

        // Explictly modifying the element id for each marker with the length of the waypoints
        wayPointMarker._element.id = `${noOfWayPoints}`;

        // Adding a Event listener `drag` to modify the updated coordinates of the waypoint
        wayPointMarker.on('drag', modifyWayPointMarker);
        return wayPointMarker

    } else if (type === 'survey') {

        // Create a marker element with the following properties
        const noOfSurveyPoints = wayPointsObject.length; // Increment for new surveypoint number
        const markerDiv = document.createElement('div');
        if (showMarkers == false) {
            markerDiv.className = 'marker';
            // markerDiv.textContent = noOfSurveyPoints + 1;
            markerDiv.textContent = markerContent;
            markerDiv.style.backgroundColor = color;
            markerDiv.style.borderRadius = '100%';
            markerDiv.style.color = 'white';
            markerDiv.style.width = '20px';
            markerDiv.style.height = '20px';
            markerDiv.style.display = 'flex';
            markerDiv.style.justifyContent = 'center';
            markerDiv.style.alignItems = 'center';
            markerDiv.style.fontSize = '14px';
            markerDiv.style.fontSize = '14px';
        }

        // Creating a MapBox Marker at given coordinates with given popup text and adding to the map instance
        const surveyMarker = new mapboxgl.Marker({
            element: markerDiv,
        }).setLngLat(coordinates as [number, number])
            .setPopup(popUpText ? new mapboxgl.Popup().setHTML(popUpText).addTo(map) : null)
            .addTo(map);

        // Explictly modifying the element id for each marker with the length of the survey points
        surveyMarker._element.id = `${noOfSurveyPoints}`;
        return surveyMarker;

    } else if (type === 'takeoff') {

        const takeOffDiv = document.createElement('div');
        const width = 20;
        const height = 20;

        // Style the circle
        takeOffDiv.style.width = `${width}px`;
        takeOffDiv.style.height = `${height}px`;
        takeOffDiv.style.borderRadius = '50%';       // Makes the div a circle
        takeOffDiv.style.display = 'flex';           // Flexbox to center the T
        takeOffDiv.style.alignItems = 'center';      // Vertically center the T
        takeOffDiv.style.justifyContent = 'center';  // Horizontally center the T
        takeOffDiv.style.fontSize = '15px';          // Font size for the letter T
        takeOffDiv.style.fontWeight = 'bold';        // Make the letter T bold
        takeOffDiv.style.zIndex = '20';                 // Ensure it doesn't overlap other markers
        takeOffDiv.style.backgroundSize = '100%';
        takeOffDiv.innerHTML = 'T';
        takeOffDiv.style.backgroundColor = 'green'
        takeOffDiv.style.color = 'white'


        // Creating a MapBox Marker at given coordinates with given popup text and adding to the map instance
        const takeOffMarker = new mapboxgl.Marker({
            color: color,
            element: takeOffDiv,
            draggable: true
        }).setLngLat(coordinates as [number, number])
            .setPopup(popUpText !== undefined ? new mapboxgl.Popup().setHTML(popUpText).addTo(map) : null)
            .addTo(map);

        // Explictly modifying the element id for each marker with the `takeoff`
        takeOffMarker._element.id = 'takeoff';

        // Adding a Event listener `drag` to modify the updated coordinates of the waypoint
        takeOffMarker.on('drag', modifyTakeOffMarker);
        return takeOffMarker

    } else if (type === 'roi') {
        const roiDiv = document.createElement('div');
        roiDiv.className = 'marker';
        roiDiv.innerHTML = markerContent as string;
        roiDiv.style.backgroundColor = color;
        roiDiv.style.borderRadius = '100%';
        roiDiv.style.color = 'black';
        roiDiv.style.width = '20px';
        roiDiv.style.height = '20px';
        roiDiv.style.display = 'flex';
        roiDiv.style.justifyContent = 'center';
        roiDiv.style.alignItems = 'center';
        roiDiv.style.fontSize = '10px';
        roiDiv.style.fontSize = '10px';
        roiDiv.style.zIndex = '20';

        // Creating a MapBox Marker at given coordinates with given popup text and adding to the map instance
        const roiMarker = new mapboxgl.Marker({
            color: color,
            element: roiDiv,
            draggable: true
        }).setLngLat(coordinates as [number, number])
            .setPopup(popUpText !== undefined ? new mapboxgl.Popup().setHTML(popUpText).addTo(map) : null)
            .addTo(map);

        // Adding a Event listener `drag` to modify the updated coordinates of the waypoint
        roiMarker.on('drag', modifyROIMarker);
        return roiMarker
    } else if (type === 'rtl') {

        const rtlDiv = document.createElement('div');
        const width = 20;
        const height = 20;

        // Style the circle
        rtlDiv.style.width = `${width}px`;
        rtlDiv.style.height = `${height}px`;
        rtlDiv.style.borderRadius = '50%';       // Makes the div a circle
        rtlDiv.style.display = 'flex';           // Flexbox to center the H
        rtlDiv.style.alignItems = 'center';      // Vertically center the H
        rtlDiv.style.justifyContent = 'center';  // Horizontally center the H
        rtlDiv.style.fontSize = '15px';          // Font size for the letter H
        rtlDiv.style.fontWeight = 'bold';        // Make the letter H bold
        rtlDiv.style.zIndex = '0';                 // Ensure it doesn't overlap other markers
        rtlDiv.style.backgroundSize = '100%';
        // rtlDiv.innerHTML = 'T';
        // rtlDiv.style.backgroundColor = 'green'
        // rtlDiv.style.color = 'white'

        const rtlMarker = new mapboxgl.Marker({
            color: color,
            element: rtlDiv,
            draggable: true
        }).setLngLat(coordinates as [number, number])
            .setPopup(popUpText ? new mapboxgl.Popup().setHTML(popUpText).addTo(map) : null)
            .addTo(map);

        // Setting the draggable to false
        // marker.setDraggable(false);

        // Explictly modifying the element id for each marker with the `rtl` and making it to be `hidden`
        rtlMarker._element.id = 'rtl';
        rtlMarker._element.classList.add('hidden');
        return rtlMarker;

        // New feature
        // marker.on('drag', modifyRtlMarker)
    }


    // Returning the newly created marker
}

export const addPath = (routeNo: string, from: Array<number>, to: Array<number>, color: string, map: mapboxgl.Map) => {
    // Debug
    // console.log(`Route - ${routeNo} Created`)

    // Creating a source with `routeNo` with the coordinates [from, to]
    map.addSource(routeNo, {
        type: 'geojson',
        data: {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: [from, to],
            },
        },
    });

    // Adding a layer with the source `routeNo` and painting the line with `color`
    map.addLayer({
        id: routeNo,
        type: 'line',
        source: routeNo,
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': color,
            'line-width': 4,
        },
    });
}

export const planSurvey = () => {
    let { takeOffObject, wayPointsObject, emptyPlanMissionState, planMission, setPlanMission } = useDroneUtilsContext()
    const { mapObject } = useMapContext()
    // setPlanSurveyActive(!planSurveyActive)
    setPlanMission((prev) => ({
        ...prev,
        fileActive: false,
        survey: { ...prev.survey, surveyActive: !prev.survey.surveyActive }
    }))
    // Check if there is a current takeoff marker
    if (takeOffObject.currentMarker !== null) {

        // Confirm with the user if they want to remove the current plan
        let clearSurveyMission = window.confirm('Are you sure you want to remove current plan and create a new plan?')
        if (clearSurveyMission) {

            // Remove the current takeoff marker
            if (takeOffObject.currentMarker !== null) {
                takeOffObject.currentMarker.remove()
            }

            // Remove all waypoints and their associated paths
            for (let i = 0; i < wayPointsObject.length; i++) {
                const waypoint = wayPointsObject[i];
                waypoint.currentMarker && waypoint.currentMarker.remove()
                mapObject.map && mapObject.map.removeLayer(waypoint.leftSourceId!)
            }

            // Remove the last waypoint's right source layer if any
            if (wayPointsObject.length > 0) {
                mapObject.map && mapObject.map.removeLayer(wayPointsObject[wayPointsObject.length - 1].rightSourceId!)
            }

            // Reset waypoint objects and create new marker instances
            wayPointsObject = []
            takeOffObject = new MarkerClass()
            rTLObject = new MarkerClass()
            removeWayPointEventListener()

            // Reset the plan mission state
            setPlanMission(emptyPlanMissionState)

            // Remove drawing control and layers from the map

            // map.removeControl(mapBoxDraw)
            if (mapObject.map && mapObject.map.getSource('area') !== undefined) {
                mapObject.map.removeLayer('area')
                mapObject.map.removeSource('area')
            }
            return
        }
    }

    // Add drawing control to the map if not already added
    // if (!map.hasControl(mapBoxDraw)) {
    //     map.addControl(mapBoxDraw, 'top-left');
    // }

    if (planMission.survey.surveyActive === false && mapObject.map) {
        // Set up event listeners for drawing changes
        mapObject.map.on('draw.create', addSurvey);
        mapObject.map.on('draw.delete', addSurvey);
        mapObject.map.on('draw.update', addSurvey);
        if (mapObject.map && mapObject.mapBoxDraw) {
            mapObject.map.addControl(mapObject.mapBoxDraw, 'top-left');
        }
    }
    else {
        // Set up event listeners for drawing changes
        if (mapObject.map && mapObject.mapBoxDraw) {
            mapObject.map.off('draw.create', addSurvey);
            mapObject.map.off('draw.delete', addSurvey);
            mapObject.map.off('draw.update', addSurvey);
            mapObject.map.removeControl(mapObject.mapBoxDraw);
        }
    }

}

export const planTakeOff = () => {
    const { planMission, droneStatus, setPlanMission, takeOffObject } = useDroneUtilsContext()
    if (planMission.takeoff.marker === null) {
        const takeOff = newMarker('green', [droneStatus.homePosition.longitude, droneStatus.homePosition.latitude], "<p style='color: black'>Take Off</p>", 'takeoff', undefined, undefined, mapObject.map)
        // setPlanMission((prev) => {
        //     const newState = { ...prev, takeOffCoordinates: [droneStatus.homePosition.longitude, droneStatus.homePosition.latitude, 50], takeOffMarker: takeOff }
        //     return newState
        // })
        setPlanMission((prev) => ({
            ...prev,
            takeoff: { ...prev.takeoff, coordinates: [droneStatus.homePosition.longitude, droneStatus.homePosition.latitude, 50], marker: takeOff }
        }))
        takeOffObject.currentMarker = takeOff
        takeOffObject.leftMarker = null;
        takeOffObject.rightMarker = null;
        takeOffObject.leftSourceId = null;
        takeOffObject.rightSourceId = null
    }
}

export const openFileBox = () => {
    const { setPlanMission } = useDroneUtilsContext()
    setPlanMission((prev) => ({ ...prev, survey: { ...prev.survey, surveyActive: false }, fileActive: !prev.fileActive }))
    // setFileActive(!fileActive)
    console.log("Open")
}

export const toggleWayPoint = () => {
    const { planMission, setPlanMission } = useDroneUtilsContext()
    const { mapObject, roiRef } = useMapContext()

    if (planMission.wayPoint.wayPointActive) {
        removeWayPointEventListener();
    } else {
        addWayPointEventListener();
    }
    // setIsWayPointActive(!isWayPointActive);
    mapObject.map!.off('click', roiRef.current!)
    let active = planMission.roi.roiActive
    if (planMission.roi.start === false) {
        active = false
    }
    setPlanMission((prev) => ({
        ...prev,
        wayPoint: { ...prev.wayPoint, wayPointActive: !prev.wayPoint.wayPointActive },
        roi: { ...prev.roi, roiActive: active }
    }))
}