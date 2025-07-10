import { useCallback, useState } from "react";
import { Box, IconButton, Paper, Stack } from "@mui/material";
import { useSocket } from "./SocketContext";
import { useEffect, useRef } from "react";
import Iconify from "./iconify";
import useResponsive from "../hooks/useResponsive";

export default function VideoPlayer() {
    const { callAccepted, callEnded, localStream, remoteStream, leaveCall } = useSocket()
    const [microphoneOn, setMicrophoneOn] = useState(true)
    const [cameraOn, setCameraOn] = useState(true)
    const myVideo = useRef<HTMLVideoElement>(null)
    const userVideo = useRef<HTMLVideoElement>(null)
    const isDesktop = useResponsive('up', 'lg');
    const isTablet = useResponsive('up', 'sm');
    // const isPhone = useResponsive('up', 'xs');


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

    console.log(localStream ? (localStream.getVideoTracks()) : null)

    const toggleMicrophone = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0]
            audioTrack.enabled = !audioTrack.enabled
            setMicrophoneOn(audioTrack.enabled)
        }
    }, [localStream])

    const toggleCamera = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0]
            videoTrack.enabled = !videoTrack.enabled
            setCameraOn(videoTrack.enabled)
        }
    }, [localStream])

    return (
        <Box position='relative'>
            <Box sx={{
                border: '2px solid #9FF27A',
                borderRadius: '12px',
                overflow: 'hidden',
                width: '100%',
                position: 'relative',
                aspectRatio: '16/9',
                mb: 2
            }}>
                <video
                    ref={myVideo} playsInline muted={!microphoneOn} autoPlay
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Box>

            {callAccepted && !callEnded && (
                <Box position='absolute' top={0} left={0}>
                    <Box sx={{
                        border: '2px solid #534A59',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        aspectRatio: '16/9',
                        width: isDesktop ? '400px' : isTablet ? '200px' : '100px'
                    }}>
                        <video
                            ref={userVideo} playsInline muted autoPlay
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Box>
                </Box>
            )}

            {localStream && (
                <Stack direction='row' mt={2} justifyContent='center' spacing={2}>
                    <IconButton onClick={toggleMicrophone} color="inherit">
                        {microphoneOn ? (
                            <Iconify icon="eva:mic-outline" width={30} />
                        ) : (
                            <Iconify icon="eva:mic-off-outline" width={30} />
                        )}
                    </IconButton>

                    {callAccepted && !callEnded && (
                        <IconButton onClick={leaveCall} color="error">
                            <Iconify icon="eva:phone-call-outline" width={30} />
                        </IconButton>
                    )}

                    <IconButton onClick={toggleCamera} color="inherit">
                        {cameraOn ? (
                            <Iconify icon="lucide:camera" width={30} />
                        ) : (
                            <Iconify icon="lucide:camera-off" width={30} />
                        )}
                    </IconButton>
                </Stack>
            )}
        </Box>
    )
}