import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import ChartBuilder from '../../../chartBuilder/ChartBuilder'
import { Explanation } from './PropsWindows'
import CancelButton from '../../../form/Button/Back';


const WithRiskForm = (props: Explanation) => {

    useEffect(() => {
        console.log("props in explanation with risk form")
        console.log(props)
        return(() => {
        })
    })

    return(
        <Dialog
            open={props.openExplanationDialog}
            onClose={props.cleanUpDialog}
            fullWidth={true}
            maxWidth={'xl'}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <Typography component={'span'} variant='h6'>{props.term?.subject}</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography component={'span'} variant='body1'>{props.term?.description}</Typography>
                    <br/>
                    <br/>
                    <br/>
                    {props.showGraph && props.term != undefined ?
                        <ChartBuilder
                            plot_values={props.extractedData}
                            term={props.term}
                            plot_type={props.term.plot_type}
                        /> 
                        : null}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <CancelButton comm={props.cleanUpDialog}>Close</CancelButton>
            </DialogActions>
        </Dialog>
    )
}

export default WithRiskForm
