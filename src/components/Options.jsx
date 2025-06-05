import { useState } from "react"
import { useSocket } from "./SocketContext"
import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material"
import CopyToClipboard from "react-copy-to-clipboard"

export default function Options({ children }) {
    const { myId, callAccepted, leaveCall, callUser, callEnded } = useSocket()
    const [idToCall, setIdToCall] = useState("")

    return (
        <>
            <Container maxWidth='sm'>
                <Stack alignItems='center' spacing={2}>
                    <Paper elevation={10} sx={{ padding: 2, border: '1px solid grey' }}>
                        <Typography gutterBottom variant="h6">Copy ID để gọi</Typography>
                        <CopyToClipboard text={myId}>
                            <Button variant="contained" color="primary" fullWidth>
                                Copy SocketID của bạn
                            </Button>
                        </CopyToClipboard>
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