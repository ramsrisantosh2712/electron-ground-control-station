export type DroneCamera = {
    camera: {
        image: string,
        isPresent: boolean,
        show: boolean
    },
}

export type DroneConnectionStatus = {
    status: {
        connected: boolean,
        status: string,
        statusColor: string
    },
}

export type DroneMode = {
    mode: {
        mode: number,
        name: string,
    },
}

export type DroneCoordinates = {
    coordinates: {
        latitude: number,
        longitude: number,
        altitude: number,
        relative_alt: number,
        speed_x: number,
        speed_y: number,
        speed_z: number,
        yaw_angle: number
    }
};

export type DroneGpsRawInt = {
    gpsRawInt: {
        fix_type: number | null,
        lat: number | null,
        lon: number | null,
        alt: number | null,
        vel: number | null,
        hdop: number | null,
        vdop: number | null,
        cog: number | null,
        satellites_visible: number | null,
    },
};

export type DroneBattery = {
    battery: {
        percentage: number,
        temperature: number,
        percentageColor: string
    }
};

export type DroneMetrics = {
    metrics: {
        drone: {
            climb: number,
            direction: number,
            speed: number,
            throttle: number
        },
        wind: {
            direction: number,
            speed: number,
        },
    },
};

export type DroneHomePosition = {
    homePosition: {
        latitude: number,
        longitude: number,
        altitude: number
    },
};

export type DroneServoOutputRaw = {
    servoOutputRaw: {
        servo_count: number,
        servo_1: null,
        servo_2: null,
        servo_3: null,
        servo_4: null,
        servo_5: null,
        servo_6: null,
        servo_7: null,
        servo_8: null,
    },
}

export type DroneExtendedSysState = {
    extendedSysState: {
        vtol_state: null,
        landed_state: null
    },
}

export type DroneSensorStatus = {
    droneSensorStatus: {
        gyro: string,
        accelerometer: string,
        magnetometer: string,
        gps: string,
        motors: string,
        proximity: string,
        rc: string,
        arm: string
    },
}

export type DroneErrorStatus = {
    droneErrorStatus: {
        message_type: null,
        message_color: string,
        severity: null,
        text: null,
        id: null,
        chunk_seq: null
    }
};

export type DroneStatusState =
    DroneCamera &
    DroneConnectionStatus &
    DroneMode &
    DroneCoordinates &
    DroneGpsRawInt &
    DroneBattery &
    DroneMetrics &
    DroneHomePosition &
    DroneSensorStatus &
    DroneExtendedSysState &
    DroneSensorStatus &
    DroneErrorStatus &
    DroneServoOutputRaw &
    {

        connectButton: boolean,

        flying: boolean,
        flightDistance: number,
        distanceBetweenHomeDrone: number,
        flightTime: string,


        arm: boolean,
        rtlMode: boolean,
        smartRtlMode: boolean,
        landMode: boolean,

    }

export type PlanMissionState = {

    isActive: boolean,
    missionOpen: string,
    clearMission: boolean,

    initialWayPointAltitude: number,
    savedInitialWayPointAltitude: number,

    reposition: {
        isActive: boolean,
        coordinates: Array<number>,
        altitude: number,
        marker: mapboxgl.Marker | null,
    },

    modifyMission: {
        type: string | null,
        id: number | -1
    },

    takeoff: {
        coordinates: Array<number>,
        marker: mapboxgl.Marker | null,

        modifyTakeoff: {
            marker: mapboxgl.Marker | null
        }
    },

    wayPoint: {
        wayPointActive: boolean,

        coordinates: Array<Array<number | boolean>>,
        markers: Array<mapboxgl.Marker>,
        modifyWaypoint: {
            marker: mapboxgl.Marker | null,
            id: number | -1
        }
    },

    roi: {
        start: boolean,
        startROIIds: Array<number>,
        cancelROIIds: Array<number>,
        roiActive: boolean,
        coordinates: Array<Array<number>>,
        markers: Array<mapboxgl.Marker>,
        roiCount: number,
        roiIndex: Array<Array<number>>,

        modifyRoi: {
            marker: mapboxgl.Marker | null,
            id: number | -1
        }
    },

    survey: {
        surveyActive: boolean,

        surveyRotateWayPoints: boolean,
        // WIP: GET THE TYPE OF SURVEY POLYGON
        surveyPolygon: null,
        markers: Array<mapboxgl.Marker>,
        coordinates: Array<Array<number>>,
        surveyConfig: {
            altitude: number,
            spacing: number,
            angle: number,
        },
    },

    rtl: {
        coordinates: Array<number>,
        marker: mapboxgl.Marker | null,
    },

    fileActive: boolean,

    missionStatistics: {
        distance: number,
        timeTaken: string,
        maxTelemDist: number,
        totalArea: number
    },

    downloadedMission: {
        status: string,
        mission_count: number,
        takeoff: Array<number>,
        waypoint: Array<Array<boolean | number>>,
        roi: Array<Array<number>>,
        roiIndex: Array<Array<number>>,
        rtl: Array<number>
    }
}

export type HistoryMissionState = {
    isActive: boolean,

    selectedMission: {
        id: number | -1,
        map: mapboxgl.Map | null,
        mission_count: number,
        takeoff: Array<number>,
        waypoint: Array<Array<number | boolean>>,
        roi: Array<number>,
        roiIndex: Array<Array<number>>,
        rtl: Array<number>,
        created_on: string,
        filename: string,
    },
    missionCount: number,
    missions: [],
}

export class MarkerClass {
    leftMarker: mapboxgl.Marker | undefined | null;
    rightMarker: mapboxgl.Marker | undefined | null;
    currentMarker: mapboxgl.Marker | undefined | null;
    leftSourceId: string | null;
    rightSourceId: string | null;

    constructor(
        leftMarker: mapboxgl.Marker | undefined | null = null,
        rightMarker: mapboxgl.Marker | undefined | null = null,
        currentMarker: mapboxgl.Marker | undefined | null = null,
        leftSourceId: string | null = null,
        rightSourceId: string | null = null
    ) {
        this.leftMarker = leftMarker;
        this.rightMarker = rightMarker;
        this.currentMarker = currentMarker;
        this.leftSourceId = leftSourceId;
        this.rightSourceId = rightSourceId;
    }
}

export type RepositionStatusState = {
    isActive: boolean,
    altitude: number,
}
