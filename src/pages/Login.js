import React, { useState, useEffect } from 'react';
import logoLG from '../assets/img/logo-lightGreen.svg';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import './login.css';
import axios from 'axios'
import AOS from "aos";
import "aos/dist/aos.css";


function Login(props) {

  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    var admin = { email, password }
    axios.post(`https://sleepy-wave-82877.herokuapp.com/api/login`, admin)
      // .then(response => console.log('response', response.data.data.original.token))
      .then(response => {
        if (response.data.status === 400 || response.data.status === 500) {
          console.log('Wrong Email or Password  !')
          Swal.fire({
            icon: 'error',
            title: 'ERP System',
            text: 'Wrong Email or Password  !',
            confirmButtonText: 'OK',
          })
        }
        else {
          localStorage.setItem('token', response.data.data.original.token);
          localStorage.setItem('id', response.data.admin.id);
          Swal.fire({
            icon: 'success',
            title: 'ERP System',
            text: 'Successfully loged in !',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/dashboard/Admins')
            }
          });
        }
      })
  }

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, [])

  return (
    <div className='login' >
      <div className='first-section' >
        <img data-aos="fade-right" data-aos-duration="1500" src={logoLG} alt='' />
        <h1 data-aos="fade-right" data-aos-duration="1500">ERP Codi</h1>
        <h5 data-aos="fade-right" data-aos-duration="1500">Facilitate your HR management</h5>
        <h5 data-aos="fade-right" data-aos-duration="1500">Fast and Precise Results</h5>
      </div>
      <div className='second-section' >
        <img data-aos="fade-down" data-aos-duration="1500" src={logoLG} alt='' />
        <div data-aos="fade-left" data-aos-duration="1500">
          <h1>Sign in to ERP Codi</h1>
          {props.quote ?
            <i style={{ color: '#8ab038', fontSize: '20px' }}>

              `{props.quote}`
            </i> : ''
          }
        </div>
        <form onSubmit={handleSubmit}>
          <input data-aos="fade-left" data-aos-duration="1500"
            type='email'
            name='email'
            placeholder='Enter Your Email'
            value={email}
            onChange={e => setEmail(e.target.value)} />
          <input data-aos="fade-left" data-aos-duration="1500" type='password'
            name='password'
            placeholder='Enter Your Password'
            value={password}

            onChange={e => setPassword(e.target.value)} />
          <button data-aos="fade-left" data-aos-duration="1500"
            type='submit'
            name='login'
          >Continue
          </button>
        </form>
      </div>

    </div>
  )
}

export default Login;