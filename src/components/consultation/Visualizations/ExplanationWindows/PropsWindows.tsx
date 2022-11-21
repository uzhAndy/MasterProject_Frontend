import { Dispatch, SetStateAction } from "react"


export interface ITerms {
    subject: string,
    description: string,
    long_description: string,
    synonyms: string[],
    plot_type: string,
}

export interface ExplanationWindowProps {
    riskFormShown: boolean,
    openExplanationDialog: boolean,
    showGraph: any,
    term: ITerms,
    extractedData: any,
    graphBox: number,
    termBox: number
    setErrorMessage: Dispatch<SetStateAction<string>>
    setIsLoading: Dispatch<SetStateAction<boolean>>
    cleanUpDialog: () => void
}


export interface Explanation {
    riskFormShown: boolean,
    openExplanationDialog: boolean
    showGraph: any,
    term: ITerms,
    extractedData: ExtractedData,
    graphBox: number,
    termBox: number
    setErrorMessage: Dispatch<SetStateAction<string>>
    setIsLoading: Dispatch<SetStateAction<boolean>>
    cleanUpDialog: () => void
}



interface ExtractedData {
    maximum_draw_down?: number,
    plot_data: IPlotValues | Array<IPlotValues>,
}

interface IPlotValues{
    description: any,
    plot_type: string,
    min: number,
    max: number,
    plot_values: Record<string, any>[]
    y_axis_label: string,
    x_axis_label: string,
}


