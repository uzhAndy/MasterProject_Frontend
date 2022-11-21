import React from 'react';
import { baseURL } from './url-context';

const AuthContext = React.createContext({
    token: ():string => "",
    check_token: ():Promise<boolean> => {return new Promise<boolean>(() => {})},
})

const CHECK_API = `${baseURL}:5000/auth/check_login`


export const AuthContextManagement = (props: any):any => {

    const token = () => {
        return "Bearer " + localStorage.getItem('access_token')
    }

    const checkPermission = async (checkRequest:RequestInit) => {
        try{
            const response = await fetch(CHECK_API, checkRequest);
            return response.ok
        } catch (error:any){
            console.log(error.message);
            return false;
        }
    }
    
    const check_token = async () => {

        const checkRequest = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': token() },
        };

        return checkPermission(checkRequest);
    } 


    const contextValue = {
        token: token,
        check_token: check_token,
    }

    return (
        <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
    )
}

export default AuthContext


