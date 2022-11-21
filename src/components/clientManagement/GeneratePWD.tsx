import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AuthContext from '../../store/auth-context';
import CustomButton from '../form/Button/Reroute';
import CancelButton from '../form/Button/Back';
import { Box, Snackbar, Alert } from '@mui/material';
import { baseURL } from '../../store/url-context';


interface IOneTimePWD {
    uuid: number,
    handleClick: () => void,
    open: boolean,
    sessionID: string | number,
    client: {firstname: string, lastname: string}
}

const OneTimePassword = (props: IOneTimePWD): React.ReactElement => {
    const [passwordSession, setPasswordSession] = useState<string>("")
    const [validUntil, setValidUntil] = useState<number>(2)
    const [message, setMessage] = useState<string>("")
    const ctx = useContext(AuthContext)
    const [copied, setCopied] = useState<boolean>(false)

    const saveOTLDAPI = `${baseURL}:5000/consultation_admin/save_id`
    const saveOTL = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  'Authorization': ctx.token()
        },
        body: JSON.stringify({
            "session_id": props.sessionID,
            "uuid": props.uuid,
            "password_client": passwordSession,
            "valid_until": validUntil
        })
    };

    const handleChangeTime = (e: { target: { value: string; }; }) => {
        const onlyNums = parseInt(e.target.value);
        if (e.target.value.length < 10 && onlyNums > 0) {
            setValidUntil( onlyNums );
        } 
    }

    const handleClose = () => {
        setValidUntil(2)
        setPasswordSession("")
        props.handleClick()
    }
   
    const saveSession = async () => {
        try {
            const response = await fetch(saveOTLDAPI, saveOTL);
            const result = await response.json();
            if (response.ok) {
                console.log(result['message'])
                copyToClipboard(props.sessionID)
            }
        } catch (error: any) {
            console.log(error)
        }


        handleClose()
    };

    const copyToClipboard = (sessionId:string|number) => {
        if (typeof sessionId === "number") {
            sessionId = sessionId.toString()
        }
        navigator.clipboard.writeText(sessionId);
        setCopied(true)
        console.log("copied")

    }


    return (
        <div>
            <Dialog open={props.open} onClose={() => handleClose()}>
            <DialogTitle>{props.client.firstname+ " " + props.client.lastname}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Create a one time login. A password is not necessary.
                </DialogContentText>
                <DialogContentText>
                    Session ID: {props.sessionID}
                </DialogContentText>
                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> */}
                    {/* <TextField
                        margin="dense"
                        disabled
                        id="session_id"
                        label="Session ID"
                        value={props.sessionID}
                        fullWidth
                        variant="filled"
                    /> */}
                {/* </Box> */}
                <br/>
                <TextField
                    autoFocus
                    margin="dense"
                    id="validitytime"
                    label="How many hours should it be valid?"
                    type="number"
                    fullWidth
                    value={validUntil}
                    variant="standard"
                    onChange={(e) => handleChangeTime(e)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    placeholder='Password (Optional)'
                    helperText='Password (Optional)'
                    type="password"
                    fullWidth
                    variant="standard"
                    value={passwordSession}
                    onChange={(e) => setPasswordSession(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <CancelButton comm={() => handleClose()}>Cancel</CancelButton>
                <CustomButton command={() => saveSession()}>Save and Copy Session ID</CustomButton>
            </DialogActions>
            </Dialog>
            <Snackbar
                open={copied}
                onClose={() => setCopied(false)}
                autoHideDuration={3000}
            >
                <Alert onClose={() => setCopied(false)} severity="success" sx={{ width: '100%' }}>
                    Copied Session ID
                </Alert>
            </Snackbar>
        </div>
    );
}

export default OneTimePassword