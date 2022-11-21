import { makeStyles } from '@material-ui/core'
import React from 'react'


const useStyles = makeStyles({
    footerContainer: {
        backgroundColor: 'black',
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%',
      },
})


export default function Footer() {
    const classes = useStyles()

    return (
        <div className={classes.footerContainer}>
            <div style={{ width: "100%", justifyContent: 'space-evenly', display:'flex', flexDirection: 'row',}}>
                <div style={{ color: 'white', fontFamily: 'Arial', width: '25%', margin: "40px"}}>
                    <h3 style={{ textAlign: "center" }}>Who Are We?</h3>
                    <p style={{ lineHeight: "30px", textAlign: 'justify'}}>
                        We are a team of ambitious IT students based in Zurich, Switzerland. We focus on providing intelligent digital assistants for the banking & finance industry.
                    </p>
                </div>
                <div style={{ color: 'white', fontFamily: 'Arial', width: '25%', margin: "40px"}}>
                    <h3 style={{ textAlign: "center" }}>Who Is Groot?</h3>
                    <p style={{ lineHeight: "30px", textAlign: 'justify'}}>
                        Groot is the an artificial intelligence (AI) which assists your financial institution during financial advisory sessions. Groot supports your consultants in by providing relevant numbers and definitions of financial jargon in real time. Groot even personalizes charts and explanations for your clients to make abstract concepts more tangible. There are no commands necessary since Groot uses natural language processing (NLP) to understand what you talk about and show the relevant data visually.
                    </p>
                </div>
                <div style={{ color: 'white', fontFamily: 'Arial', width: '25%', margin: "40px"}}>
                    <h3 style={{ textAlign: "center" }}>Our Vision?</h3>
                    <p style={{ lineHeight: "30px", textAlign: 'justify'}}>
                        We are convinced the future lies in the digital sphere. Therefore, we aim at developing cutting edge artificial intelligence which not only helps your customers, but your employers as well.
                    </p>
                </div>
            </div>
            

           
        </div>
    )
}
