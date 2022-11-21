import React from 'react'
import { LoginForm } from '../authentication/LoginForm'
import AuthenticationSupplement from './AuthenticationSupplement'



const Login = (): React.ReactElement => {
    return (
        <div className='row'>
            <div className='AuthCard'>
                <LoginForm />
            </div>
            <div className='loginSupplement'>
                <AuthenticationSupplement />
            </div>
        </div>
    )
}

export default Login;