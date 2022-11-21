import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import AuthContext from '../../store/auth-context';
import URLContext from '../../store/url-context';

const LoginGuard = (props: { children: any }) => {
  const [permission, setPermission] = useState(false)
  const [updated, setUpdated] = useState(false)
  const ctx = useContext(AuthContext)
  const url = useContext(URLContext)

  useEffect (() => {
    ctx.check_token().then((data) => {
        setPermission(data)
        setUpdated(true)
    })
  }, [])
  


  return(
      <div>
        { !updated ? null: permission ? props.children : <Navigate to={url.login} /> }
      </div>
      
    
  )
}

export default LoginGuard;


