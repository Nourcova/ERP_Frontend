/* eslint-disable no-const-assign */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admins from './pages/Admins';
import ReportsShow from './pages/dashboard_pages/ReportsShow';
import Reports from './pages/Reports';
import ReportKpi from './pages/reports_pages/ReportKpi';
import ReportProject from './pages/reports_pages/ReportProject';
import ReportGraph from './pages/reports_pages/ReportGraph';
import sun from './assets/img/sun.jpg'
import moon from './assets/img/moon.jpg'
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import Projects from './pages/Projects';
import EditTeam from './pages/EditTeam';
import EditProject from './pages/EditProject';
import axios from 'axios'
import AOS from "aos";
import './App.css';

function App() {

  const img = [sun, moon];
  const [quote, setQuote] = useState('');
  const [adminName, setAdminName] = useState('')
  const [adminImage, setAdminImage] = useState('')

  const [index, setIndex] = useState(() => {
    const num = localStorage.getItem('theme') === 'light' ? 0 : 1;
    return num ;
  })

  const [theme, setTheme] = useState(() => {
    const item = localStorage.getItem('theme');
    return item ;
  })

  const switchTheme = () => {
    AOS.init();
    AOS.refresh();
    if (theme === 'light') {
      setIndex(1)
      setTheme('dark')
      document.body.style.backgroundColor = '#21231c';
      localStorage.setItem('theme', 'dark')
    } else {
      setIndex(0)
      setTheme('light')
      document.body.style.backgroundColor = '#fcfcfc';
       localStorage.setItem('theme', 'light')
    }
  }
  //Quotes
  const randomQ = async () => {
    let random = parseInt(Math.random() * 100);
    axios.get("https://type.fit/api/quotes")
      .then(response => {
        setQuote(response.data[random].text)
      });
  }

  //Logout
  const logOut = async () => {
    localStorage.removeItem('token');
    axios.post(`https://sleepy-wave-82877.herokuapp.com/api/logout`)
      .then(response => console.log(response))
    console.log('clear')
  }

  useEffect(() => {
    if(localStorage.getItem('theme' ) === 'dark'){
      document.body.style.backgroundColor = '#21231c';
    }else{
      document.body.style.backgroundColor = '#fcfcfc';
    }
    randomQ();
    var admin_id = localStorage.getItem('id')
    axios.get(`https://sleepy-wave-82877.herokuapp.com/api/admins/${admin_id}`)
      .then(response => {
        console.log('response', response)
        setAdminName(response.data.data.name)
        setAdminImage(response.data.data.image)
      })
  }, [])
  
  return (
    // <div className="App" data-theme={theme}>
    <div className="App" data-theme={theme}>
      <div className="switch-mode">
        <button onClick={switchTheme} data-aos-duration="1500" data-aos="zoom-in">
          <img src={img[index]} alt='' />
        </button>

      </div>

      <Router>
        <Routes>
          <Route path='/' element={<Login quote={quote} />} />
          <Route path="/login" element={<Login />} />
          {
            localStorage.getItem('token') !== null ?
              <Route path="/dashboard" element={<Dashboard logOut={logOut} adminImage={adminImage} adminName={adminName} />}>
                <Route path="Admins" element={<Admins logOut={logOut} adminImage={adminImage} adminName={adminName} />} />
                <Route path="Employees" element={<Employees />} />
                <Route path="Teams" element={<Teams />} />
                <Route path="Teams/:id" element={<EditTeam />} />
                <Route path="editProject" element={<EditProject />} />
                <Route path="Projects" element={<Projects />} />
                <Route path="Projects/:id" element={<EditProject />} />
                <Route path="reports" element={<Reports />} />
                <Route path="reports/:id" element={<ReportsShow />}>
                  <Route path="reportData/kpis" element={<ReportKpi />} />
                  <Route path="reportData/projects" element={<ReportProject />} />
                  <Route path="reportGraph" element={<ReportGraph index={index}/>}/>
                </Route>
              </Route>
              :
              <Route path="*" element={<Login />} />
          }
        </Routes>
      </Router>
    </div>
  );
}

export default App;
