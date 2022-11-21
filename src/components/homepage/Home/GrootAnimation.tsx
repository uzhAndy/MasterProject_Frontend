import { Button } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Typewriter from "typewriter-effect";
import URLContext from '../../../store/url-context';
import './GrootAnimation.css';

const useStyles = makeStyles({
  buttoncontainer: {
    textColor: "white",
    justifyContent: "space-around",
    display: 'flex',
    flexDirection: 'row',
    width: '30%',
    marginTop: "80px",
  },
  loginlearn: {
    color: "white",
    borderColor: "white",
    width: "40%",
     
     "&:hover": {
      backgroundColor: "bisque",
      color: "black",
      borderColor: "black",
    },
  }
})

function GrootAnimation(props: {scrollToFooter: (ref: any) => void, reference: any }) {
  const classes = useStyles()
  const navigate = useNavigate()
  const url = useContext(URLContext)


  return (
    <div className='hero-container'>
      <video src='/videos/video-2.mp4' autoPlay loop muted />
      <h1><Typewriter onInit={
        (typewriter) => {
          typewriter
            .typeString("Welcome, I'm Groot")
            .pauseFor(2000)
            .deleteAll()
            .typeString("Let me help with your Finances")
            .start()
        }
      }/></h1>
      <h2>Your AI at the heart of Finance</h2>
      <div className={classes.buttoncontainer}>
        <Button variant="outlined" size="large"  className={classes.loginlearn} onClick={() => {navigate(url.register)}}> Registration</Button>
        <Button variant="outlined" size="large"  className={classes.loginlearn} onClick={() => {navigate(url.login)}}>Login</Button>
      </div>
    </div>
  );
}

export default GrootAnimation;



