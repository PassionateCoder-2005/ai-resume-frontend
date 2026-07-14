import React from 'react'
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux'

const CandidateProtected = ({children}) => {
    const { user, loading } = useSelector((state) => state.auth)

    if (loading) {
        return <div>Loading...</div>
    }

    if (user?.role === "candidate") {
        return children
    }

    if (user) {
        return <Navigate to="/" />
    }

    return <Navigate to="/login" />
}

export default CandidateProtected