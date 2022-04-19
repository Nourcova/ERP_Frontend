import React, { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import '../shared/Header.css';
import axios from 'axios'
function Header(props) {

  return (
    <div className='Header'>
      <img
        src={`http://127.0.0.1:8000/image/${props.adminImage}`}
        alt="Avatar" style={{ marginLeft: 20, borderRadius: '40px' }} />
      <h6>
        {props.adminName}
      </h6>
    </div>
  )
}

export default Header