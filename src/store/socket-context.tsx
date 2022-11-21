import React, { useState } from 'react'
import { io, Socket } from 'socket.io-client';
import DefaultEventsMap from 'socket.io/dist/typed-events';
import { number, string } from 'yup/lib/locale';

const SocketContext = React.createContext({
    socket: () => {return io()},
    socketUrl: '',
})


export default SocketContext


export const SocketContextManagement = (props: any): any => {
    const socketUrl = 'http://localhost:5000';
    
    const newSocket = () =>{return(io(socketUrl, {
        transports: ["websocket"],
        query: {
          token: "Bearer " + localStorage.getItem("access_token") as string,
        }
      }))};

    const contextValue = {
        socket: newSocket,
        socketUrl: socketUrl,
    }

    return (<SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>)
}
