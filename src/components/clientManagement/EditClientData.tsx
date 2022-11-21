import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import countries from '../../shared/data/countries.json';
import currenciesJson from '../../shared/data/currencies.json';
import AuthContext from '../../store/auth-context';
import Button from '../form/Button/Submit';
import CancelButton from '../form/Button/Reroute';
import DatePicker from '../form/Fields/DatePicker';
import SelectField from '../form/Fields/SelectField';
import TextField from '../form/Fields/TextField';
import { ClientType } from './ClientTypes';
import URLContext, { baseURL } from '../../store/url-context';
import { Alert, Box, Grid, Typography } from '@mui/material';

const CLIENTS_API = `${baseURL}:5000/clients`;

const clientTypes = {
    'RETAIL': ClientType.RETAIL,
    'PROFESSIONAL': ClientType.PROFESSIONAL,
    'INSTITUTIONAL': ClientType.INSTITUTIONAL
};

const currencies: { [key: string]: string } = {};

interface Address {
    city: string,
    country: string,
    street: string,
    street_nr: string,
    zip_code: number
}

interface IClient {
    uuid: number,
    AuM: number,
    currency: string,
    address: Address,
    birthdate: any,
    client_type: string,
    email: string,
    nr_of_counseling: number,
    lastname: string,
    firstname: string
}

interface InitialVals {
    firstname: string,
    lastname: string,
    address1: string,
    address2: string,
    zipCode: number,
    city: string,
    email: string,
    country: string,
    clientType: string,
    AuM: number,
    currency: string,
    nrOfCounselings: number,
    birthdate: string
}

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
    nrOfCounselings: Yup.string().required('Required').matches(/^[0-9]+$/, 'Enter a number'),
    birthdate: Yup.date().required('Required')
});

const extractData = (data: IClient): InitialVals => {
    const client: InitialVals = {
        firstname: data.firstname,
        lastname: data.lastname,
        address1: data.address.street,
        address2: data.address.street_nr,
        zipCode: data.address.zip_code,
        city: data.address.city,
        email: data.email,
        country: data.address.country,
        clientType: data.client_type,
        AuM: data.AuM,
        currency: data.currency,
        nrOfCounselings: data.nr_of_counseling,
        birthdate: moment(data['birthdate']).format('YYYY-MM-DD')
    }
    return client;
};

export const EditClientData = (): React.ReactElement => {

    let { clientUUID } = useParams();
    const url = useContext(URLContext);
    const ctx = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [initialValues, setInitialValues] = useState<InitialVals>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const getClientsRequest = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ctx.token()
        }
    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(CLIENTS_API + '?id=' + clientUUID, getClientsRequest);
            const result = await response.json();
            if (response.ok) {
                setInitialValues(extractData(result['clients']));
                setIsLoading(false);
            }
        } catch (error: any) {
            setErrorMessage(error.message);
            setTimeout(() => { setErrorMessage('') }, 6000);
        }
    };

    useEffect(() => {

        currenciesJson.forEach(curr => {
            currencies[curr.code] = curr.name
        });

        fetchData();
    }, []);

    useEffect(() => {
        if (successMessage.length > 0) setTimeout(() => { navigate(-1) }, 3000);
    }, [successMessage]);


    const submitData = async (submitRequest: RequestInit) => {
        try {
            setIsLoading(true);
            const response = await fetch(CLIENTS_API, submitRequest);
            const result = await response.json()
            if (response.ok) {
                setErrorMessage('')
                setIsLoading(false);
                setSuccessMessage(result['message']);
            }
        } catch (error: any) {
            setErrorMessage(error.message);
            setTimeout(() => { setErrorMessage('') }, 6000);
        }
    }


    const handleSubmit = (values: any) => {

        values['uuid'] = clientUUID;

        const submitRequest = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() },
            body: JSON.stringify(values)
        };
        submitData(submitRequest);
        setInitialValues(values);
    }

    if (isLoading) {
        return (<p>Loading...</p>)
    }

    return (
        <div className='container'>
            <div className='contents'>
                <h1>
                    Edit Information for {initialValues?.firstname} {initialValues?.lastname}
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
                            <CancelButton command={() => {navigate(url.clientManagement)}} backgroundColor='#FFFFFF' fontColor='#38288f'>
                                Cancel
                            </CancelButton>
                        </Grid>
                        <Grid item xs={5}>
                            <Button>
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            </Formik>
            {errorMessage.length > 0 ? <Alert
                severity="error" style={{ "margin": "5px" }}>{errorMessage}</Alert> : null}
            {successMessage.length > 0 ? <Alert
                severity="success" style={{ "margin": "5px" }}>{successMessage + ' Returning to overview.'}</Alert> : null}
            </div>
        </div>
    )
}