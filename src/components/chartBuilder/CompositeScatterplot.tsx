import React, { FC, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cleanYLabel, cleanXLabel, roundToNearestRoundNumber } from "./HelperFunctions"

interface Props {
    data: Record<any, any>[],
    description: string,
    data_keys: string[],
    min: number,
    max: number,
    x_label: string,
    y_label: string,
    client_currency: string
}

export const CreateCompositeScatterPlot: FC<Props> = ({ data, data_keys, description, min, max, x_label, y_label, client_currency }): React.ReactElement => {

    useEffect(() => {
        console.log('COMPOSITE SCATTER PLOT', data_keys)
    }, [])

    const y_label_display = cleanYLabel(y_label, client_currency)
    const x_label_display = cleanXLabel(x_label)

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <div style={{ height: "300px" }}>
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey={x_label} 
                                label={{value: x_label_display, position: "bottom"}}
                            />
                            <YAxis 
                                type='number' 
                                // domain={[Math.round(min * 0.9), Math.round(max * 1.05)]} 
                                domain={[roundToNearestRoundNumber(min, false), roundToNearestRoundNumber(max, true)]} 
                                label={{value: y_label_display, position: "left", angle: -90 }} 
                            />
                            <Tooltip 
                                // round to 2 digits
                                formatter={(value:any, name:any, props:any) => [`${Math.round(value*100)/100}`, y_label_display]}
                            />
                            <Legend verticalAlign='top'/>
                            <Line
                                type="monotone"
                                dataKey={data_keys[0]}
                                // stroke="#8884d8"
                                // stroke="#e5900dcc" // orange
                                stroke="#2e9934cc" // green
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey={data_keys[1]}
                                stroke="#8324d8"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Grid>
            <Grid item xs={4}>
                <Typography component={'span'}>
                    {JSON.stringify(description)}
                </Typography>
            </Grid>
        </Grid>
    )
}