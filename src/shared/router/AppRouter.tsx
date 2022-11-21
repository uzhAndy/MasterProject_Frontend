import React, {useContext} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Accept from '../../components/acceptPage/Accept';
import Login from '../../components/authentication/Login';
import Register from '../../components/authentication/Registration';
import {ClientsForm} from '../../components/clientManagement/ClientsForm';
import {ClientsOverview} from '../../components/clientManagement/ClientsOverview';
import {TranscriptsOverview} from '../../components/transcript/TranscriptsOverview';
import {EditClientData} from '../../components/clientManagement/EditClientData';
import MainConsultation from '../../components/consultation/MainConsultation';
import TermsExplanation from '../../components/consultation/Visualizations/TermExplanation';
import {EditUser} from '../../components/EditUser/EditUser';
import EditTermForm from '../../components/financialJargon/EditTermForm';
import TermsForm from '../../components/financialJargon/TermsForm';
import TermsTable from '../../components/financialJargon/TermsTable';
import Home from '../../components/homepage/Home/Home';
import RiskAssessment from "../../components/riskQuestionaire/RiskAssessment";
import { useReduxState } from '../../redux/hooks';
import URLContext from '../../store/url-context';
import Navigationbar from '../components/NavigationSidebar';
import LoginGuard from '../guards/LoginGuard';
import { Role } from '../models/loginform';


const AppRouter = () => {

    const url = useContext(URLContext)
    const user = useReduxState((state) => state.users)

    return (
        <div>
        {user.role !== Role.GUEST ?
        // routs to show if the user is not a guest
        <Routes>
            <Route path={url.home} element={<Home />} />
            <Route path={url.login} element={<Login />} />
            <Route path={url.register} element={<Register />} />
            <Route path={url.accept} element={
                <LoginGuard>
                    <Navigationbar>
                        <Accept />
                    </Navigationbar>
                </LoginGuard>} />
            <Route path={url.clientManagement} element={
                <LoginGuard>
                    <Navigationbar>
                        <ClientsOverview />
                    </Navigationbar>
                </LoginGuard>} />
            <Route path={url.transcript} element={
                <LoginGuard>
                    <Navigationbar>
                        <TranscriptsOverview />
                    </Navigationbar>
                </LoginGuard>} />
            <Route path={url.editClient} element={
                <LoginGuard>
                    <Navigationbar>
                        <EditClientData />
                    </Navigationbar>
                </LoginGuard>} />
            <Route path={url.addClient} element={
                <LoginGuard>
                    <Navigationbar>
                        <ClientsForm />
                    </Navigationbar>
                </LoginGuard>} />
            <Route path={url.editUser} element={
                <LoginGuard>
                    <Navigationbar>
                        <EditUser/>
                    </Navigationbar>
                </LoginGuard>} />
            <Route path={url.riskForm} element={
                <LoginGuard>
                    <Navigationbar>
                        <RiskAssessment />
                    </Navigationbar>
                </LoginGuard>} />
            <Route path={url.consultation} element={
                // navigation sidebar gets handled in the MainConsultation component
                <LoginGuard>
                    <MainConsultation />
                </LoginGuard>} />
            <Route path={url.addTerm} element={
                <LoginGuard>
                    <Navigationbar>
                        <TermsForm />
                    </Navigationbar>
                </LoginGuard>} />
            <Route path={url.editTerm} element={
                <LoginGuard>
                    <Navigationbar>
                        <EditTermForm />
                    </Navigationbar>
                </LoginGuard>} />
            <Route path={url.termsOverview} element={
                <LoginGuard>
                    <Navigationbar>
                        <TermsTable />
                    </Navigationbar>
                </LoginGuard>} />
            {/* default route */}
            <Route path="*" element={<Navigate to={url.home} />} />
        </Routes> :
        // routs to show to guests
        <Routes>
            <Route path={url.login} element={<Login />} />
            <Route path={url.register} element={<Register />} />
            <Route path={url.home} element={<Home />} />
            <Route path={url.consultation} element={
                // navigation sidebar gets handled in the MainConsultation component
                <LoginGuard>
                    <MainConsultation />
                </LoginGuard>} />
            {/* default route */}
            <Route path="*" element={<Navigate to={url.home} />} />
            </Routes>
        }
        </div>
    );

}



export default AppRouter

