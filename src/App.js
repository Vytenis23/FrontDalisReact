import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import { routes } from "./routes";
import Navbar from "./Navbar";


function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {routes.public.map(route => route)}
                <Route path="home" element={<ProtectedRoutes />}>
                    {routes.protected.map(route => route)}
                </Route>
            </Routes>
        </>
    );
}

export default App;