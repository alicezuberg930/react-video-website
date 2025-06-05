import { Box, Paper } from "@mui/material";
import { useSocket } from "./SocketContext";
import { useEffect, useRef } from "react";

export default function VideoPlayer() {
    const { callAccepted, callEnded, localStream, remoteStream } = useSocket()
    const myVideo = useRef()
    const userVideo = useRef()

    useEffect(() => {
        if (myVideo.current) {
            myVideo.current.srcObject = localStream
        }
    }, [myVideo, localStream])

    useEffect(() => {
        if (userVideo.current) {
            userVideo.current.srcObject = remoteStream
        }
    }, [userVideo, remoteStream])

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ padding: 2, border: '1px solid black', margin: 2, aspectRatio: '16/9' }}>
                <video ref={myVideo} playsInline muted autoPlay width='100%' />
            </Paper>

            {callAccepted && !callEnded && (
                <Paper sx={{ padding: 2, border: '1px solid black', margin: 2, aspectRatio: '16/9' }}>
                    <video ref={userVideo} playsInline muted autoPlay width='100%' />
                </Paper>
            )}
        </Box>
    )
}