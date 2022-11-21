import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { TableCell, TableRow } from '@mui/material';
import URLContext from '../../store/url-context';
import EditButton from '../form/Button/Reroute';
import { useNavigate } from 'react-router';
import MyDocument, { Summary } from './DocumentSummary/pdf';
import { PDFDownloadLink} from '@react-pdf/renderer';



export interface Session {
    session_id: number
    date: Date,
    advisor: string,
    duration: number,
    sentiment: string,
    sentiment_quality: number,
    transcript: string,
    summary: Summary[],
}

const pathFile = `%PUBLIC_URL%/transcriptPDF.pdf`

function SubRow(props: { sessions: Session}) {
    const { sessions } = props;
    const [time, setTime] = useState('')

    useEffect(() => {
        const date = new Date(sessions.date)
        const time_format = `${date.getHours()-2}:${date.getMinutes()}`
        setTime(time_format)
    })

    return (
        <TableRow>
            <TableCell>{moment(sessions.date).format('DD. MMM YYYY')}</TableCell>
            <TableCell>{time}</TableCell>
            <TableCell>{sessions.advisor}</TableCell>
            <TableCell>{Math.round(sessions.duration)} min</TableCell>
            <TableCell>{sessions.sentiment}</TableCell>
            <TableCell>{`${Math.round(sessions.sentiment_quality*10000)/100}%`}</TableCell>
            <TableCell>
            <PDFDownloadLink document={<MyDocument summary={sessions.summary} 
                transcript={sessions.sentiment}
                sentimentQuality={sessions.sentiment_quality}
                sentiment={sessions.sentiment}
                />}
             fileName={"Transcript"}> 
                <EditButton command={() => {}}>
                    Download Summary
                </EditButton>
            </PDFDownloadLink> 
            </TableCell>

        </TableRow>
    )
}

export default SubRow