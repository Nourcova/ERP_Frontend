import React from 'react';
import Nav from '../components/shared/Nav';
import Header from '../components/shared/Header';
import { Outlet } from "react-router-dom";
import './dashboard.css';
function Dashboard(props) {

  return (
    <div className='dashboard'>
      <Nav logOut={props.logOut} />
      <div className='dashboard-body'>
        <Header adminName={props.adminName} adminImage={props.adminImage} />
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
