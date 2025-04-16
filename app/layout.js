
import "./globals.css";
import SocketContextProvider from "./context/SocketContext";


export default function RootLayout({ children }) {
  return (
      <html 
        className="hydrated"
      >

      <body
        className={` antialiased`}
      >
       <SocketContextProvider>
       {children}
        </SocketContextProvider>
      </body>
      </html>
 
  );
}
