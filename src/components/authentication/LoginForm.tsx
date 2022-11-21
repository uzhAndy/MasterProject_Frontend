import { Box, Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useSetReduxState } from '../../redux/hooks';
import { setUser } from '../../redux/reducers/userReducers';
import { Role } from '../../shared/models/loginform';
import URLContext, { baseURL } from '../../store/url-context';
import Button from '../form/Button/Submit';
import TextField from '../form/Fields/TextField';
import RegisterButton from '../form/Button/Reroute';

const LOGINAPI = `${baseURL}:5000/auth/login`;


const initialValues = {
    username: '',
    password: '',
}


const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().when(
        "username", {
        is: !(/^\d+$/.test("username")),
        then: Yup.string().required('Password is required'),
    }
    )
});

export const LoginForm = (): React.ReactElement => {

    const [errorMessage, setErrorMessage] = useState<string>("")
    const navigate = useNavigate()
    const dispatch = useSetReduxState()
    const url = useContext(URLContext)

    const handleSubmit = (values: any) => {
        const loginRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        };
        
        const fetchData = async () => {
            try {
                console.log('URL:', LOGINAPI)
                const response = await fetch(LOGINAPI, loginRequest);
                const result = await response.json();
                if (response.ok) {
                    const tempUser = result['user']
                    dispatch(setUser({
                        uuid: tempUser['uuid'],
                        username: tempUser['username'],
                        role: tempUser['role']
                    }));
                    localStorage.setItem('access_token', tempUser['access_token']);
                    localStorage.setItem('refresh_token', tempUser['refresh_token']);
                    
                    tempUser['role'] == Role.GUEST ? navigate(url.consultationBase + '/' + tempUser['username']) : navigate(url.clientManagement)
                } else {
                    setErrorMessage(result['message'])
                    setTimeout(() => { setErrorMessage("") }, 4000)
                }
            } catch (error: any) {
                console.log('fetchdata', error)
            }

        }

        fetchData();

    }


    return (
        <div className='LoginForm'>
            <h1 className='LoginHeader'>Welcome to Groot</h1>
            <Formik
                initialValues={{ ...initialValues }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <Grid container m={2} spacing={2} justifyContent='center'>
                        <Grid item xs={10}>
                            <TextField
                                name='username'
                                label='Username'
                                type='string'
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                name='password'
                                label='Password'
                                type='password'
                            />
                        </Grid>
                    </Grid>
                    <Grid container m={2} spacing={2} justifyContent='center'>
                        <Grid item xs={5}>
                            <Button>
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={5}>
                            <RegisterButton command={() => { navigate(url.register) }}>
                                Go to Register
                            </RegisterButton>
                        </Grid>
                    </Grid>
                </Form>

            </Formik>
            {errorMessage.length > 0 ? <Alert
                severity="error" style={{ "margin": "5px" }}>{errorMessage}</Alert> : null}
        </div>
    )
}