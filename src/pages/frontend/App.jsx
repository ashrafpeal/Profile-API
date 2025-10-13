import React from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import Phone from "./pages/Phone";
import Person from "./pages/Person";
import Email from "./pages/partial/person/Email";
import LinkedIn from "./pages/partial/person/Linkedin";
import PhoneLinkedIn from "./pages/partial/phone/Linkedin";

const App = () => {
    let routes = [
        {
            path: '/',
            element: <Email />,
            name: 'Email',
            isActive: true
        },
        {
            path: '/person-details',
            element: <LinkedIn />,
            name: 'LinkedIn'
        }
    ]
    return (
        <HashRouter>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center">
                        <ul className="nav nav-pills pa_menu">
                            {
                                routes && routes.map(route => (
                                    <li className="nav-item mb-3 me-3"
                                        key={
                                            route.name
                                        }>
                                        <NavLink className={
                                            ({ isActive }) => `btn_orange btn_white ${isActive ? "btn_orange_active" : ""
                                                }`
                                        }
                                            to={
                                                route.path
                                            }>
                                            {
                                                route.name
                                            }</NavLink>
                                    </li>
                                ))
                            } </ul>
                    </div>
                    <div className="col-md-12 mx-auto pa_content">
                        <Routes> {
                            routes && routes.map(route => (
                                <Route key={
                                    route.name
                                }
                                    path={
                                        route.path
                                    }
                                    element={
                                        route.element
                                    } />
                            ))
                        } </Routes>
                    </div>
                </div>
            </div>
        </HashRouter>
    );
};


export default App;
