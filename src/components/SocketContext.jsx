import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from 'simple-peer'

const SocketContext = createContext()

// const socket = io('http://localhost:4000', { withCredentials: true })
const socket = io('https://comic-api-65sp.onrender.com', { withCredentials: true })

export function SocketProvider({ children }) {
    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [myId, setMyId] = useState("")
    const [call, setCall] = useState({})
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const connectionRef = useRef()

    useEffect(() => {
        socket.on('connected', (data) => setMyId(data.socketId))
        socket.on('callUser', (data) => {
            console.log(data)
            setCall({ isReceivedCall: true, from: data.from, name: data.name, signal: data.signal })
        })
        return () => {
            socket.off('connected', (data) => setMyId(data.socketId))
            socket.off('callUser', (data) => {
                console.log(data)
                setCall({ isReceivedCall: true, from: data.from, name: data.name, signal: data.signal })
            })
        }
    }, [])

    useEffect(() => {
        if (!localStream) {
            navigator.mediaDevices.getUserMedia({
                video: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 360, ideal: 720, max: 1080 },
                    frameRate: { min: 30, ideal: 45, max: 60 },
                }
            }).then((stream) => {
                setLocalStream(stream)
            })
        }
    }, [localStream])

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: localStream
        })
        peer.on('signal', (signal) => {
            socket.emit('answerCall', { signal, to: call.from })
        })
        peer.on('stream', (stream) => {
            setRemoteStream(stream)
        })
        peer.signal(call.signal)
        connectionRef.current = peer
    }

    const callUser = (userId) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: localStream
        })
        peer.on('signal', (signal) => {
            socket.emit('callUser', { signal, from: myId, userToCall: userId, name: `User ${myId}` })
        })
        peer.on('stream', (stream) => {
            setRemoteStream(stream)
        })
        socket.on('callAccepted', (data) => {
            setCallAccepted(true)
            peer.signal(data.signal)
        })
        peer.on('close', () => {
            socket.off('callAccepted')
        })
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    const memoizedValue = {
        call,
        callAccepted,
        localStream,
        callEnded,
        myId,
        callUser,
        answerCall,
        leaveCall,
        remoteStream
    }

    return (
        <SocketContext.Provider value={memoizedValue}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('The children must be put inside the SocketProvider')
    }
    return context
} 