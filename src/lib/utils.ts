import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { io } from "socket.io-client";
import { useDroneUtilsContext } from "@/contexts/DroneStatusContext";

const socket = io("http://localhost:9999/", {
  transports: ['websocket'],
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSocket = () => {
  return socket
}

export const onCloseApp = () => {
  window.ipcRenderer.send('closeApp')
}