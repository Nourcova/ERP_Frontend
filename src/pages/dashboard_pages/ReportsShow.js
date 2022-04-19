import React, {useState, useEffect} from 'react'
import emp from '../../assets/img/emp.jpg'
import { Outlet } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { useParams } from "react-router-dom";
import axios from 'axios'
import AOS from "aos";
import './ReportsShow.css'


function ReportsShow() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({})

  const getEmployee = async () => {
    let res = await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/employees/${id}`)
    try {
      setEmployee(res.data.data)
    }catch(err){
      console.log(err)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    AOS.init();
    AOS.refresh();
    getEmployee()
    }, []);

  return (
    <div className='report-show'>
      <div className='nav-reports' data-aos-duration="1500" data-aos="fade-down">
        <div className='first' data-aos-duration="2500" data-aos="fade-right">
          <img src={emp} alt='' />
          <h5>{employee.first_name + ' ' + employee.last_name}</h5>
        </div>
        <div className='type' data-aos-duration="2500" data-aos="fade-left">

            <NavLink  className={({ isActive }) => (isActive ? 'activeLink' : 'inactive')} to={`/dashboard/reports/${id}/reportData/kpis`}>
              KPIS
            </NavLink>
          
            <NavLink className={({ isActive }) => (isActive ? 'activeLink' : 'inactive')} to={`/dashboard/reports/${id}/reportData/projects`}>
              Projects
            </NavLink>
  
            <NavLink className={({ isActive }) => (isActive ? 'activeLink' : 'inactive')} to={`/dashboard/reports/${id}/reportGraph`}>
             Graph
            </NavLink>
        
        </div>
      </div>
      <div className='nav-details'>
        <Outlet />
      </div>
    </div>
  )
}

export default ReportsShow