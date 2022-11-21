import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import * as Yup from "yup";
import countries from "../../shared/data/countries.json";
import AuthContext from "../../store/auth-context";
import DatePicker from "../form/Fields/DatePicker";
import CancelButton from '../form/Button/Back';
import { useNavigate, useParams } from 'react-router';
import Reroute from "../form/Button/Reroute";
import SubmitButton from "../form/Button/Submit";
import URLContext, { baseURL } from "../../store/url-context";
import SelectField from "../form/Fields/SelectField";
import TextField from "../form/Fields/TextField";
import RadioGroup from '../form/Fields/RadioGroup';
import { useReduxState, useSetReduxState } from '../../redux/hooks';
import { setRiskQuestionnaireCompleted } from '../../redux/reducers/consultReducer';


const CLIENTS_API = `${baseURL}:5000/clients`;
const steps = ['Basic Data', 'Risk Form'];
const clientInstance = {
    address1: "",
    address2: "",
    zip: "",
    city: "",
    country: "",
    birthdate: "",
    client_type: "",
    email: "",
    firstname: "",
    lastname: "",
    nr_of_counselings: "",
    uuid: "",
    AuM: "",
    q1: "empty",
    q2: "empty",
    q3: "empty",
    q4: "empty",
    q5: "empty",
    q6: "empty",
    q7: "empty",
    q8: "empty",
    q9: "empty",
    q10: "empty",
};
const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('Required'),
    lastname: Yup.string().required('Required'),
    address1: Yup.string().required('Required'),
    address2: Yup.string().required('Required'),
    zip: Yup.string().required('Required')
        .matches(/^[0-9]+$/, 'Must be only digits').min(4, 'Must be exactly four digits')
        .max(4, 'Must be exactly four digits'),
    city: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    email: Yup.string().email('Enter a valid email').required('Required'),
    birthdate: Yup.date().required('Required'),
});

interface RiskQuestions {
    q: string,
    id: string,
    answers: {
        a1: string,
        a2: string,
        a3: string,
        a4?: string,
        a5?: string,
    }
};
interface Client {
    address1: string,
    address2: string,
    zip: string,
    city: string,
    country: string,
    birthdate: string,
    client_type: string,
    email: string,
    firstname: string,
    lastname: string,
    nr_of_counselings: string,
    uuid: string,
    AuM: string,
    q1: string,
    q2: string,
    q3: string,
    q4: string,
    q5: string,
    q6: string,
    q7: string,
    q8: string,
    q9: string,
    q10: string,
};

