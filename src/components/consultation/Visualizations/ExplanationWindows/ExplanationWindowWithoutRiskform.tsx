import { Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import ChartBuilder from '../../../chartBuilder/ChartBuilder'
import { Explanation } from './PropsWindows'



const WithoutRiskForm = (props: Explanation) => {

    useEffect(() => {
        console.log("props in explanation without risk form")
        console.log(props)
        return(() => {
        })
    })


    return(
        <Grid container spacing={2} >
            <Grid item xs={props.termBox}>
                <Typography variant='h6'>{props.term?.subject}</Typography>
                <Typography component={'span'} variant='body1'>{props.term?.description}</Typography>
            <br/>
            <br/>
            <br/>
            </Grid>
            {console.log("here comes the props of the chart")}
            {console.log(props)}
            {
                props.showGraph && props.term != undefined ? <Grid item xs={props.graphBox}>
                    <ChartBuilder
                        plot_values={props.extractedData}
                        term={props.term}
                        plot_type={props.term.plot_type}
                    />
                </Grid> : null
            }

        </Grid >
    )
}

export default WithoutRiskForm
