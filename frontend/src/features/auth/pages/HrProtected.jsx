import { Navigate } from 'react-router';
import React from 'react'

const HrProtected = ({children}) => {
    if(localStorage.getItem("user")){
        const user=JSON.parse(localStorage.getItem("user"));
        if(user.role==="hr"){
            return children;
        }
        else{
            return <Navigate to="/"/>
        }
    }
    else{
        return <Navigate to="/login"/>
    }
}

export default HrProtected