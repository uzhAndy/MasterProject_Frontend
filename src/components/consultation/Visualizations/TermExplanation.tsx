import React, { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import AuthContext from '../../../store/auth-context';
import WithRiskForm from './ExplanationWindows/ExplanationWindowWithRiskForm';
import WithoutRiskForm from './ExplanationWindows/ExplanationWindowWithoutRiskform';

interface Props {
    uuid: string | undefined,
    explanationData: any,
    riskFormShown: boolean,
    openExplanationDialog: boolean,
    cleanUpDialog: () => void,
}



const TermsExplanation: FC<Props> = ({ uuid, explanationData, riskFormShown, openExplanationDialog, cleanUpDialog }): React.ReactElement | null => {

    const ctx = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');


    useEffect(() => {
        console.log("TermExplanation")
    })
    

    const getExtractedData = () => {
        let extractedData = null
        if (explanationData['TermVisualization']['plot_data'] != null) {
            if (explanationData['TermVisualization']['plot_data']['plot_type'] === 'SCATTERPLOT') {
                extractedData = explanationData['TermVisualization']
            } else {
                extractedData = explanationData['TermVisualization']['plot_data']
            }
        return extractedData
        }
    }

    return (
        <>
            {
                explanationData != null ? 
                <>{riskFormShown ?
                        <WithoutRiskForm
                            riskFormShown={riskFormShown}
                            openExplanationDialog={openExplanationDialog}
                            showGraph={explanationData['TermVisualization']['plot_data'] != null}
                            term={explanationData['TermVisualization']['term']}
                            extractedData={getExtractedData()}
                            graphBox={12}
                            termBox={12}
                            setErrorMessage={setErrorMessage}
                            setIsLoading={setIsLoading}
                            cleanUpDialog={cleanUpDialog} />
                        : <WithRiskForm
                            riskFormShown={riskFormShown}
                            openExplanationDialog={openExplanationDialog}
                            showGraph={explanationData['TermVisualization']['plot_data'] != null}
                            term={explanationData['TermVisualization']['term']}
                            extractedData={getExtractedData()}
                            graphBox={12}
                            termBox={12}
                            setErrorMessage={setErrorMessage}
                            setIsLoading={setIsLoading}
                            cleanUpDialog={cleanUpDialog} />
                    }</> 
                : null
            }
        
        </>
        )

}

export default TermsExplanation;



// <ExplanationWindow
//                             riskFormShown={riskFormShown}
//                             openExplanationDialog={openExplanationDialog}
//                             showGraph={explanationData['TermVisualization']['plot_data'] != null}
//                             term={explanationData['TermVisualization']['term']}
//                             extractedData={getExtractedData()}
//                             graphBox={8}
//                             termBox={8}
//                             setErrorMessage={setErrorMessage}
//                             setIsLoading={setIsLoading}
//                             cleanUpDialog={cleanUpDialog} /