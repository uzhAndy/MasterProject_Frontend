import React from 'react';
import AuthenticationSupplement from './AuthenticationSupplement';
import { RegisterForm } from './RegisterForm';

const Register = (): React.ReactElement => {
    return (
        <div className='row'>
            <div className='AuthCard'>
                <RegisterForm />
            </div>
            <div className='loginSupplement'>
                <AuthenticationSupplement />
            </div>
        </div>
    )
}

export default Register

