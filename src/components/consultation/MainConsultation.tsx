import { makeStyles } from '@mui/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useReduxState, useSetReduxState } from '../../redux/hooks'
import SockContext from '../../store/socket-context';

import Sidebar from './Sidebar';
import { setRiskQuestionnaireCompleted, setSidebarOpen } from '../../redux/reducers/consultReducer';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import TermsExplanation from './Visualizations/TermExplanation';
import { useParams } from 'react-router';
import RiskAssessment from '../riskQuestionaire/RiskAssessment';
import { Grid, Box } from '@mui/material';
import './Consultation.css'
import NavigationSidebar from '../../shared/components/NavigationSidebar';
import { setClientId } from '../../redux/reducers/clientReducers';


const useStyles = makeStyles({
  drawer: {
    marginTop: '50px',
  },
})

const drawerStyle = {
  height: '100%',
  marginTop: '50px',
}

const MainConsultation = () => {
  const [pattern, setPattern] = useState<Array<string>>([])
  const [allKeywords, setAllKeywords] = useState<Array<string>>([])
  const [mics, setMics] = useState<Array<{ name: string, ip: string, mic_id: number, port: number }>>([])
  const [explanationData, setExplanationData] = useState<any>(null);
  const [explanationDialogOpen, setExplanationDialogOpen] = useState(false)
  const [recording, setRecording] = useState<boolean>(false)
  const [selectedMic, setSelectedMic] = React.useState<{ name: string, mic_id: number } | null>(null);
  let user = useReduxState((state) => state.users)
  const consult = useReduxState((state) => state.consult)
  const sockCtx = useContext(SockContext);
  const classes = useStyles()
  const dispatch = useSetReduxState()
  const { clientUUID } = useParams();
  const [ renderRiskQuestionnaire, setRenderRiskQuestionnaire ] = useState<boolean>(false)


  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  //  socket  authentication
  //  https://medium.com/@gitesh.shinde907/how-to-secure-flask-socketio-connection-with-token-6727f0532978
  useEffect(() => {
    dispatch(setRiskQuestionnaireCompleted(false));
    dispatch(setClientId(clientUUID))
    const newSocket = sockCtx.socket()
    console.log(sockCtx.socketUrl)
    newSocket.connect()
    setSocket(newSocket)

    connect(newSocket)
    disconnect(newSocket)

    newSocket.on('error', function (error) {
      console.log(error)
      console.log("There  was  an  error  on  the  server  side  as  a  result  of  a  socket  request  from  the  Frontend")
    })

    initializeSockEvents(newSocket)
    initialize_values(newSocket)

    // dispatch(setExplanationDialogOpen(false))
    // console.log(consult.explanationDialogOpen)

    return () => {
      newSocket.disconnect()
      setSelectedMic(null)
    }

  }, [])

  // useEffect hook to react to a change in risk questionnaire completion
  useEffect(() => {
    broadcastRiskQuestionnaireVisibility(consult.riskQuestionnaireCompleted)
    setRenderRiskQuestionnaire(consult.riskQuestionnaireCompleted)
    setExplanationData(null)
  }, [consult])


  const connect = (newSocket: any) => {
    newSocket.on("connect", () => {
      console.log("connected")
    })
  }

  const disconnect = (newSocket: any) => {
    newSocket.on("disconnect", () => {
      console.log("disconnected")
    })
  }

  const initialize_values = (newSocket: any) => {
    newSocket.emit('initialize', { "user_id": user.uuid, "client_id": clientUUID }, (data: any) => {
    });
  }

  const initializeSockEvents = (newSocket: any) => {
    console.log("initialize  Socket  Events")
    newSocket.on('request_clear_pattern_response', (data: any) => {
      const uniquePatterns = [...Array.from(new Set(data["current_patterns"].reverse()))];
      //  @ts-ignore
      setPattern(uniquePatterns)
      console.log("successfully updated patterns. current patterns:")
      console.log(data["current_patterns"])
    })
    newSocket.on('initialize_response', (data: any) => {
      const uniquePatterns = [...Array.from(new Set(data["current_patterns"].reverse()))];
      //  @ts-ignore
      setPattern(uniquePatterns)
      setAllKeywords(data["all_patterns"])
      const new_mics = JSON.parse(data['all_mics'])
      setMics(new_mics)
    })
    newSocket.on('getVisualization_response', (data: any) => {
      console.log(`Show  active  mode  visualization  of  ${data.TermVisualization.term.subject}  `)
      showVisualization(data)
    })
    newSocket.on('keywordsServerSent', (data: any) => {
      const uniquePatterns = [...Array.from(new Set(data["pattern"].reverse()))];
      //  @ts-ignore
      setPattern(uniquePatterns)
      dispatch(setSidebarOpen(true))

    })
    newSocket.on('start_stop_mic_response', (data: any) => {
      setRecording(data["running"])
    })
    newSocket.on('risk_questionnaire_visibility_response', (data:any) => {
      dispatch(setRiskQuestionnaireCompleted(data))
    })
  }  
  

  const startMicrophone = () => {
    const simulateMic = false
    //  start  socket

    if (!simulateMic) {
      socket?.emit('start_mic',
        {
          "user_id": user.uuid,
          "client_id": clientUUID,
        }, (data: any) => {
        })
    }
  }

  const stopMicrophone = () => {
    socket?.emit('stop_mic', { "user_id": user.uuid, "client_id": clientUUID }, (data: any) => {
    })
  }

  const endSession = () => {
    setRecording(false)
  }

  const requestPattern = (pattern: string, setSelectedTerm: Dispatch<SetStateAction<string>>) => {
    console.log("requesting pattern")
    console.log("client id: " + clientUUID)
    console.log("user id: " + user.uuid)
    if (socket && pattern) {
      socket.emit('request_pattern', { "pattern": [pattern], "client_id": clientUUID, "user_id": user.uuid }, (data: any) => {
        setSelectedTerm("")
      })
    }
  }

  const clearAll = () => {
    if (socket) {
      socket.emit('clear_all', { "client_id": clientUUID }, (data: any) => {
      })
    }
  }

  const broadcastRiskQuestionnaireVisibility = (vis:boolean) => {
    if (socket) {
      socket.emit('risk_questionnaire_visibility', { "client_id": clientUUID, "user_id": user.uuid, "visibility": vis }, (data: any) => {
      })
    }
  }

  const showVisualization = (data: any) => {
    if (!explanationDialogOpen){
      setExplanationData(data)
      setExplanationDialogOpen(true)
    } 
  }

  const cleanUpDialog = () => {
    setExplanationDialogOpen(false)
    setExplanationData(null)
  }

  return (
    <>
    <NavigationSidebar endSession={endSession}>
    <div className='consultationContainer'>
      <Box sx={{ width: '100%', display: 'inline-flex'}} justifyContent={'center'}>
        <Grid xs={6} md={9} lg={8} xl={7} sx={{ width: '100%' }}>
          <TermsExplanation uuid={clientUUID} explanationData={explanationData} 
          riskFormShown={consult.riskQuestionnaireCompleted}
          openExplanationDialog={explanationDialogOpen} cleanUpDialog={cleanUpDialog}
          />
          {consult.riskQuestionnaireCompleted ? null : <RiskAssessment />}
        </Grid>
      </Box>
    </div>
    <SwipeableDrawer
      variant="permanent"
      className={classes.drawer}
      PaperProps={{
        sx: drawerStyle
      }}
      anchor='right'
      open={consult.sidebarOpen}
      onClose={() => { }}
      onOpen={() => { }}
    >
      <Sidebar pattern={pattern} allPatterns={allKeywords}
        startMic={startMicrophone} stopMic={stopMicrophone}
        requestPattern={requestPattern} clearAll={clearAll}
        socket={socket}
        mics={mics} 
        recording={recording}
        setRecording={setRecording}
        selectedMic={selectedMic}
        setSelectedMic={setSelectedMic}/>
    </SwipeableDrawer>
    </NavigationSidebar>
    </>

  )
}

export default MainConsultation;