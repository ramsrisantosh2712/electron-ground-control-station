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

