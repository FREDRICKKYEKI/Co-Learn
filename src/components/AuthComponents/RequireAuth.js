import React from 'react'
import { Navigate,useLocation } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthProvider' 

export const RequireAuth = ({children}) => 
{
    const location = useLocation()
    const {currentUser} = useAuth()
    if(!currentUser)
    {
      return <Navigate to='/login' state={{path: location.pathname}}/>  
    }
  return children
}
