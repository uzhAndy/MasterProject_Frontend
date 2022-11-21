import React, { FC, useEffect } from "react";
import { ITerms } from "../consultation/TermExplanation";
import { CreateCompositeScatterPlot } from "./CompositeScatterplot";
import { CreateMultiScatterPlot } from "./MultiScatterPlot";
import { CreateScatterPlot } from "./Scatterplot";


interface Props {
    plot_values: IPlotData | any,
    term: ITerms,
    plot_type: string
}

export interface IPlotData {
    maximum_draw_down?: number,
    plot_data: IPlotValues | Array<IPlotValues>,
}

export interface IPlotValues {
    description: any,
    plot_type: string,
    min: number,
    max: number,
    plot_values: Record<string, any>[]
    data_keys?: string[],
    y_axis_label: string,
    x_axis_label: string,
    client_currency: string,
}

const ChartBuilder: FC<Props> = ({ plot_values, plot_type }): React.ReactElement => {
    console.log('CHARTBUILDER PLOT_VALUES', plot_values)

    if (plot_values === undefined) {
        return (<></>)
    }
    else if (plot_type === 'COMPOSITE_SCATTERPLOT') {
        return (
            <div className='termPlot'>
                <CreateCompositeScatterPlot
                    data={plot_values.plot_values}
                    description={plot_values.description}
                    min={plot_values.min} max={plot_values.max}
                    x_label={plot_values.x_axis_label} y_label={plot_values.y_axis_label}
                    data_keys={plot_values.data_keys}
                    client_currency={plot_values.client_currency}
                />
            </div>
        )
    }else if (plot_type === 'SCATTERPLOT'){
        return (
            <div className='termPlot'>
                <CreateScatterPlot
                    data={plot_values.plot_data.plot_values}
                    description={plot_values.plot_data.description}
                    min={plot_values.plot_data.min} max={plot_values.plot_data.max}
                    x_label={plot_values.plot_data.x_axis_label} y_label={plot_values.plot_data.y_axis_label}
                    client_currency={plot_values.plot_data.client_currency}
                />
            </div>
        )
    }

    else if (Array.isArray(plot_values)) {
        return (
            <div className='termPlot'>
                <CreateMultiScatterPlot
                    data={plot_values}
                />
            </div>
        )
    } else {
        return(<>adsf</>)
    }
}

export default ChartBuilder;