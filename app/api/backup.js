"use client";
import { useEffect, useRef, useState } from 'react';

export default function VideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef();
  const [offerCreated, setOfferCreated] = useState(false);
  const [answerCreated, setAnswerCreated] = useState(false);

  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Create peer connection
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        pcRef.current = pc;

        // Add local stream to connection
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Setup ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidates = JSON.parse(localStorage.getItem('iceCandidates') || '[]');
            candidates.push(event.candidate);
            localStorage.setItem('iceCandidates', JSON.stringify(candidates));
          }
        };

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Check for existing offers/answers
        const existingOffer = localStorage.getItem('offer');
        const existingAnswer = localStorage.getItem('answer');

        if (existingOffer) {
          handleReceiveOffer(existingOffer);
        } else if (existingAnswer) {
          handleReceiveAnswer(existingAnswer);
        }

        // Listen for storage changes
        window.addEventListener('storage', handleStorageEvent);

      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    setupMedia();

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  const handleStorageEvent = (event) => {
    if (event.key === 'offer') {
      handleReceiveOffer(event.newValue);
    } else if (event.key === 'answer') {
      handleReceiveAnswer(event.newValue);
    } else if (event.key === 'iceCandidates') {
      handleNewICECandidates();
    }
  };

  const handleReceiveOffer = async (offer) => {
    if (!offer || !pcRef.current) return;
    
    await pcRef.current.setRemoteDescription(JSON.parse(offer));
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    
    localStorage.setItem('answer', JSON.stringify(answer));
    setAnswerCreated(true);
  };

  const handleReceiveAnswer = async (answer) => {
    if (!answer || !pcRef.current) return;
    
    await pcRef.current.setRemoteDescription(JSON.parse(answer));
    setOfferCreated(false);
    handleNewICECandidates();
  };

  const handleNewICECandidates = async () => {
    if (!pcRef.current) return;
    
    const candidates = JSON.parse(localStorage.getItem('iceCandidates') || '[]');
    for (const candidate of candidates) {
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createOffer = async () => {
    if (!pcRef.current) return;
    
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    
    localStorage.setItem('offer', JSON.stringify(offer));
    setOfferCreated(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex gap-4 mb-4">
        <button 
          onClick={createOffer} 
          disabled={offerCreated}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Start Call
        </button>
      </div>
      
      <div className="flex gap-4">
        <video 
          ref={localVideoRef} 
          autoPlay 
          muted 
          className="w-1/2 bg-black rounded-lg"
        />
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          className="w-1/2 bg-black rounded-lg"
        />
      </div>
    </div>
  );
}