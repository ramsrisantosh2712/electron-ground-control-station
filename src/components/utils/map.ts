import { useDroneUtilsContext } from "@/contexts/DroneStatusContext"
import { useMapContext } from "@/contexts/MapContext"
import { getSocket } from "@/lib/utils"
import { MarkerClass } from "@/types/index.type"
import { GeoJSONSource } from "mapbox-gl";

export const clearUserPosition = () => {
    const { setTakeOffStatus, setDroneStatus, planMission, setPlanMission, setHistoryMissions } = useDroneUtilsContext()

    setTakeOffStatus({ ...takeOffStatus, isActive: false })
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

export const togglePlanAMission = () => {

    const { mapObject } = useMapContext()
    let { takeOffObject, wayPointsObject, roiObject, rTLObject, setPlanMission, emptyPlanMissionState } = useDroneUtilsContext()
    // Clears the user's position
    clearUserPosition()

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
    clearMission()

    // Setting the waypoint planning is not active
    // setIsWayPointActive(false)
}

export function addSurvey(e: any) {
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
    let update = false;

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

const createParallelLines = (polygon) => {
    let parallelLines = []
    let box = turf.bbox(polygon)
    let [minLat, minLon, maxLat, maxLon] = box
    let offSet = planMission.survey.surveyConfig.spacing
    let offSetMetersToLat = metersToLatDegrees(offSet)
    let degrees = planMission.survey.surveyConfig.angle

    let currentForwardLon = minLon
    let currentBackwardLon = minLon
    let i = 0
    let diameterOfArea = turf.lineString([[minLat, maxLon], [maxLat, minLon]])
    diameterOfArea = turf.length(diameterOfArea, { units: "meters" })
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
    let intersectionCoordinates = []

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

export const planSurvey = () => {
    let { takeOffObject, wayPointsObject, rTLObject, emptyPlanMissionState, planMission, setPlanMission } = useDroneUtilsContext()
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