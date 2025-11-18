import React, { useState } from "react"
import { useSocket } from "./SocketContext"
import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material"

export default function Options({ children }: { children: React.ReactNode }) {
    const { myId, callAccepted, leaveCall, callUser, callEnded } = useSocket()
    const [idToCall, setIdToCall] = useState("")

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(myId);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    return (
        <>
            <Container maxWidth='sm'>
                <Stack alignItems='center' spacing={2}>
                    <Paper elevation={10} sx={{ padding: 2, border: '1px solid grey' }}>
                        <Typography gutterBottom variant="h6">Copy ID để gọi</Typography>
                        <Button variant="contained" color="primary" fullWidth onClick={handleCopy}>
                            Copy SocketID của bạn
                        </Button>
                    </Paper>
                    <Paper elevation={10} sx={{ padding: 2, border: '1px solid grey' }}>
                        <Typography gutterBottom variant="h6">Nhập SocketID người bạn muốn gọi</Typography>
                        <TextField label='SocketID người gọi' fullWidth onChange={(e) => setIdToCall(e.target.value)} />
                        {callAccepted && !callEnded ? (
                            <Button variant="contained" color="error" fullWidth onClick={leaveCall}>
                                Kết thúc
                            </Button>
                        ) : (
                            <Button variant="contained" color="secondary" fullWidth onClick={() => callUser(idToCall)}>
                                Gọi
                            </Button>
                        )}
                    </Paper>
                </Stack>

            </Container>

            {children}
        </>
    )
}