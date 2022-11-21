import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import AuthContext from '../../store/auth-context';
import ChartBuilder, { IPlotData } from '../chartBuilder/ChartBuilder';

interface Props {
    uuid: string | undefined,
    explanationData: any,
    dialogBox: boolean,
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null,
    openDialog: boolean,
    cleanUpDialog: () => void
}


export interface ITerms {
    subject: string,
    description: string,
    long_description: string,
    synonyms: string[],
    plot_type: string,
}


const TermsExplanation: FC<Props> = ({ uuid, explanationData, dialogBox, socket, openDialog, cleanUpDialog }): React.ReactElement => {

    const ctx = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showGraph, setShowGraph] = useState<boolean>(false);
    const [termBox, setTermBox] = useState<number>(8);
    const [graphBox, setGraphBox] = useState<number>(0);
    const [plotType, setPlotType] = useState<string>('');
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [term, setTerm] = useState<ITerms>();
    const [extractedData, setExtractedData] = useState<IPlotData | IPlotData[]>();


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            console.log(explanationData.TermVisualization.term.subject)
            try {
                setShowGraph(explanationData['TermVisualization']['plot_data'] != null)
                setTerm(explanationData['TermVisualization']['term'])
                setPlotType(explanationData['TermVisualization']['plot_data']['plot_type'])
                if (explanationData['TermVisualization']['plot_data'] != null) {
                    if (explanationData['TermVisualization']['plot_data']['plot_type'] === 'SCATTERPLOT') {
                        setExtractedData(explanationData['TermVisualization'])
                    } else {
                        setExtractedData(explanationData['TermVisualization']['plot_data'])
                    }
                    setGraphBox(8);
                    setTermBox(8);
                    console.log('PLOTTYPE:', explanationData['TermVisualization']['plot_data']['plot_type'])
                }
                setIsLoading(false)
            } catch (error: any) {
                setHasError(true);
                setErrorMessage(error.message);
                console.log('Error:', error.message)
                setIsLoading(false);
            }
        }

        if (explanationData != null) fetchData();
    }, [])


    if (isLoading) {
        return (<div>Waiting for term selection to display explanation...</div>)
    }

    if (!dialogBox) {
        return (
            <>

                <Dialog
                    open={openDialog}
                    onClose={() => { cleanUpDialog() }}
                    fullWidth={true}
                    maxWidth={'xl'}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <h2>{term?.subject}</h2>
                    </DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText id="alert-dialog-description"> */}
                        <div className='riskExplanation'>
                            <div className='termDescription'>{term?.description}</div>
                            {showGraph && term != undefined ?
                                <ChartBuilder
                                    plot_values={extractedData}
                                    term={term}
                                    plot_type={plotType}
                                /> : null}
                        </div>

                        {/* </DialogContentText> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { cleanUpDialog() }}>Close</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }

    return (
        <>
            <h2>{term?.subject}</h2>
            <div className='explanationNoRisk'>
                <div className='termDescription'>{term?.description}</div>
                <div className='termVisualization'>
                    {
                        showGraph && term != undefined ? <ChartBuilder
                            plot_values={extractedData}
                            term={term}
                            plot_type={plotType}
                        /> : null}
                </div>
            </div>
        </>
    )

}

export default TermsExplanation;