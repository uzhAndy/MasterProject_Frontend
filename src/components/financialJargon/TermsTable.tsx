import AddBoxIcon from '@mui/icons-material/AddBox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AuthContext from '../../store/auth-context';
import URLContext, { baseURL } from '../../store/url-context';
import EditButton from '../form/Button/Reroute';

const TERMS_API = `${baseURL}:5000/terms`;


interface IRow {
    tid: number,
    subject: string,
    description: string,
    long_description: string,
    synonyms: string[]
}

function Row(props: { row: IRow }) {
    const { row } = props;
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate()

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: 'white' }}>
                <TableCell>
                    <IconButton
                        aria-label='expand row'
                        size='small'
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component='th' scope='row'>{row.subject}</TableCell>
                <TableCell>{row.synonyms.join('; ')}</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'white' }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='h6' gutterBottom >

                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <EditButton command={() => { navigate(`/editTerm/${row.tid}`) }}>
                                        Edit Term
                                    </EditButton>
                                </Grid>
                            </Grid>
                            <Table size='small' aria-label='client information'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Long Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>{row.long_description}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )

}

interface Props {}
const TermsTable: FC<Props> = (): React.ReactElement => {

    const ctx = useContext(AuthContext);
    const url = useContext(URLContext);
    const navigate = useNavigate();

    const [cursor, setCursor] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [rows, setRows] = useState<IRow[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('');

    const getTermsRequest = {
        method: 'GET',
        'Content-Type': 'application/json',
        'Authorization': ctx.token()
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(TERMS_API, getTermsRequest);
                const result = await response.json();
                if (response.ok) {
                    setRows(result['terms']);
                    setIsLoading(false);
                }
            } catch (error: any) {
                setHasError(true);
                setErrorMessage(error.message);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [])

    const handleAdd = () => {
        navigate(url.addTerm);
    }

    // commented out because it introduces some flickering when loading the page, if necessary, then replace by loading animation (like the one from transcripts overview)
    // if (isLoading) {
    //     return (<div>Loading...</div>)
    // }

    return (
        <div className='container'>
            <div className='contents'>
                <div className='header'>
                    <h1>Terms Overview</h1>
                </div>
                <Table aria-label='collapsible table'>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell><h2>Subject</h2></TableCell>
                            <TableCell><h2>Synonyms</h2></TableCell>
                            <TableCell>
                                <Tooltip title='Add new Financial Term'>
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
                        {rows.map((currRow: IRow) => (
                            <Row key={currRow.tid} row={currRow} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
};

export default TermsTable;