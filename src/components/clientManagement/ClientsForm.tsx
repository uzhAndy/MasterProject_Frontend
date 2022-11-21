import { Alert, Box, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import countries from '../../shared/data/countries.json';
import currenciesJSON from '../../shared/data/currencies.json';
import AuthContext from '../../store/auth-context';
import Button from '../form/Button/Submit';
import CancelButton from '../form/Button/Back';
import DatePicker from '../form/Fields/DatePicker';
import SelectField from '../form/Fields/SelectField';
import TextField from '../form/Fields/TextField';
import { ClientsOverviewTable } from './ClientsOverviewTable';
import { ClientType } from './ClientTypes';
import URLContext, { baseURL } from '../../store/url-context';
import { useNavigate } from 'react-router';


const CLIENTS_API = `${baseURL}:5000/clients`;

const clientTypes = {
    'RETAIL': ClientType.RETAIL,
    'PROFESSIONAL': ClientType.PROFESSIONAL,
    'INSTITUTIONAL': ClientType.INSTITUTIONAL
}

const currencies: { [key: string]: string } = {}

const initialValues = {
    firstname: '',
    lastname: '',
    address1: '',
    address2: '',
    zipCode: '',
    city: '',
    email: '',
    country: '',
    clientType: '',
    AuM: '',
    currency: '',
    nrOfCounselings: '',
    birthdate: ''
};

const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('Required'),
    lastname: Yup.string().required('Required'),
    address1: Yup.string().required('Required'),
    address2: Yup.string().required('Required'),
    zipCode: Yup.string().required('Required')
        .matches(/^[0-9]+$/, 'Must be only digits').min(4, 'Must be exactly four digits')
        .max(4, 'Must be exactly four digits'),
    city: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    email: Yup.string().email('Enter a valid email').required('Required'),
    clientType: Yup.string().required('Required'),
    AuM: Yup.string().required('Required').matches(/^[0-9]+$/, 'Enter a number'),
    currency: Yup.string().required('Required'),
    nrOfCounselings: Yup.string().required('Required').matches(/^[0-9]+$/, 'Enter a number'),
    birthdate: Yup.date().required('Required')
});

export const ClientsForm = (): React.ReactElement => {

    const ctx = useContext(AuthContext);
    const url = useContext(URLContext);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        currenciesJSON.forEach(curr => {
            currencies[curr.code] = curr.name
        })
    }, [])

    useEffect(() => {
        if (successMessage.length > 0) setTimeout(() => { navigate(-1) }, 3000);
    }, [successMessage]);

    const submitData = async (submitRequest: RequestInit) => {
        try {
            const response = await fetch(CLIENTS_API, submitRequest);
            const result = await response.json();
            if (response.ok) {
                setSuccessMessage(result['message']);
            }

        } catch (error: any) {
            setErrorMessage(error.message);
            setTimeout(() => { setErrorMessage('') }, 6000);
        }
    }

    const handleSubmit = (values: any) => {

        const submitRequest = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() },
            body: JSON.stringify(values)
        };

        submitData(submitRequest);

    }

    return (
        <div className='container'>
            <div className='contents'>
                <h1>
                    Add new Client
                </h1>
                <Formik
                    initialValues={{ ...initialValues }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Grid container mt={2} spacing={2} justifyContent='center'>
                            <Grid item xs={5}>
                                <TextField
                                    name='firstname'
                                    label='First Name'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name='lastname'
                                    label='Last Name'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name='address1'
                                    label='Street'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name='address2'
                                    label='Street Number'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name='zipCode'
                                    label='Zip Code'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name='city'
                                    label='City'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <SelectField
                                    name='country'
                                    label='Country'
                                    options={countries}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name='email'
                                    label='Email'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <SelectField
                                    name='clientType'
                                    label='Client Type'
                                    options={clientTypes}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name='AuM'
                                    label='Assets under Management'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <SelectField
                                    name='currency'
                                    label='Currency'
                                    options={currencies}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name='nrOfCounselings'
                                    label='Number of Counselings'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <DatePicker
                                    name='birthdate'
                                    label='Birth Date'
                                />
                            </Grid>
                            <Grid item xs={5}></Grid>
                        </Grid>
                        <Grid container mt={2} spacing={2} justifyContent='center'>
                            <Grid item xs={5}>
                                <CancelButton >
                                    Cancel
                                </CancelButton>
                            </Grid>
                            <Grid item xs={5}>
                                <Button>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                </Formik>
                {errorMessage.length > 0 ? <Alert
                    severity="error" style={{ "margin": "5px" }}>{errorMessage}</Alert> : null}
                {successMessage.length > 0 ? <Alert
                    severity="success" style={{ "margin": "5px" }}>{successMessage}</Alert> : null}
            </div>
        </div>
    )
}