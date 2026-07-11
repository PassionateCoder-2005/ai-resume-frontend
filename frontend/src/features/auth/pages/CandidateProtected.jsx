import React from 'react'
import { Navigate } from 'react-router';

const CandidateProtected = ({children}) => {
    if(localStorage.getItem("user")){
        const user=JSON.parse(localStorage.getItem("user"));
        if(user.role==="candidate"){
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

export default CandidateProtected