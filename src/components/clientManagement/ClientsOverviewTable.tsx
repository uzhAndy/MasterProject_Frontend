import { Typography } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import moment from 'moment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/auth-context';
import URLContext, { baseURL } from '../../store/url-context';
import EditButton from '../form/Button/Reroute';
import { useNavigate } from 'react-router';
import OneTimePassword from './GeneratePWD';

const CLIENTS_API = `${baseURL}:5000/clients`;


interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

interface Address {
    city: string,
    country: string,
    street: string,
    street_nr: string,
    zip_code: string
}

interface IRow {
    uuid: number,
    AuM: number,
    address: Address,
    birthdate: Date,
    client_advisor_uuid: number,
    client_type: string,
    currency: string,
    email: string,
    firstname: string,
    lastname: string,
    nr_of_counseling: number,
    portfolio: string
}


function Row(props: { row: IRow }) {
    const { row } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [opendialog, setOpenDialog] = useState<boolean>(false);
    const [sessionID, setSessionID] = useState<string | number>("");
    const ctx = useContext(AuthContext);
    const url = useContext(URLContext);
    const AuMFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: row.currency
    })
    const navigate = useNavigate()

    const handleDialogClick = () => {
        setOpenDialog(!opendialog);
    };


    const getSessionIDAPI = `${baseURL}:5000/consultation_admin/generate_id`
    const getSessionRequest = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', 'Authorization': ctx.token()
        },
    };


    const getSessionID = async () => {
        try {
            const response = await fetch(getSessionIDAPI, getSessionRequest);
            const result = await response.json();
            if (response.ok) {
                setSessionID(result['session_id']);
            }
        } catch (error: any) {
            console.log(error)
        }
    };




    const counselingFormatter = new Intl.NumberFormat('en-US')

    return (
        // <div className='tableRow'>
            <Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor:'white'}}>
                    <TableCell>
                        <IconButton
                            aria-label='expand row'
                            size='small'
                            onClick={() => {
                                setOpen(!open)
                            }}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component='th' scope='row'>
                        {row.firstname + ' ' + row.lastname}
                    </TableCell>
                    <TableCell>{row.client_type}</TableCell>
                    <TableCell>{AuMFormatter.format(row.AuM)}</TableCell>
                    <TableCell>{counselingFormatter.format(row.nr_of_counseling)}</TableCell>

                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout='auto' unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography variant='h6'>
                                            Detailed Information
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <EditButton command={() => {
                                            getSessionID()
                                            handleDialogClick()
                                        }}>
                                            Generate Login
                                        </EditButton>
                                        <div>
                                        <OneTimePassword open={opendialog} handleClick={handleDialogClick}
                                            uuid={row.uuid} sessionID={sessionID}
                                            client={{ firstname: row.firstname, lastname: row.lastname }} /></div>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <EditButton command={() => { navigate(url.editClientBase + "/" + row.uuid) }}>
                                            Edit Client
                                        </EditButton>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <EditButton command={() => { navigate(url.riskFormBase + '/' + row.uuid) }}>
                                            Risk Questionnaire
                                        </EditButton>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <EditButton command={() => { navigate(url.consultationBase + '/' + row.uuid) }}>
                                            Consultation
                                        </EditButton>
                                    </Grid>
                                </Grid>
                                <Table size='small' aria-label='client information'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>E-Mail</TableCell>
                                            <TableCell>Birthdate</TableCell>
                                            <TableCell>Street</TableCell>
                                            <TableCell>Street Number</TableCell>
                                            <TableCell>Zip Code</TableCell>
                                            <TableCell>City</TableCell>
                                            <TableCell>Country</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{moment(row.birthdate).format('DD. MMM YYYY')}</TableCell>
                                            <TableCell>{row.address.street}</TableCell>
                                            <TableCell>{row.address.street_nr}</TableCell>
                                            <TableCell>{row.address.zip_code}</TableCell>
                                            <TableCell>{row.address.city}</TableCell>
                                            <TableCell>{row.address.country}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Fragment>
        // </div>
    )
}

export const ClientsOverviewTable = (): React.ReactElement => {

    const ctx = useContext(AuthContext);
    const url = useContext(URLContext);
    const navigate = useNavigate();

    const getClientsRequest = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() }
    }

    const [cursor, setCursor] = useState('');
    const [rows, setRows] = useState<IRow[]>([]);
    const [opendialog, setOpenDialog] = React.useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<any>('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(CLIENTS_API, getClientsRequest);
                const result = await response.json();
                if (response.ok) {
                    setRows(result['clients']);
                    setIsLoading(false);
                }
            } catch (error: any) {
                setHasError(true);
                setErrorMessage(error.message);
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleAdd = () => {
        navigate(url.addClient);
    }

    const handleDialogClick = () => {
        setOpenDialog(!opendialog);
    };


    if (isLoading) {
        return (<p>Loading...</p>)
    }
    return (
        <div className='contents'>
            <div className='header'>
                <h1>Clients Overview</h1>
            </div>
            <Table aria-label='collapsible table'>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell><h2>Client</h2></TableCell>
                        <TableCell><h2>Client Type</h2></TableCell>
                        <TableCell><h2>Assets under Management</h2></TableCell>
                        <TableCell><h2>Counseling Sessions</h2></TableCell>
                        <TableCell>
                            <Tooltip title='Add new Client'>
                                <AddBoxIcon
                                    fontSize='large'
                                    onClick={() => { handleAdd() }}
                                    onMouseEnter={() => { setCursor('pointer') }}
                                    style={{ cursor: cursor }}
                                />
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.uuid} row={row} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

