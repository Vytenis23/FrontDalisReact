import React from "react";
import { Navigate, Outlet } from "react-router";
import Navbar from "./Navbar";

const ProtectedRoutes = () => {
    const token = localStorage.getItem('accessToken') || '';
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return (
        <>
            <Outlet />
        </>
    );
};

export default ProtectedRoutes;