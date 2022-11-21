import { Alert, Box, Grid } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useSetReduxState } from '../../redux/hooks';
import { Role } from '../../shared/models/loginform';
import URLContext, { baseURL } from '../../store/url-context';
import LoginButton from '../form/Button/Reroute';
import Button from '../form/Button/Submit';
import SelectField from '../form/Fields/SelectField';
import TextField from '../form/Fields/TextField';


const REGISTERAPI = `${baseURL}:5000/auth/register`;

const initialValues = {
    username: '',
    password: '',
    passwordConfirmation: '',
    role: Role.ADVISOR
}

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    passwordConfirmation: Yup.string().required('Password is required').oneOf([Yup.ref('password')], 'Passwords do not match.'),
});

export const RegisterForm = (): React.ReactElement => {

    const [errorMessage, setErrorMessage] = useState<string>("")
    const navigate = useNavigate()
    const dispatch = useSetReduxState()
    const url = useContext(URLContext)
    
    const handleSubmit = (values: any) => {
        
        const registerRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        };
        
        
        const fetchData = async () => {
            try{
                const response = await fetch(REGISTERAPI, registerRequest);
                const result = await response.json();
                if(response.ok){
                    navigate(url.clientManagement);
                }
            } catch(error:any){
                setErrorMessage(errorMessage);
                setTimeout(() => {setErrorMessage("")}, 4000)
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
                            <Grid item xs={10}>
                                <TextField
                                    name='passwordConfirmation'
                                    label='Password Confirmation'
                                    type='password'
                                />
                            </Grid>
                        </Grid>
                        <Grid container m={2} spacing={2} justifyContent='center'>
                            <Grid item xs={5}>
                                <Button>
                                    Register
                                </Button>
                            </Grid>
                            <Grid item xs={5}>
                                <LoginButton command={() => {navigate(url.login)}}>
                                    Go to Login
                                </LoginButton>
                            </Grid>
                        </Grid>
                    </Form>

                </Formik>
            {errorMessage.length > 0 ? <Alert
                severity="error" style={{ "margin": "5px" }}>{errorMessage}</Alert> : null}
        </div>
    )
}