'use client'
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from 'simple-peer'

type SocketContextType = {
    call: { isReceivedCall: boolean, from: any, signal: any, name: string } | undefined
    callAccepted: boolean
    localStream: MediaStream | null
    callEnded: boolean
    myId: string
    callUser: (userId: string) => void
    answerCall: () => void
    leaveCall: () => void
    remoteStream: MediaStream | null
}

const SocketContext = createContext<SocketContextType | null>(null)

const socket = io('https://react-video-website.onrender.com')

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
    const [myId, setMyId] = useState<string>("")
    const [call, setCall] = useState<{ isReceivedCall: boolean, from: any, signal: any, name: string }>()
    const [callAccepted, setCallAccepted] = useState<boolean>(false)
    const [callEnded, setCallEnded] = useState<boolean>(false)
    const connectionRef = useRef<any>(null)
    // const [socket, setSocket] = useState<any>(null);

    console.log(socket.connected)

    useEffect(() => {

        const handleConnected = (data: any) => {
            console.log('Connected event received:', data)
            setMyId(data.socketId)
        }

        const handleCallUser = (data: any) => {
            console.log('Call user event received:', data)
            setCall({ isReceivedCall: true, from: data.from, name: data.name, signal: data.signal })
        }

        // If socket is already connected, set the ID immediately
        if (socket.connected && socket.id) {
            console.log('Socket already connected:', socket.id)
            setMyId(socket.id)
        }

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id)
            if (socket.id) {
                setMyId(socket.id)
            }
        })

        socket.on('connected', handleConnected)
        socket.on('callUser', handleCallUser)

        return () => {
            socket.off('connect')
            socket.off('connected', handleConnected)
            socket.off('callUser', handleCallUser)
        }
    }, [])

    console.log(myId)

    useEffect(() => {
        if (!localStream) {
            navigator.mediaDevices.getUserMedia({
                video: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 360, ideal: 720, max: 1080 },
                    frameRate: { min: 30, ideal: 45, max: 60 },
                },
                audio: true
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
            stream: localStream!
        })
        peer.on('signal', (signal) => {
            socket.emit('answerCall', { signal, to: call!.from })
        })
        peer.on('stream', (stream) => {
            setRemoteStream(stream)
        })
        peer.signal(call!.signal)
        connectionRef!.current = peer
    }

    const callUser = (userId: string) => {
        console.log(myId)
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: localStream!
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
        connectionRef!.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef!.current.destroy()
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