/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import logoLightGreen from '../../src/assets/img/logo-lightGreen.svg'
import Buttons from '../components/shared/Buttons';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AddAdmin(props) {
  
  useEffect(() => {
    console.log("PROPS", props)
    handleOpen();
  }, [])

  const [open, setOpen] = React.useState(false);
  const [formName, setName] = useState("");
  const [formPassword, setPassword] = useState("");
  const [formEmail, setEmail] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formValues, setFormValues] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    props.addNewadminF()
  };
  const handleImage = (e) => {
    e.preventDefault();
    console.log(e.target.files[0])
    setFormImage(e.target.files[0])
  }
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === 'name') setName(e.target.value);
    if (e.target.name === 'email') setEmail(e.target.value);
    if (e.target.name === 'password') setPassword(e.target.value);
    console.log("name:", formName, "email:", formEmail, "pass:", formPassword);

  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    var formData = new FormData();
    formData.append("name", formName);
    formData.append("email", formEmail);
    formData.append("password", formPassword);
    formData.append("image", formImage);

    await axios.post(`https://sleepy-wave-82877.herokuapp.com/api/admins/`, formData)
      .then(res => {
        console.log(res)
        if (res.data.status === 200) {
          Swal.fire({
            title: 'ERP System',
            text: 'Admin Added Successfully!',
            confirmButtonText: 'OK'
          })
        }
        else {
          Swal.fire({
            title: 'ERP System  ',
            text: res.data.message,
            confirmButtonText: 'OK'
          })
        }
        props.getAdmins()
      })
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose}
        aria-labelledby="draggable-dialog-title"

      >
        <DialogTitle id="draggable-dialog-title">
          Add Admin
        </DialogTitle>
        <form>
          <DialogContent>
            <DialogContentText>
              <TextField
                onChange={handleChange}
                name='name'
                label=" Name"
                type="name"
                required
                color='success'
                size='small'
                style={{ width: '40%' }}
              />
              <br></br>
              <br></br>
              <TextField
                onChange={handleChange}
                name='email'
                label="Email"
                type="email"
                required
                color='success'
                size='small'
                style={{ width: '40%' }}
              />
              <br></br>
              <br></br>
              <TextField
                onChange={handleChange}
                name='password'
                label="Password"
                type="password"
                required
                color='success'
                size='small'
                style={{ width: '40%' }}
              />
              <br></br>
              <br></br>
              <TextField
                type="file"
                onChange={handleImage}
                required
                color='success'
                size='small'
                style={{ width: '40%' }}
              />
              <img src={logoLightGreen}
                alt=''
                style={{
                  width: ' 200px',
                  height: '200px',
                  margin: ' 0% auto',
                  float: 'right',
                  marginTop: '-173px'
                }} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Buttons
              type='button'
              onClick={handleClose}
              buttonStyle="btn--danger--solid"
              buttonSize="btn-lg"
              text={"Discard"}
            ></Buttons>
            <div onClick={handleClose} >
              <Buttons
                type='button'
                onClick={handleSubmit}
                buttonStyle="btn--success--solid"
                buttonSize="btn-lg"
                text={"Save"}
              >
              </Buttons></div>
          </DialogActions>
        </form>

      </Dialog>
    </div>
  );
}
