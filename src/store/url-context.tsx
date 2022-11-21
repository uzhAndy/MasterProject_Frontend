import React from 'react'

export const baseURL = 'http://localhost';

const URLContext = React.createContext({
    login: '',
    register: '',
    home: '',
    accept: '',
    user: '',
    consultation: '',
    consultationBase: '',
    riskForm: '',
    riskFormBase: '',
    clientManagement: '',
    editClient: '',
    editClientBase: '',
    addClient: '',
    editUser: '',
    editUserBase: '',
    addTerm: '',
    editTerm: '',
    termsOverview: '',
    visualization: '',
    transcript: '',
    transcriptBase: '',
})


export default URLContext


export const URLContextManagement = (props: any): any => {
    const contextValue = {
        login: '/login',
        register: '/register',
        home: '/home',
        accept: '/usermanagent',
        user: '/user',
        consultation: '/consultation/:clientUUID',
        consultationBase: '/consultation',
        riskForm: '/riskForm/:clientUUID',
        riskFormBase: '/riskForm',
        clientManagement: '/clients',
        editClient: '/editClient/:clientUUID',
        editClientBase: '/editClient',
        addClient: '/addClient',
        editUser: '/edituser/:uuid',
        editUserBase: '/edituser',
        addTerm: '/addTerm',
        editTerm: '/editTerm/:termID',
        termsOverview: '/terms',
        visualization: '/test1234',
        transcript: '/transcript/:advisorUUID',
        transcriptBase: '/transcript',
    }

    return (<URLContext.Provider value={contextValue}>{props.children}</URLContext.Provider>)
}

