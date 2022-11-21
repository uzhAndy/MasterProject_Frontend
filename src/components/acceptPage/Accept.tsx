import { Avatar, Card, CardActionArea, CardContent, Checkbox, FormControl, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, MenuItem, Select, SelectChangeEvent, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StringSchema } from 'yup';
import { Role } from '../../shared/models/loginform';
import { User } from '../../shared/models/UserModel';
import AuthContext from '../../store/auth-context';
import URLContext, { baseURL } from '../../store/url-context';
import EditButton from '../form/Button/Reroute';
import AccountBoxIcon from '@mui/icons-material/AccountBox';


const GET_USERS_REQEUST_API: string = `${baseURL}:5000/users`;
const ACCEPT_USER_API: string = `${baseURL}:5000/auth/accept`;
const GET_ENGINES_API: string = `${baseURL}:5000/auth/engine`;
const PUT_ENGINES_API: string = `${baseURL}:5000/auth/engine`;

interface IUser {
    accepted: boolean,
    microphones: string,
    role: string,
    username: StringSchema,
    uuid: number
}

export default function Accept() {
    const navigate = useNavigate()
    const url = useContext(URLContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [engine, setEngine] = useState('')
    const [engines, setEngines] = useState([])
    const ctx = useContext(AuthContext)

    const getUsersRequest = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() },
    };
    const getEngineRequest = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() },
    };

    const fetchData = async () => {
        try {
            const response = await fetch(GET_USERS_REQEUST_API, getUsersRequest);
            const result = await response.json();
            if (response.ok) {
                setUsers(result['users']);
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const fetchEngines = async () => {
        try {
            const response = await fetch(GET_ENGINES_API, getEngineRequest);
            const result = await response.json();
            if (response.ok) {
                setEngine(result['selected']);
                setEngines(result['selection']);
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const submitData = async (acceptUserRequest: RequestInit, userCopy: IUser[], userIndex: number) => {
        try {
            const response = await fetch(ACCEPT_USER_API, acceptUserRequest);
            if (response.ok) {
                userCopy[userIndex] = {
                    ...userCopy[userIndex],
                    accepted: !users[userIndex].accepted
                };
                setUsers(userCopy);

            }
        } catch (error: any) {
            console.log(error.message)
        }
    };

    const submitEngine = async (putEngine: RequestInit) => {
        try {
            const response = await fetch(PUT_ENGINES_API, putEngine);
            const result = await response.json();
            if (response.ok) {
                setEngine(result['current_engine'])
            }
        } catch (error: any) {
            console.log(error.message)
        }
    };

    useEffect(() => {
        fetchData();
        fetchEngines()
    }, [])

    const handleToggle = (uuid_checked: number) => {

        let userIndex = users.findIndex(u => u.uuid == uuid_checked)
        let userCopy = [...users]

        const acceptUserRequest = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() },
            body: JSON.stringify(
                users[userIndex]
            )
        };

        submitData(acceptUserRequest, userCopy, userIndex);
    };


    const handleChange = (e: SelectChangeEvent) => {
        console.log(e)
        const new_engine = e.target.value as string
        console.log(new_engine)
        const updateEngine = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() },
            body: JSON.stringify({
                'new_engine': new_engine,
            })
        };

        submitEngine(updateEngine)
    }


    return (
        <div className='container'>
            <div className='contents'>
                <h1 className='AcceptHeader'>User Management</h1>
                <Box sx={{ maxWidth: 'auto', marginBottom: '2%' }}>
                <CardActionArea>
                    <Typography gutterBottom variant="h5" component="div">
                        Global Settings
                    </Typography>
                    <CardContent>
                    <div>
                    <Typography variant="body2" color="text.secondary">
                        
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Speech to Text Engine</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={engine}
                            label="speech_to_text_engine"
                            onChange={handleChange}
                        >
                            {
                                engines.map((e) => {
                                    return <MenuItem key={e} value={e}>{e}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <div style={{  display: "flex", flexDirection: "row", marginTop: "10px" }}>
                    <Typography sx={{ width: "70%" }}>Download microphone/NLP module source code:</Typography>
                    <a style={{width: "30%"}} href={process.env.PUBLIC_URL + 'NLP/NLP.zip'} download="Microphone">
                        <EditButton command={() => {}}>Download</EditButton>
                    </a>
                    </div>
                    </div>
                    </CardContent>
                </CardActionArea>
                </Box>
                <Typography gutterBottom variant="h5" component="div">
                    Tick to grant access to users
                </Typography>
                <List dense >
                    {/* <ListSubheader sx={{ selfAlign: "top", textAlign: "center", fontWeight: 'bold' }}>{`Click to accept a user`}</ListSubheader> */}
                    {users.map((user: IUser) => {
                        const labelId = `${user.uuid}`;
                        return (
                            <ListItem
                                key={user.uuid}
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        onChange={() => handleToggle(user.uuid)}
                                        checked={user.accepted}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                        disabled={user.role === Role.ADMIN}
                                    />
                                }
                                disablePadding
                            >
                                <ListItemButton 
                                    onClick={() => handleToggle(user.uuid)}
                                    disabled={user.role === Role.ADMIN}
                                    >
                                    <ListItemAvatar>
                                        <AccountBoxIcon fontSize='large'/>
                                    </ListItemAvatar>
                                    <ListItemText id={labelId} primary={`${user.username}`} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        </div>
    )
}
