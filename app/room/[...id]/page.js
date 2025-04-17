"use client";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SocketContext } from '../../context/SocketContext';
import { useParams } from 'next/navigation';

function VideoCallingApp() {
  const prams=useParams();
  const roomId=prams?.id[0];
  const email=prams?.id[1];
  const [hasCreatedOffer, setHasCreatedOffer] = useState(false);

  const [receiverEmail, setReceiverEmail] = useState("");
  const [senderEmail,setSenderEmail]=useState("");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const {socket}=useContext(SocketContext);
 
  const createOffer=async(senderEmail,receiverEmail,roomId)=>{
    if(!pcRef.current) return;
    const offer=await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit('offer',{offer,senderEmail,receiverEmail,roomId});
  };


  const createAnser=async(offer,email,roomId)=>{
    if(!pcRef.current) return;
    await pcRef.current.setRemoteDescription(offer);
    const answer=await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    socket.emit('answer',{answer,email,roomId});
  }

  useEffect(()=>{
   

    setSenderEmail(email);
    const setupMedia=async()=>{
      try {
          const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});  
          if(localVideoRef.current){
            localVideoRef.current.srcObject=stream;
          }
         
          const pc=new RTCPeerConnection({
            iceServers:[{urls:'stun:stun.l.google.com:19302'}]
          });
          pcRef.current=pc;

          stream.getTracks().forEach((track)=>{
            pc.addTrack(track,stream);
          })

          pc.onicecandidate=(event)=>{
            if(event.candidate){
              // console.log(event.candidate)
              // socket.emit('iceCandidate',{candidate:event.candidate,roomId,email});
            }
          }



      } catch (error) {
        console.log(error)
      }
    };
    setupMedia();

    socket.on('roomJoined', (data) => {
      console.log(data,"this is data");
      setReceiverEmail(data?.email)
       
      console.log('Joined room:', data?.roomId);
       if(!hasCreatedOffer){
        createOffer(prams?.id[1],data?.email,roomId);
        setHasCreatedOffer(true);
      }
    //  createOffer(prams?.id[1],data?.email,roomId)
    });
   

   socket.on('sendOffer',async(data)=>{
    console.log(data,"this is data");
    
    // createAnser(data?.offer,email,roomId);
   })



  },[socket]);

 

  return (
    <div>
        <div className="flex  justify-between m-10 ">
            <div>
              local video
              <video  ref={localVideoRef} autoPlay muted></video>
            </div>

              <div>
                remote video
                <video ref={remoteVideoRef} autoPlay muted></video>
              </div>
        </div>
    </div>
  )
}

export default VideoCallingApp