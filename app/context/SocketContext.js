"use client"
import { createContext, useContext } from "react";
// import socket from "../../socket";
import {io} from "socket.io-client";
const socket = io("http://localhost:3000"); // replace with your actual server URL


const SocketContext=createContext(null);

const socketContextProvider=({children})=>{
    const useSocket=useContext(SocketContext);
    return(
        <SocketContext.Provider value={{socket,useSocket}}>
            {children}
        </SocketContext.Provider>
    )
}
export default socketContextProvider;