export default function RiskAssessment() {

    const riskQuestions: RiskQuestions[] = [
        {
            q: 'Savings amount: Do you save assets every year?',
            id: 'q1',
            answers: {
                a1: 'No, living expenses are financed from assets.',
                a2: 'No, the expenses for living expenses roughly correspond to the annual income.',
                a3: 'Yes, the expenses for living are lower than the annual income.'
            }
        },
        {
            q: 'Financial reserves: How high are your potential financial reserves that are not invested?',
            id: 'q2',
            answers: {
                a1: 'No reserves available',
                a2: '<= 3 monthly expenses',
                a3: '3-6 monthly expenses.',
                a4: '> 6 monthly expenses'
            }
        },
        {
            q: 'Maximum Loss: What annual loss on your investments can you sustain to continue meeting your current and future financial obligations?',
            id: 'q3',
            answers: {
                a1: '<= 10 %',
                a2: '11-25 %',
                a3: '26-40 %',
                a4: '> 40 %'
            }
        },
        {
            q: 'Source of income: Where does most of your annual income come from?',
            id: 'q4',
            answers: {
                a1: 'employment',
                a2: 'pension',
                a3: 'property income',
                a4: 'securities income',
                a5: 'rest',
            }
        },
        {
            q: 'Total assets: What are your total assets (not including the 2nd pillar and the property you live in)?',
            id: 'q5',
            answers: {
                a1: 'from CHF 100 000.–',
                a2: 'CHF 100 000.– to CHF 250 000.–',
                a3: 'CHF 250 000.– to CHF 500 000.–',
                a4: 'CHF 500 000.– to CHF 1 000 000.–',
                a5: 'above CHF 1 000 000.–'
            }
        },
        {
            q: 'Annual income: What is your annual income (including income from securities and real estate)?',
            id: 'q6',
            answers: {
                a1: 'up to CHF 75 000.-',
                a2: 'CHF 75 000.- to CHF 125 000.-',
                a3: 'CHF 125 000.- to CHF 200 000.-',
                a4: 'above CHF 200 000.-'
            }
        },
        {
            q: 'Purpose of the investment: What is the purpose of your investable/invested assets?',
            id: 'q7',
            answers: {
                a1: 'Financing livelihood',
                a2: 'retirement provision',
                a3: 'investment',
                a4: 'No specific purpose'
            }
        },
        {
            q: 'Investment horizon: How long is the investment horizon of the assets to be invested?',
            id: 'q8',
            answers: {
                a1: '<= 5 Years',
                a2: '5-10 Years',
                a3: '11-15 Years',
                a4: '> 15 Years'
            }
        },
        {
            q: 'Falling Markets: What would be your reaction if the value of your investable/invested assets has fallen by 20%?',
            id: 'q9',
            answers: {
                a1: 'I am selling all assets.',
                a2: 'I am selling part of my assets.',
                a3: 'I wait and do nothing.',
                a4: 'I\'ll buy more equipment.',
            }
        },
        {
            q: 'Return/risk expectation: Which of the return/risk combinations below corresponds best to the assets to be invested?',
            id: 'q10',
            answers: {
                a1: 'combination 1',
                a2: 'combination 2',
                a3: 'combination 3',
                a4: 'combination 4',
                a5: 'combination 5'
            }
        }
    ];
    const items: JSX.Element[] = []
    const navigate = useNavigate()
    const url = useContext(URLContext)
    const ctx = useContext(AuthContext);
    let consult = useReduxState((state) => state.consult)
    const dispatch = useSetReduxState()
    const getClientsRequest = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() }
    };
    const { clientUUID } = useParams();
    const [, setDataLoaded] = React.useState(0);

    useEffect(() => {
        // Update the document title using the browser API
        fetch(CLIENTS_API + '?id=' + clientUUID, getClientsRequest).then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(obj => {
                const client = obj.body.clients

                // Assign the values from the client to the clientInstance for the initial values
                clientInstance.firstname = client.firstname;
                clientInstance.lastname = client.lastname;
                clientInstance.address1 = client.address.street;
                clientInstance.address2 = client.address.street_nr;
                clientInstance.city = client.address.city;
                clientInstance.zip = client.address.zip_code;
                clientInstance.country = client.address.country;
                var d = new Date(client.birthdate);
                var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
                    ("0" + d.getDate()).slice(-2);
                clientInstance.birthdate = datestring;
                clientInstance.email = client.email;
                clientInstance.AuM = client.AuM;
                clientInstance.uuid = client.uuid;


                // Control State for the Reinitialization of the initialValues
                setDataLoaded(1);

            })
    }, []);

    // Create all risk Questions by iterating over the riskQuestions and save them in items
    riskQuestions.forEach((element, index) =>
        items.push(
            <Grid item sm={12} md={6}>
                {/* <Card style={{
                    backgroundColor: theme.palette.primary.contrastText,
                    borderRadius: 10
                }}> */}
                <Box m={2}>
                    <RadioGroup name={element.id}
                        question={element.q}
                        answerOptions={element.answers} />
                </Box>
                {/* </Card> */}
            </Grid>
        ));

    // active Step is used to control the "Back", "Next" & "Submit" Buttons and progress Bar on top
    const [activeStep, setActiveStep] = React.useState(0);

    // formValues capture the answers of the radio buttons for the Risk Questionaire (the Basic date is handled in
    // the "const handleSubmit", where the Risk Questionaire Answers are added to the values
    const [formValues] = useState<Client>(clientInstance);

    // Back button, logic only solely steered via the activeStep
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };
    // handleSubmit controls the logic of the "Next" & the "Submit" button and sends the PUT Request to the Backend
    const handleSubmit = (values: any) => {

        setActiveStep(activeStep + 1);

        if (activeStep == 1) {

            const ClientDataJson = {
                "AuM": formValues.AuM,
                "nrOfCounselings": formValues.nr_of_counselings,
                "firstname": values.firstname,
                "lastname": values.lastname,
                "address1": values.address1,
                "address2": values.address2,
                "zipCode": values.zip,
                "city": values.city,
                "country": values.country,
                "email": values.email,
                "clientType": formValues.client_type,
                "birthdate": values.birthdate,
                "uuid": clientUUID,
                "q1": values.q1,
                "q2": values.q2,
                "q3": values.q3,
                "q4": values.q4,
                "q5": values.q5,
                "q6": values.q6,
                "q7": values.q7,
                "q8": values.q8,
                "q9": values.q9,
                "q10": values.q10
            }


            const submitRequest = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ClientDataJson)
            };

            // Request sent to Backend

            fetch(CLIENTS_API, submitRequest).then(response => response.json().then(data => ({ status: response.status, body: data })))
                .then(obj => {
                    if (obj.status == 406) {
                        console.log("Request failed - update client");
                    } else {
                        dispatch(setRiskQuestionnaireCompleted(true))
                    }
                })
        }
    }

    return (
        <div className='container'>
        <div className='contents'>
            <div className='header'>
                <h1>Risk Questionnaire</h1>
            </div>
            <>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5, pr:5}} >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography variant="h5" gutterBottom>
                            Thank you for completing the risk assessment
                        </Typography>
                        <Typography variant="subtitle1">
                            Your information has been stored
                        </Typography>
                        <Reroute command={() => { navigate(url.clientManagement) }}>
                            Home
                        </Reroute>
                    </React.Fragment>
                ) : (
                    <Formik
                        initialValues={clientInstance}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            {activeStep === 0 && (
                                <React.Fragment>
                                    <Grid container spacing={2} sx={{ pt: 3, pb: 5, pr:5}}>
                                        <Grid item xs={12} md={6} >
                                            <TextField
                                                name="firstname"
                                                label="First Name"
                                                type="string"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                name="lastname"
                                                label="Last Name"
                                                type="string"
                                            />
                                        </Grid>
                                        <Grid item xs={7} md={9}>
                                            <TextField
                                                name="address1"
                                                label="Street Name"
                                                type="string"
                                            />
                                        </Grid>
                                        <Grid item xs={5} md={3}>
                                            <TextField
                                                name="address2"
                                                label="House Number"
                                                type="string"
                                            />
                                        </Grid>
                                        <Grid item xs={7} md={5}>
                                            <TextField
                                                name="city"
                                                label="City"
                                                type="string"
                                            />
                                        </Grid>
                                        <Grid item xs={5} md={3}>
                                            <TextField
                                                name="zip"
                                                label="Zip / Postal code"
                                                type="string"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <SelectField
                                                name="country"
                                                label="Country"
                                                options={countries}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            <TextField
                                                name="email"
                                                label="Email"
                                                type="string"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <DatePicker
                                                name="birthdate"
                                                label="Birth Date"
                                            />
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
                            )}
                            {activeStep === 1 && (
                                <React.Fragment>
                                    <Grid container mt={2} spacing={2}>
                                        {items}
                                    </Grid>
                                </React.Fragment>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr:5, pl:5 }} >
                                {activeStep != 0 && (
                                    <Grid container mt={2} mb={2} spacing={2}>
                                        <CancelButton
                                            comm={handleBack}
                                        >
                                            Back
                                        </CancelButton>
                                    </Grid>
                                )}
                                {activeStep < 1 && (
                                    <Grid container ml={5} mr={5} mt={2} mb={2} spacing={2} >
                                        <SubmitButton>
                                            Next
                                        </SubmitButton>
                                    </Grid>
                                )}
                                {activeStep == 1 && (
                                    <Grid container mt={2} mb={2} spacing={2}>
                                        <SubmitButton>
                                            Submit
                                        </SubmitButton>
                                    </Grid>
                                )}
                            </Box>
                        </Form>
                    </Formik>
                )}
            </>
        </div>
        </div>
    );
}

