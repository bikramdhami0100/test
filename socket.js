import {io} from "socket.io-client";
const socket = io(); // replace with your actual server URL

export default socket;

// 'http://localhost:3000',{
//     transports: ['websocket']
// }
