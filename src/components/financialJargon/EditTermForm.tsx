import { Alert, Autocomplete, Box, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import AuthContext from '../../store/auth-context';
import URLContext, { baseURL } from '../../store/url-context';
import CancelButton from '../form/Button/Back';
import SubmitButton from '../form/Button/Submit';
import MultiLineTextField from '../form/Fields/MuliLineTextField';
import TextField from '../form/Fields/TextField';

interface Props {

}

const FINANCIAL_TERMS_API = `${baseURL}:5000/terms`;

interface InitialVals {
    subject: string,
    description: string,
    long_description: string,
    synonyms: string[]
}

const validationSchema = Yup.object().shape({
    subject: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    long_description: Yup.string().required('Required'),
});

const EditTermForm: FC<Props> = (): React.ReactElement => {

    let { termID } = useParams();
    const url = useContext(URLContext);
    const ctx = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [initialValues, setInitialValues] = useState<InitialVals>();
    const [synonyms, setSynonyms] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const getTermsRequest = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ctx.token()
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch(FINANCIAL_TERMS_API + '?id=' + termID, getTermsRequest);
            const result = await response.json();
            if (response.ok) {
                setInitialValues(result['terms']);
                const synonyms = result['terms']['synonyms'];
                if (synonyms != '') setSynonyms(synonyms);
                setIsLoading(false);

            }
        } catch (error: any) {
            setErrorMessage(error.message);
            setTimeout(() => { setErrorMessage('') }, 6000);
        }

    };


    const submitData = async (submitRequest: RequestInit) => {
        try {
            setIsLoading(true);
            const response = await fetch(FINANCIAL_TERMS_API, submitRequest);
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
    useEffect(() => {
        setErrorMessage('');
        setSuccessMessage('');
        fetchData();
    }, []);

    useEffect(() => {
        if (successMessage.length > 0) setTimeout(() => { navigate(-1) }, 3000);
    }, [successMessage]);

    const handleSubmit = (values: any) => {
        setInitialValues(values);
        setSynonyms(values['synonyms'])
        const submitRequest = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ctx.token()
            },
            body: JSON.stringify(values)
        };

        submitData(submitRequest);
    };

    if (isLoading) {
        return (<p>Loading...</p>)
    }

    return (

        <Box m={2} pt={3}>
            <Typography variant='h4'>
                Add new Term Explanation
            </Typography>
            <Formik
                initialValues={{ ...initialValues }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name='subject'
                                    label='Subject'
                                    type='string'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MultiLineTextField
                                    name='description'
                                    label='Brief Description'
                                    nrRows={3}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MultiLineTextField
                                    name='long_description'
                                    label='Detailed Description'
                                    nrRows={6}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple={true}
                                    options={[]}
                                    freeSolo
                                    defaultValue={synonyms}
                                    onChange={(e, value) => setFieldValue('synonyms', value || "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name='synonyms'
                                            label='Synonyms (press "Enter" to add synonym)'
                                            type='string'
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container mt={2} spacing={2}>
                            <Grid item xs={3}>
                                <SubmitButton>
                                    Submit
                                </SubmitButton>
                            </Grid>
                            <Grid item xs={3}>
                                <CancelButton>
                                    Cancel
                                </CancelButton>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
            {errorMessage.length > 0 ? <Alert
                severity="error" style={{ "margin": "5px" }}>{errorMessage}</Alert> : null}
            {successMessage.length > 0 ? <Alert
                severity="success" style={{ "margin": "5px" }}>{successMessage}</Alert> : null}
        </Box>
    )
};

export default EditTermForm;