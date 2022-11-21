import { Alert, Autocomplete, Box, Chip, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
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

const initialValues = {
    subject: '',
    description: '',
    long_description: '',
    synonyms: {}
}

const validationSchema = Yup.object().shape({
    subject: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    long_description: Yup.string().required('Required'),
});



const TermForm: FC<Props> = (props): React.ReactElement => {

    const ctx = useContext(AuthContext);
    const url = useContext(URLContext);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (successMessage.length > 0) setTimeout(() => { navigate(-1) }, 3000);
        setIsLoading(false);
        }, [successMessage]);

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

    const handleSubmit = (values: any) => {
        console.log('submitting:', values);

        const submitRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ctx.token()
            },
            body: JSON.stringify(values)
        };

        submitData(submitRequest);
    };

    // commented out because it introduces some flickering when loading the page, if necessary, then replace by loading animation (like the one from transcripts overview)
    // if (isLoading){
    //     return(<div>loading...</div>)
    // }

    return (
        <div className='container'>
        <div className='contents'>
            <div className='header'>
                <h1>Add New Term Explanation</h1>
            </div>
        {/* <Box m={2} pt={3}> */}
            {/* <Typography variant='h4'>
                Add new Term Explanation
            </Typography> */}
            <Formik
                initialValues={{ ...initialValues }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, values, setFieldValue }) => (
                    <Form>
                    <Grid container m={2} spacing={2} justifyContent='center'>
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
                                    onChange={(e, value) => setFieldValue('synonyms', value || "")}
                                    renderTags={(value: readonly string[], getTagProps) =>
                                        value.map((option: string, index: number) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
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
                    </Grid>
                    <Grid container m={2} spacing={2} justifyContent='center'>
                        <Grid container mt={2} spacing={2}>
                            <Grid item xs={6}>
                                <CancelButton>
                                    Cancel
                                </CancelButton>
                            </Grid>
                            <Grid item xs={6}>
                                <SubmitButton>
                                    Save
                                </SubmitButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    </Form>
                )}
            </Formik>
            {errorMessage.length > 0 ? <Alert
                severity="error" style={{ "margin": "5px" }}>{errorMessage}</Alert> : null}
            {successMessage.length > 0 ? <Alert
                severity="success" style={{ "margin": "5px" }}>{successMessage}</Alert> : null}

        {/* </Box> */}
        </div>
        </div>
    )
};

export default TermForm;