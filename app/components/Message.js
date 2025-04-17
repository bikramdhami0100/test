"use client";
import socket from "../../../socket";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

function Room() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const params = useParams();
  const roomId = decodeURIComponent(params?.id[0]);
  const email = decodeURIComponent(params?.id[1]);
  
  const handleSubmitMessage = () => {
    setSenderEmail(email);
    console.log(email,message)
    if (email && message.trim()) {
      socket.emit("message", { roomId, message, senderEmail,receiverEmail });
      setMessages((prev) => [...prev, { message, email:senderEmail }]); // Uncommented line
      setMessage("");
    }
  };

  useEffect(()=>{

  
    socket.on("receivedMessage", (data) => {
      console.log(data,"this is default receivedMessage data");
      // setReceiverEmail(data?.senderEmail);
      // setSenderEmail(data?.receiverEmail)
      setReceiverEmail(data?.senderEmail);
      setSenderEmail(data?.receiverEmail)
      setMessages((prev) => [...prev, data]);
      
    });
    setSenderEmail(email);

    return(()=>{
      socket.off("receivedMessage");
    })
  },[
    socket,
  ]);

  useCallback(()=>{

    
  },[socket])


  useEffect(() => {
    // socket.on("roomJoined", (data) => {
    //   console.log(data, "this is data");
    // });
    console.log("joined")
    socket.on('roomJoined', (data) => {
      console.log(data,"this is data");
  
      console.log('Joined room:', data?.roomId);
      setReceiverEmail(data?.email);
    });
  }, []);

  console.log(receiverEmail,"this is receiver email");

  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-2xl ${
              msg.email === email
                ? "bg-blue-600 text-white self-end ml-auto"
                : " bg-white text-black self-start mr-auto border"
            }`}
          >
            <p className="text-sm">{msg.message}</p>
            <p className="text-[10px] mt-1 ">{msg.email}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-4 border-t fixed bottom-0 w-full">
      <form onSubmit={(e)=>e.preventDefault()}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1  p-2 border rounded-lg mb-[100px]"
        />
        <button
          type="button"
          onClick={handleSubmitMessage}
          className="bg-blue-500  px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
      </div>
    </div>
  );
}

export default Room;
