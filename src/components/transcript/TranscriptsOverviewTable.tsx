import { Typography } from '@mui/material';
import { Box, Collapse, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/auth-context';
import Row, { IRow } from './TranscriptRows';
import { Audio } from 'react-loader-spinner'
import { baseURL } from '../../store/url-context';

const STATISTICS_API = `${baseURL}:5000/statistics`;



export const TranscriptsOverviewTable = (): React.ReactElement => {

    const ctx = useContext(AuthContext);

    const getTranscript = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() }
    }

    const [rows, setRows] = useState<IRow[]>([]);
    const [errorMessage, setErrorMessage] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await fetch(STATISTICS_API, getTranscript);
                const result = await response.json();
                // const result = mock_result
                if (response.ok) {
                    console.log(result)
                    setLoading(false)
                    // @ts-ignore
                    setRows(result['stats']);
                }
            } catch (error: any) {
                setErrorMessage(error.message);
            }
        }
        fetchData();
    }, []);


    return (
        <div className='container'>
            <div className='contents'>
                <div className='header'>
                    <h1>Transcripts Overview</h1>
                </div>
                {loading ?
                    <div style={{
                        'margin': 'auto',
                        'width': '10%',
                        'verticalAlign': 'middle',
                        'height': '100vh'
                    }}>
                        <h2>Loading...</h2>
                        <Audio
                            height="100"
                            width="100"
                            color='grey'
                            ariaLabel='loading'
                        />
                    </div> :
                    // <TableContainer component={Paper}>
                    <>
                        <Table aria-label='collapsible table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell><h2>Client</h2></TableCell>
                                    <TableCell><h2>Client Type</h2></TableCell>
                                    <TableCell><h2>Assets under Management</h2></TableCell>
                                    <TableCell><h2>Number of Transcripts</h2></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row: IRow) =>
                                    <Row key={row.email} rowClients={row} loading={loading} />
                                )}
                            </TableBody>
                        </Table>
                    </>
                    // </TableContainer>}
                    }

            </div>
        </div>
    );
}
