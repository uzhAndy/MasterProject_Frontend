import React, { Fragment, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SubRow, { Session } from './SingleTranscriptRow';


export interface IRow {
    firstname: string,
    lastname: string,
    client_type: string,
    asset: number,
    email: string,
    currency: string,
    nr_of_sessions: number,
    sessions: Session[],
}


function Row(props: { rowClients: IRow, loading: boolean }) {
    const { rowClients, loading } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [rowsSessions, setRowsSessions] = useState<Session[]>([]);
    
    const AuMFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: rowClients.currency
    })

    useEffect(() => {
        // @ts-ignore
        setRowsSessions(rowClients.sessions)
    }, []);

    const counselingFormatter = new Intl.NumberFormat('en-US')

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label='expand row'
                        size='small'
                        onClick={() => {
                            setOpen(!open)}}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component='th' scope='row'>
                    {rowClients.firstname + ' ' + rowClients.lastname}
                </TableCell>
                <TableCell>{rowClients.client_type}</TableCell>
                <TableCell>{AuMFormatter.format(rowClients.asset)}</TableCell>
                <TableCell>{counselingFormatter.format(rowClients.nr_of_sessions)}</TableCell>

            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography variant='h6'>
                                        Client Transcripts
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Table size='small' aria-label='client information'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Advisor</TableCell>
                                        <TableCell>Duration</TableCell>
                                        <TableCell>Sentiment</TableCell>
                                        <TableCell>Certainty</TableCell>
                                        <TableCell>Summary</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {rowsSessions.map((row: Session) => 
                                    <SubRow key={row.session_id} sessions={row}/>
                                )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}

export default Row