import { Navigate } from 'react-router';
import React from 'react'
import { useSelector } from 'react-redux'

const HrProtected = ({children}) => {
    const { user, loading } = useSelector((state) => state.auth)

    if (loading) {
        return <div>Loading...</div>
    }

    if (user?.role === "hr") {
        return children
    }

    if (user) {
        return <Navigate to="/" />
    }

    return <Navigate to="/login" />
}

export default HrProtected