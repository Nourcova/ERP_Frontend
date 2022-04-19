import React, { useState, useEffect } from 'react'
import LogoLG from '../../assets/img/logo-lightGreen.svg';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import { NavLink } from 'react-router-dom'
import './nav.css';
import ViewListIcon from '@mui/icons-material/ViewList';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import AOS from "aos";
import "aos/dist/aos.css";

function Nav(props) {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, [])
  return (
    <div className='nav'  >
      <div data-aos-duration="1500" data-aos="fade-down">
        <img id="img" src={LogoLG} alt='' />
        <h3 id='h3'>ERP Codi</h3>
      </div>
      <ul>

        <NavLink  style={({ isActive }) => (isActive ? { backgroundColor: 'var(--buttonhover1)', color: 'var(--textcolor1)' } : { backgroundColor: 'transparent' })} to='/dashboard/Admins'>
          <li style={{ backgroundColor: "inherit" }} data-aos-duration="1500" data-aos="fade-right">
            <PersonOutlinedIcon className='icon' />
            <span className='ms-3'>Admins</span>
          </li>
        </NavLink>

        <NavLink style={({ isActive }) => (isActive ? { backgroundColor: 'var(--buttonhover1)', color: 'var(--textcolor1)' } : { backgroundColor: 'transparent' })} to='/dashboard/Employees'>
          <li data-aos-duration="1500" data-aos="fade-right"   style={{ backgroundColor: "inherit" }}>
            <GroupAddOutlinedIcon className='icon' />
            <span className='ms-3'>Employee</span>
          </li>
        </NavLink>

        <NavLink style={({ isActive }) => (isActive ? { backgroundColor: 'var(--buttonhover1)', color: 'var(--textcolor1)' } : { backgroundColor: 'transparent' })} to='/dashboard/Teams'>
          <li data-aos-duration="1500" data-aos="fade-right"  style={{ backgroundColor: "inherit" }}>
            <GroupsOutlinedIcon className='icon' />
            <span className='ms-3'>Teams</span>
          </li>
        </NavLink>

        <NavLink style={({ isActive }) => (isActive ? { backgroundColor: 'var(--buttonhover1)', color: 'var(--textcolor1)' } : { backgroundColor: 'transparent' })} to='/dashboard/Projects'>
          <li data-aos-duration="1500" data-aos="fade-right"  style={{ backgroundColor: "inherit" }}>
            <AccountTreeOutlinedIcon className='icon' />
            <span className='ms-3'>Projects</span>
          </li>
        </NavLink>

        <NavLink style={({ isActive }) => (isActive ? { backgroundColor: 'var(--buttonhover1)', color: 'var(--textcolor1)' } : { backgroundColor: 'transparent' })} to='/dashboard/reports'>
          <li data-aos-duration="1500" data-aos="fade-right"  style={{ backgroundColor: "inherit" }}>
            <EqualizerRoundedIcon className='icon' />
            <span className='ms-3'>Reports</span>
          </li>
        </NavLink>

      </ul>
      
      <NavLink to='/'  >
        <li
          className='logout'
          onClick={props.logOut}
        >
          <LogoutIcon data-aos-duration="1500" data-aos="fade-up"
            color='success'
            sx={{ fontSize: 40 }}
            className="LogOut" />
        </li> </NavLink>
    </div>
  )
}

export default Nav