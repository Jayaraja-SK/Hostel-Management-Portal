import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './components/login';

import WardenDashboard from "./components/Warden/warden_dashboard";

import { AddWarden,  ViewWardens, EditWarden, ChangePassword, EditUser } from './components/Warden/manage_users';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Login />}/>

        <Route path="warden_dashboard" element={<WardenDashboard />}>
          <Route path="user/add_warden" element={<AddWarden />}/>
          <Route path="view_wardens" element={<ViewWardens />}/>
          <Route path="edit_warden" element={<EditWarden />}/>
          <Route path="change_pwd" element={<ChangePassword/>}/>
          <Route path="edit_user" element={<EditUser />}/>
        </Route>


        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
