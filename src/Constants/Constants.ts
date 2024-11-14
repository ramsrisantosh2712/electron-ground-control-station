export const MAV_RESULT = [
  {
    code: "MAV_RESULT_ACCEPTED",
    message: { command: "ACCEPTED", execution: "ACCEPTED", reason: "ACCEPTED" },
  },
  {
    code: "MAV_RESULT_TEMPORARILY_REJECTED",
    message: {
      command: "ACCEPTED",
      execution: "INVALID",
      reason: "Please Retry After Some Time",
    },
  },
  {
    code: "MAV_RESULT_DENIED",
    message: {
      command: "INVALID",
      execution: "INVALID",
      reason: "Invalid Parameters",
    },
  },
  {
    code: "MAV_RESULT_UNSUPPORTED",
    message: { command: "INVALID", execution: "INVALID", reason: "Unknown" },
  },
  {
    code: "MAV_RESULT_FAILED",
    message: {
      command: "ACCEPTED",
      execution: "INVALID",
      reason: "Failed Executing the Request",
    },
  },
  {
    code: "MAV_RESULT_IN_PROGRESS",
    message: {
      command: "ACCEPTED",
      execution: "INPROGRESS",
      reason: "Request Is In Progress",
    },
  },
  {
    code: "MAV_RESULT_CANCELLED",
    message: { command: "INVALID", execution: "INVALID", reason: "NO ACTION" },
  },
  {
    code: "MAV_RESULT_COMMAND_LONG_ONLY",
    message: {
      command: "INVALID",
      execution: "INVALID",
      reason: "Use COMMAND_LONG Request",
    },
  },
  {
    code: "MAV_RESULT_COMMAND_INT_ONLY",
    message: {
      command: "INVALID",
      execution: "INVALID",
      reason: "Use COMMAND_INT Request",
    },
  },
  {
    code: "MAV_RESULT_COMMAND_UNSUPPORTED_MAV_FRAME",
    message: {
      command: "INVALID",
      execution: "INVALID",
      reason: "A frame is required and the specified frame is not supported.",
    },
  },
];

export const MODE_ARRAY = [
  { mode_id: 0, name: "STABILIZE" },
  { mode_id: 1, name: "ACRO" },
  { mode_id: 2, name: "ALT HOLD" },
  { mode_id: 3, name: "AUTO" },
  { mode_id: 4, name: "GUIDED" },
  { mode_id: 5, name: "LOITER" },
  { mode_id: 6, name: "RTL" },
  { mode_id: 7, name: "CIRCLE" },
  { mode_id: 9, name: "LAND" },
  { mode_id: 11, name: "DRIFT" },
  { mode_id: 14, name: "FLIP" },
  { mode_id: 15, name: "AUTOTUNE" },
  { mode_id: 16, name: "POSHOLD" },
  { mode_id: 17, name: "BRAKE" },
  { mode_id: 18, name: "THROW" },
  { mode_id: 19, name: "AVOID ADSB" },
  { mode_id: 20, name: "GUIDED NOGPS" },
  { mode_id: 21, name: "SMART RTL" },
  { mode_id: 22, name: "FLOWHOLD" },
  { mode_id: 23, name: "FOLLOW" },
  { mode_id: 24, name: "ZIGZAG" },
  { mode_id: 25, name: "SYSTEM ID" },
  { mode_id: 27, name: "AUTO RTL" },
];

export const MODE_OBJECT = {
  0: "STABILIZE",
  1: "ACRO",
  2: "ALT HOLD",
  3: "AUTO",
  4: "GUIDED",
  5: "LOITER",
  6: "RTL",
  7: "CIRCLE",
  9: "LAND",
  11: "DRIFT",
  14: "FLIP",
  15: "AUTOTUNE",
  16: "POSHOLD",
  17: "BRAKE",
  18: "THROW",
  19: "AVOID ADSB",
  20: "GUIDED NOGPS",
  21: "SMART RTL",
  22: "FLOWHOLD",
  23: "FOLLOW",
  24: "ZIGZAG",
  25: "SYSTEM ID",
  27: "AUTO RTL",
};

export const GPS_FIX_TYPE = [
  {
    name: "GPS_FIX_TYPE_NO_GPS",
    detail: "No GPS connected"
  },
  {
    name: "GPS_FIX_TYPE_NO_FIX",
    detail: "No position information, GPS is connected"
  },
  {
    name: "GPS_FIX_TYPE_2D_FIX",
    detail: "2D position"
  },
  {
    name: "GPS_FIX_TYPE_3D_FIX",
    detail: "3D position"
  },
  {
    name: "GPS_FIX_TYPE_DGPS",
    detail: "DGPS/SBAS aided 3D position"
  },
  {
    name: "GPS_FIX_TYPE_RTK_FLOAT",
    detail: "3D RTL GPS Lock (float)"
  },
  {
    name: "GPS_FIX_TYPE_RTK_FIXED",
    detail: "3D RTL GPS Lock (fixed)"
  },
  {
    name: "GPS_FIX_TYPE_STATIC",
    detail: "Static Fixed"
  },
  {
    name: "GPS_FIX_TYPE_PPP",
    detail: "PPP, 3D position"
  }
]
