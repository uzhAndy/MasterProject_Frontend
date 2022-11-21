import React from 'react'
import {
    List,
    ListItem,
    ListItemText,
    Dialog, DialogTitle, ListItemAvatar, Avatar
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { blue } from "@mui/material/colors";


function SimpleDialog(props: { onClose: any; selectedMic: any; open: any; mics: Array<{ name: string, ip: string, mic_id: number, port: number }> }) {


    const { onClose, selectedMic, open, mics } = props;

    const handleClose = () => {
        onClose(selectedMic);
    };

    const handleListItemClick = (value: { mic_id: number, name: string }) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Choose your Microphone</DialogTitle>
            <List sx={{ pt: 0 }}>
                {mics.map((mic) => (
                    <ListItem button onClick={() => handleListItemClick({ "mic_id": mic.mic_id, "name": mic.name })} key={mic.mic_id}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <MicIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={mic.name} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

export default SimpleDialog