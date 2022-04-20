import React, { useEffect, useState } from 'react';
import './admins.css'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Button, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Buttons from '../components/shared/Buttons';
import EditIcon from "@mui/icons-material/Edit";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@mui/material/TextField";
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddAdmin from './AddAdmin'
import LinearProgress from '@mui/material/LinearProgress';
import Search from '../components/shared/Search';
import Loading from '../components/shared/Loading'
import CheckIcon from '@mui/icons-material/Check';
import AOS from "aos";
import "aos/dist/aos.css";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

function Admins(props) {
  const [openD, setOpenD] = useState(false);
  const [openE, setOpenE] = useState(false);
  const [openELogged, setOpenELogged] = useState(false);
  const [admins, setAdmins] = useState([])
  const [admin, setAdmin] = useState({})
  const [loading, setLoading] = useState(true)
  const [imageProps, setImageProps] = useState(props.imageProps)
  const [searchValue, setSearchValue] = useState('');
  const logOut = () => {
    localStorage.removeItem('token');
    axios.post(`https://sleepy-wave-82877.herokuapp.com/api/logout`)
      .then(response => console.log(response))
      .then(response => {
        window.location.reload(true)
      })
    console.log('clear')
  }
  const handleOpenE = async (a) => {
    await setFormValues({ id: a.id, name: a.name, email: a.email, image: a.image, })
    setOpenE(true);
  };
  const handleOpenELoggedIn = async (a) => {
    await setFormValues({ id: a.id, name: a.name, email: a.email, image: a.image, })
    setOpenELogged(true);
  };
  const handleCloseE = () => {
    setOpenE(false);
    setOpenELogged(false);
  };

  useEffect(() => {
    getAdmins();
    AOS.init();
    AOS.refresh();
  }, [])
  //All Admins
  function getAdmins() {
    axios.get(`https://sleepy-wave-82877.herokuapp.com/api/admins`)
      .then(response => {
        setAdmins(response.data.data)
        console.log(response.data.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  //Get Admin by ID
  function adminById(a_id) {
    axios.get(`https://sleepy-wave-82877.herokuapp.com/api/admins/${a_id}`)
      .then(response => {
        setAdmin(response.data.data)
      })
  }
  //Deleting Admin ..
  const handleClickOpenD = (e, id, name) => {
    setAdmin({ id: id, name: name })
    setOpenD(true);
  };
  const handleCloseD = () => {
    setOpenD(false);
  };
  function deleteAdminD(a_id) {
    axios.delete(`https://sleepy-wave-82877.herokuapp.com/api/admins/${a_id}`)
      .then(() => getAdmins())
  }
  //Update Admin
  const initialValues = { id: "", name: "", email: "", image: "", adminName: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formImage, setFormImage] = useState(initialValues.image);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handelChangeImage = (e) => {
    e.preventDefault();
    setFormImage(e.target.files[0])
  }
  const [fileI, setfileI] = useState(false);
  const changeImage = () => {
    setfileI(true)
  }
  const submitImage = (e) => {
    var formData = new FormData();
    formData.append("image", formImage);
    axios.post(`https://sleepy-wave-82877.herokuapp.com/api/admins/image/${formValues.id}`, formData).then(response => {
      getAdmins();
      setfileI(false)
      setOpenE(false);
      setOpenELogged(false);
      setFormImage('')
      setImageProps(formImage)
      window.location.reload()
      console.log(response)
    })
  }
  const handleSubmit = () => {
    var formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("email", formValues.email);
    axios.post(`https://sleepy-wave-82877.herokuapp.com/api/admins/${formValues.id}`, formData)
    .then(response => {
        getAdmins();
        console.log(response)
         
      }).catch(err => {
        console.error(err)
      });
  }
  //Add Admin
  const [postadd, setPostadd] = useState(false);
  const addNewadmin = () => { setPostadd(true) }
  const addNewadminF = () => { setPostadd(false) }

  return (
    <div className='admins' style={{
      height: 400,
      overflow: 'auto',
      marginBottom: 30
    }}>
      <div className='d-flex justify-content-around'>
        <Search 
          placeholder="Search for a Admin"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Buttons
          onClick={() => addNewadmin()}
          buttonStyle="btn--success--solid"
          buttonSize="btn-lg"
          text={"Add Admin"}
        />
      </div>
      {postadd ? <AddAdmin addNewadminF={addNewadminF} getAdmins={getAdmins} /> : ""}

      <div className='admins_table' style={{ display: 'flex', position:'relative' }} >
        <TableContainer>
          <Table sx={{
            minWidth: 400,
          }} aria-label="contained table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left" style={{ paddingLeft: "50px", width: "25%" }} > <PersonOutlineIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>Name</span></StyledTableCell>
                <StyledTableCell align="left" style={{ width: "25%" }}><MailOutlineIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>Email</span></StyledTableCell>
                <StyledTableCell align="left" style={{ width: "25%" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</StyledTableCell>
              </TableRow>
            </TableHead>
            {loading ?
              <Loading />
              :
              <TableBody
              >
                {admins.filter((val) => {
                  if (searchValue === '') {
                    return val
                  }
                  else if (val.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) {
                    return val
                  }
                }).reverse().map(a => (

                  <StyledTableRow
                    className="main_row" key={a.id} >
                    <StyledTableCell align="left" style={{ paddingTop: "12px", paddingBottom: "12px" }} >
                      <img
                        alt=''
                        src={`https://sleepy-wave-82877.herokuapp.com/image/${a.image}`}
                        style={{     
                          width: '25px',
                          height: '25px',
                          borderRadius: '50%', }}
                      />  &nbsp;
                      {a.name}
                      {a.name === props.adminName ?
                        <span style={{
                          backgroundColor: '#99c43d',
                          borderRadius: '10px',
                          fontSize: '12px',
                          padding: '15px',
                          textAlign: 'center',
                          padding: '2px 10px',
                          margin: '15px',
                        }
                        }>YOU</span> : ''}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="left">
                      {a.email}
                    </StyledTableCell>
                    <StyledTableCell style={{ padding: 0 }}>
                      <div className="button_table">
                        {a.name === props.adminName ?
                          <Buttons
                            onClick={() => handleOpenELoggedIn(a)}
                            buttonStyle="btn--success--solid"
                            buttonSize="btn-md"
                            icon={<EditIcon />}
                          ></Buttons> :
                          <Buttons
                            onClick={() => handleOpenE(a)}
                            buttonStyle="btn--success--solid"
                            buttonSize="btn-md"
                            icon={<EditIcon />}
                          ></Buttons>}
                        {admins.length === 1 || a.name === props.adminName ?
                          <button style={{
                            borderRadius: '24px',
                            height: '35px',
                            width: '36px', marginTop: '7px'
                          }} disabled> <DeleteOutlineIcon /></button>
                          :
                          <Buttons
                            onClick={(e) => handleClickOpenD(e, a.id, a.name)}
                            buttonStyle="btn--danger--solid"
                            buttonSize="btn-md"
                            icon={<DeleteOutlineIcon />}
                          />}
                        <Dialog
                          open={openD}
                          onClose={() => handleCloseD}
                          aria-labelledby="draggable-dialog-title">
                          <DialogTitle style={{ color: 'red', }} id="draggable-dialog-title">
                            Delete
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              <span>{admin.name}</span>
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                          <Buttons
                              onClick={() => handleCloseD()}
                              buttonStyle="btn--success--solid"
                              buttonSize="btn-lg"
                              text={'Cancel'}>
                            </Buttons>
                            <div onClick={() => handleCloseD()}>
                              <Buttons
                                onClick={() => deleteAdminD(admin.id)}
                                buttonStyle="btn--danger--solid"
                                buttonSize="btn-lg"
                                text={'Delete'}
                              ></Buttons>
                            </div>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                <Dialog
                  open={openE}
                  onClose={() => handleCloseE}
                  aria-labelledby="draggable-dialog-title" >
                  <DialogTitle style={{ cursor: 'move', color: 'red', }} id="draggable-dialog-title">
                    Edit Admin
                    <span style={{ float: 'right', borderBottom: '1px solid red' }}>
                      {formValues.name}
                    </span>
                  </DialogTitle>
                  <form >
                    <DialogContent>
                      <DialogContentText>
                        <TextField
                          defaultValue={formValues.name} onChange={handleChange}
                          name='name'
                          label=" Name"
                          id='nameEmail'
                          type="name"
                          required
                          color='success'
                          size='small'
                          style={{ width: '40%' }}
                        />
                        <br></br>
                        <br></br>
                        <TextField
                          defaultValue={formValues.email} onChange={handleChange}
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
                        <img className='imgAdmin'
                        alt=''
                          onClick={changeImage}
                          src={`https://sleepy-wave-82877.herokuapp.com/image/${formValues.image}`}
                          style={{
                            width: ' 200px',
                            height: '200px',
                            margin: ' 0% auto',
                            float: 'right',
                            marginTop: '-145px',
                            borderRadius: '120px',
                            border: '8px solid #4c611f',
                            cursor: 'pointer'
                          }} />
                        {fileI ?
                          <div>
                            <TextField
                              type="file"
                              onChange={handelChangeImage}
                              required
                              color='success'
                              size='small'
                              style={{ width: '40%' }} />
                            <IconButton aria-label="Example">
                              {formImage ?
                                <SaveIcon
                                  color='success'
                                  onClick={submitImage}
                                >save</SaveIcon> : ''}
                            </IconButton>
                          </div>
                          : ''}

                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Buttons
                        type='button'
                        onClick={handleCloseE}
                        buttonStyle="btn--danger--solid"
                        buttonSize="btn-lg"
                        text={"Discard"}
                      ></Buttons>
                      <div onClick={handleCloseE} >
                        <Buttons
                          type='button'
                          onClick={handleSubmit}
                          buttonStyle="btn--success--solid"
                          buttonSize="btn-lg"
                          text={"Save"}
                        >
                        </Buttons>
                      </div>
                    </DialogActions>
                  </form>
                </Dialog>
                <Dialog
                  open={openELogged}
                  onClose={() => handleCloseE}
                  aria-labelledby="draggable-dialog-title" >
                  <DialogTitle style={{ cursor: 'move', color: 'red', }} id="draggable-dialog-title">
                    Edit Your Information
                    <span style={{ float: 'right', borderBottom: '1px solid red' }}>
                      {formValues.name}
                    </span>
                  </DialogTitle>
                  <form >
                    <DialogContent>
                      <DialogContentText>
                        <TextField
                          defaultValue={formValues.name} onChange={handleChange}
                          name='name'
                          label=" Name"
                          id='nameEmail'
                          type="name"
                          required
                          color='success'
                          size='small'
                          style={{ width: '40%' }}
                        />
                        <br></br>
                        <br></br>
                        <TextField
                          defaultValue={formValues.email} onChange={handleChange}
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
                        <img className='imgAdmin'
                        alt=''
                          onClick={changeImage}
                          src={`https://sleepy-wave-82877.herokuapp.com/image/${formValues.image}`}
                          style={{
                            width: ' 200px',
                            height: '200px',
                            margin: ' 0% auto',
                            float: 'right',
                            marginTop: '-145px',
                            borderRadius: '120px',
                            border: '8px solid #4c611f',
                            cursor: 'pointer'
                          }} />
                        {fileI ?
                          <div>
                            <TextField
                              type="file"
                              onChange={handelChangeImage}
                              required
                              color='success'
                              size='small'
                              style={{ width: '40%' }} />
                            <div >
                              <IconButton aria-label="Example">
                                {formImage ?
                                  <SaveIcon
                                    color='success'
                                    onClick={submitImage}
                                  >save</SaveIcon> : ''}
                              </IconButton>
                            </div>
                          </div>
                          : ''}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Buttons
                        type='button'
                        onClick={handleCloseE}
                        buttonStyle="btn--danger--solid"
                        buttonSize="btn-lg"
                        text={"Discard"}
                      ></Buttons>
                      <div onClick={logOut} >
                        <Buttons
                          type='button'
                          onClick={handleSubmit}
                          buttonStyle="btn--success--solid"
                          buttonSize="btn-lg"
                          text={"Save"}
                        >
                        </Buttons>
                      </div>
                    </DialogActions>
                  </form>
                </Dialog>
              </TableBody>
            }
          </Table>
        </TableContainer>
      </div>

      {/* <div className='cards'>
        {admins.filter((val) => {
          if (searchValue === '') {
            return val
          }
          else if (val.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) {
            return val
          }
        }).reverse().map(admin => {
          <>
            {loading ?
              <Loading />
              :
              <div className="row2-container">
                <div className="box green">
                  <img src={`https://sleepy-wave-82877.herokuapp.com/image/${admin.image}`} alt='' />
                  <h4>{admin.name}</h4>
                  <div className="button_table">

                  </div>
                </div>
              </div>
            }
          </>
        })}
      </div> */}

      
    </div>
  )
}
export default Admins