import React, { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { makeStyles } from '@mui/styles';
import {
    Typography,
    Box,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    styled,
    Avatar,
} from '@mui/material';
import SimpleDialog from './DialogExplanaition';
import ShowChart from '@mui/icons-material/ShowChart';
import { useReduxState, useSetReduxState } from "../../redux/hooks";
import { blue, green } from "@mui/material/colors";
import { useParams } from "react-router";
import { TransitionGroup } from 'react-transition-group';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import io, { Socket } from 'socket.io-client';
import Button from '../form/Button/Reroute'
import { Role } from '../../shared/models/loginform';

// icons
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ScaleIcon from '@mui/icons-material/Scale';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PublicIcon from '@mui/icons-material/Public';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import PieChartIcon from '@mui/icons-material/PieChart';
import HelpIcon from '@material-ui/icons/Help';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import GrassIcon from '@mui/icons-material/Grass';

import { PersistPartial } from 'redux-persist/es/persistReducer';
import { UserState } from '../../redux/types';
import { baseURL } from '../../store/url-context';


const TERMS_API = `${baseURL}:5000/consultation/`;

const dictForIcon = new Map<string, React.ReactElement>([
    ["cluster risk", <PieChartIcon />],
    ["inflation", <LocalOfferIcon />],
    ["market capitalization", <AccountBalanceIcon />],
    ["bond", <AssuredWorkloadIcon />],
    ["stock", <ShowChart />],
    ["commodity", <OilBarrelIcon />],
    ["crypto currency", <ImportantDevicesIcon />],
    ["hedging", <PriceCheckIcon />],
    ["market risk", <PublicIcon />],
    ["currency risk", <CurrencyExchangeIcon />],
    ["maximum draw down", <TrendingDownIcon />],
    ["risk return profile", <ScaleIcon />],
    ["esg investing", <GrassIcon />],
]);

const getIcon = (term: string) => {
    if (dictForIcon.has(term)) {
        return dictForIcon.get(term);
    } else {
        return <HelpIcon />;
    }
}

interface dataProps {
    startMic: () => void,
    stopMic: () => void,
    requestPattern: (pattern: string, setSelectedTerm: Dispatch<SetStateAction<string>>) => void,
    clearAll: () => void,
    pattern: Array<string>
    allPatterns: Array<string>
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null,
    mics: Array<{ name: string, ip: string, mic_id: number, port: number }>,
    recording: boolean,
    setRecording: Dispatch<SetStateAction<boolean>>
    setSelectedMic: Dispatch<SetStateAction<{ name: string; mic_id: number; } | null>>
    selectedMic: { name: string, mic_id: number } | null
}


// const MicButton = styled(Button)({
//     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//     border: 0,
//     borderRadius: 3,
//     color: 'white',
//     height: 48,
//     margin: 10,
//     width: 230,
// });

// const OrgButton = styled(Button)({
//     width: 110,
//     border: "1px solid black",
//     color: 'black',
//     borderWidth: "3px",
//     borderRadius: 10,
//     "&:hover": {
//         backgroundColor: "bisque",
//     },
// })

// const ChooseMic = styled(Button)({
//     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//     border: 0,
//     borderRadius: 3,
//     color: 'white',
//     height: 48,
//     margin: 10,
//     width: 230,
// });

const useStyles = makeStyles({
    withDiv: {
        width: 230,
        margin: 10,
    },
})


export default function Sidebar(props: dataProps): React.ReactElement {
    const [manuallySelectedTerm, setManuallySelectedTerm] = React.useState('');
    const [selectedText, setSelectedText] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const { clientUUID } = useParams();
    const user = useReduxState((state) => state.users)
    const classes = useStyles()
    const [guestView, setGuestView] = React.useState(false);

    useEffect(() => {
        props.socket?.on('set_mics_response', (data:any) => {
            console.log(data)
            if (data['success']){
                props.setSelectedMic(data['mic']);
            }
          })
    })

    useEffect(() => {
        setGuestView(user.role === Role.GUEST)
    }, [])

    const handleChangeSelect = (event: SelectChangeEvent) => {
        setManuallySelectedTerm(event.target.value as string);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    

    const handleClose = (value: { name: string, mic_id: number }) => {
        setOpen(false);

        props.socket?.emit('set_mics', { "mic_id": value.mic_id, "name": value.name, "client_id": clientUUID }, (data: any) => {
        })
        console.log(value)
    };

    const handleListItemClick = (pattern: string) => {
        props.socket?.emit('getVisualization', { "client_id": clientUUID, "advisor_uuid": user.uuid,
        "role": user.role, "subject": pattern }, (data: any) => {})
    };

    const startWrapper = () => {
        props.startMic()
        props.setRecording(true)
    };

    const stopWrapper = () => {
        props.stopMic()
        props.setRecording(false)
    };


    return (
        <>
        <Typography align='center' sx={{ marginTop: "20px", fontWeight: 'bold' }}>
            Financial Terms I've Heard
        </Typography>
        <Box
            sx={{ marginTop: "10px", width: '100%', height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            role="presentation"
            position='relative'
        >
            <List sx={{ height: "40%", overflow: "auto" }}>
                {/* <TransitionGroup> */}
                {/* uncommenting TransitionGroup results in two errors:
                    1. Warning: Unknown event handler property `onExited`. It will be ignored
                    2. Warning: Received `true` for a non-boolean attribute `in`.
                                If you want to write it to the DOM, pass a string instead: in="true" or in={value.toString()} */}
                {props.pattern.map((text) => (
                    <ListItem sx={{ flexGrow: 1 }}
                        button key={text}
                        onClick={
                            () =>
                                handleListItemClick(text)}
                        selected={selectedText === text}
                    >
                        <ListItemIcon>
                            {getIcon(text)}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
                {/* </TransitionGroup> */}
            </List>

            <Divider />

            {/* request financial term box/container */}
            <Box sx={{ justifyContent: 'space-between' }}>
                <Typography align='center' sx={{ marginTop: "0px", fontWeight: 'bold' }}>
                    Request Financial Term
                </Typography>
                <br/>
                <Select
                    className={classes.withDiv}
                    value={manuallySelectedTerm}
                    label="Terms"
                    onChange={handleChangeSelect}
                >
                    {props.allPatterns.map((pattern, index) => {
                    return (
                        <MenuItem key={pattern} value={pattern as string}>{pattern as string}</MenuItem>
                    )
                    })}
                </Select>

                <div style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
                    <Box sx={{ml:1.3}}>
                        <Button command={() => { props.requestPattern(manuallySelectedTerm, setManuallySelectedTerm) }}>Request</Button>
                    </Box>
                    <Box sx={{mr:1.3}}>
                        <Button command={() => { props.clearAll() }}>Clear All</Button>
                    </Box>
                </div>
            </Box>


            <Divider />

            {/* microphone control box/container */}
            <Box sx={{ justifyContent: 'space-between' }}>
            <Box>
                <Typography align='center' sx={{ marginTop: "0px", fontWeight: 'bold' }}>
                    Microphone Status
                </Typography>
                <br/>
                <SimpleDialog
                    selectedMic={props.selectedMic}
                    open={open}
                    onClose={handleClose}
                    mics={props.mics}
                />
                {props.selectedMic !== null ? (
                    <>
                    {/* microphone start/stop with indicator */}
                    <Box sx={{ display: "flex", justifyContent: 'center', marginBottom: "50px" }}>
                        <Avatar sx={{ 
                            bgcolor: (props.recording) ? green[100] : blue[100], 
                            color: (props.recording) ? green[600] : blue[600], 
                            ml:1.3}}
                        >
                            { (props.recording) ? <MicIcon /> : <MicOffIcon /> }
                        </Avatar>
                        <Box sx={{ml: 1.3, mr:1.3}}>
                            <Button
                                command={ (props.recording) ? stopWrapper : startWrapper }
                            >
                                {(props.recording) ? "Stop Microphone" : "Start Microphone"}
                            </Button>
                        </Box>
                    </Box>
                
                    {/* selected microphone indicator */}
                    {
                        guestView ? null :
                        <>
                            <Typography align='center' sx={{ marginTop: "0px", fontWeight: 'bold' }}>
                                {`Selected microphone: ${props.selectedMic.name}`}
                            </Typography>
                        </>
                    }
                    </>

                    // else render mic selection dialog
                ) : (
                    <>
                    <Box sx={{ marginBottom: "50px"}}>
                    <Typography align="center">
                        No microphone connected.
                    </Typography>
                    { guestView ? null :
                        <Box sx={{ml:1.3, mr:1.3}}>
                            <Button command={handleClickOpen}>
                                Select Microphone
                            </Button>
                        </Box>
                    }
                    </Box>
                    </>
                )
                }
            </Box>
            </Box>

        </Box>
        </>
    )
}
