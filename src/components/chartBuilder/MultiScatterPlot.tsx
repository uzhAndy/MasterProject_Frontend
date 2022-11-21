import React, { FC } from 'react';
import { IPlotData, IPlotValues } from './ChartBuilder';
import { CreateScatterPlot } from './Scatterplot';

interface Props {
    data: Array<IPlotValues>
}

export const CreateMultiScatterPlot: FC<Props> = ({ data }): React.ReactElement => {

    console.log('PROPS CREATE MULTISCATTERPLOT', data)


    const extractData = (arrEl: IPlotValues) => {
        return (
            <CreateScatterPlot
                data={arrEl.plot_values}
                description={arrEl.description}
                min={arrEl.min}
                max={arrEl.max}
                x_label={arrEl.x_axis_label}
                y_label={arrEl.y_axis_label}
                client_currency={arrEl.client_currency}
            />
            )
    }

    return (
        <>
            {
                data.map(
                    (currPlot: IPlotValues) => {
                        if (Array.isArray(currPlot)) {
                            return (<></>)
                        } else {
                            return (extractData(currPlot))
                        }
                    }
                )
            }
        </>
    )

}
