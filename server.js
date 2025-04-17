import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  const keyEmailAndSocketIdValue=new Map();
  const keySocketIdAndEmailValue=new Map();

  io.on("connection", (socket) => {
   
      socket.on("joinRoom", ({ roomId, email }) => {
        
        keyEmailAndSocketIdValue.set(email,socket.id);
        keySocketIdAndEmailValue.set(socket.id,email);
        socket.join(roomId);
        console.log(`User ${email} joined room ${roomId}`);
        socket.broadcast.to(roomId).emit("roomJoined", { roomId, email });
        // socket.emit("roomJoined", { roomId, email });
      });
       
      socket.on("offer", ({offer,senderEmail,receiverEmail,roomId}) => {
      //  if not working I use this 
        // const receiverSocketId=  keyEmailAndSocketIdValue.get(receiverEmail);
        // const  senderSocketId=keyEmailAndSocketIdValue.get(senderEmail);
      console.log(offer,senderEmail,receiverEmail,roomId,"this is offer");
        socket.broadcast.to(roomId).emit("sendOffer", {
          offer,
         roomId,
         receiverEmail,
         senderEmail,
        });
      });

      socket.on("answer", ({ answer, roomId,email }) => {
        console.log(answer,"this is answer");
        socket.broadcast.to(roomId).emit("answer", {answer,email,roomId});
      });

      // socket.on("iceCandidate", ({ candidate, roomId,email }) => {
      //   console.log(candidate,"this is candidate");
      //   socket.broadcast.to(roomId).emit("iceCandidate", {candidate,email,roomId});
      // });

      socket.on("message", ({ roomId, message,senderEmail,receiverEmail }) => {
        console.log(`Received message in room ${roomId}: ${message}`); 
        console.log(senderEmail,"this is sender email"); 
        console.log(receiverEmail,"this is receiver email");
        const socketId=  keyEmailAndSocketIdValue.get(senderEmail);
        const receiverSocketId=keyEmailAndSocketIdValue.get(receiverEmail);
        const email=keySocketIdAndEmailValue.get(receiverSocketId);
        console.log(socketId,"this is socket id of sender");
        console.log(receiverSocketId,"this is socket id of receiver");
          socket.broadcast.to(receiverSocketId).emit("receivedMessage", { message, senderEmail,receiverEmail });
      });

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});