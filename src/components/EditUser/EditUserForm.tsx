import { Alert, Box, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import { useReduxState, useSetReduxState } from '../../redux/hooks';
import URLContext, { baseURL } from "../../store/url-context";

// import custom components
import CancelButton from "../form/Button/Reroute";
import SubmitButton from "../form/Button/Submit";
import TextField from "../form/Fields/TextField";


const initialValues = {
    username: "",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirmation: ""
}

interface ISubmitValues {
    username: string,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string,
    uuid?: unknown
}


const EDITUSERAPI = `${baseURL}:5000/auth/edit_user`;


const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Required'),
    username: Yup.string(),
    newPassword: Yup.string()
        .matches(/(^$|^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$)/, 'Must contain * Characters, One Uppercase, One Lowercase, One Number and one special character. Or can be empty if password should not be changed.'),
    newPasswordConfirmation: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});


export const EditUserForm = (): React.ReactElement => {

    const navigate = useNavigate();
    const user = useReduxState((state) => state.users);
    const { userUUID } = useParams();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const url = useContext(URLContext)

    const handleSubmit = (values: ISubmitValues): void => {


        // add uuid to request data
        values.uuid = user.uuid;

        // put request to save results in database
        const editRequest = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify(values)
        };


        const fetchData = async () => {
            try {
                const response = await fetch(EDITUSERAPI + '?id=' + userUUID, editRequest);
                const result = await response.json();
                const tempUser = result['user']
                if (response.ok) {
                    localStorage.setItem('access_token', tempUser['access_token']);
                    localStorage.setItem('refresh_token', tempUser['refresh_token']);
                    setSuccessMessage(result['message']);
                }
            } catch (error: any) {
                console.log(error.message);
            }
        }

        fetchData();

        // reload page with updated username
        navigate(`/profile`)
    }

    return (
        <div className='contents'>
            {/* Title */}
            <div className='header'>
                <h1>Edit User Profile</h1>
            </div>
            <div className='Information' style={{textAlign: "center"}}>
                If you don't want to change your password or username, leave the respective fields blank.
                Currently logged in as {user.username}.
            </div>

            <Formik
                initialValues={{ ...initialValues }}
                validationSchema={validationSchema}
                onSubmit={values => handleSubmit(values)}
            >
                <Form>
                    <Grid container m={2} spacing={2} justifyContent='center'>
                        <Grid item xs={10}>
                            <TextField
                                name="username"
                                label="Username"
                                type="string"
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                name="currentPassword"
                                label="Current Password"
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                name="newPassword"
                                label="New Password"
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                name="newPasswordConfirmation"
                                label="Confirm New Password"
                                type="password"
                            />
                        </Grid>
                    </Grid>
                    <Grid container m={2} spacing={2} justifyContent='center'>
                        <Grid item xs={5}>
                            <CancelButton command={() => {navigate(url.clientManagement)}} backgroundColor='#FFFFFF' fontColor='#38288f'>
                                Cancel
                            </CancelButton>
                        </Grid>
                        <Grid item xs={5}>
                            <SubmitButton>
                                Save
                            </SubmitButton>
                        </Grid>
                    </Grid>
                </Form>
            </Formik>

            {/* alert and success messages at the bottom of the box */}
            {errorMessage.length > 0 ?
                <Alert severity="error" style={{ "margin": "5px" }}>{errorMessage}</Alert>
                : null}
            {successMessage.length > 0 ?
                <Alert severity="success" style={{ "margin": "5px" }}>{successMessage}</Alert>
                : null}
        </div>
    );
}