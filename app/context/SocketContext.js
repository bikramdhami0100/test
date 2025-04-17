"use client"
import { createContext, useContext } from "react";
// import socket from "../../socket";
import {io} from "socket.io-client";
const socket = io(); // replace with your actual server URL
export const SocketContext=createContext(null);

const socketContextProvider=({children})=>{
    // const useSocket=useContext(SocketContext);
    return(
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}
export default socketContextProvider;