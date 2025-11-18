import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useSocket } from "./SocketContext";
import { useEffect, useState } from "react";

export default function Notification() {
    const { answerCall, call, callAccepted } = useSocket()
    const [isOpen, setIsOpen] = useState(false)

    // console.log({ call, callAccepted })

    useEffect(() => {
        if (call?.isReceivedCall && !callAccepted) {
            setIsOpen(true)
        }
    }, [call, callAccepted])

    return (
        <>
            <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle sx={{ pb: 2 }}>Cuộc gọi đến</DialogTitle>

                <DialogContent sx={{ typography: 'body2' }}>Bạn có cuộc gọi đến từ ${call?.name}</DialogContent>

                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={() => {
                            answerCall()
                            setIsOpen(false)
                        }}
                    >
                        Trả lời
                    </Button>
                </DialogActions>
            </Dialog>

            {/* {call.isReceivedCall && !callAccepted && (
                <Stack direction='row' alignItems='center' justifyContent='center' spacing={2}>
                    <Typography variant="h6">{call.name} đang gọi</Typography>
                    <Button variant="contained" color="primary" onClick={answerCall}>
                        Trả lời
                    </Button>
                </Stack>
            )} */}
        </>
    )
}