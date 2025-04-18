"use client";
import React, { useContext, useEffect, useState } from 'react'
import JoinRoomForm from './components/JoinRoomForm';
import { useRouter } from 'next/navigation';
import { SocketContext } from './context/SocketContext';

function Home() {

  const {socket}=useContext(SocketContext);
  // console.log(socket)
const [roomId, setRoomId] = useState("");
const [email, setEmail] = useState("");
const router = useRouter();
const handleJoinRoom = (e) => {
    e.preventDefault();
    // Emit the join room event with the room ID and email
    socket.emit('joinRoom', { roomId, email });
    router.push(`/room/${encodeURIComponent(roomId)}/${encodeURIComponent(email)}`);

  };
  useEffect(() => {
      socket.on('connect', () => {
        console.log('Connected to server');
      });
   
    
      return(()=>{
        socket.off('connect');
       
      })
  }, [socket]);

  return (
    <div>
        <JoinRoomForm  roomId={roomId} email={email} setRoomId={setRoomId} setEmail={setEmail} handleJoinRoom={handleJoinRoom}  />
    </div>
  )
}

export default Home