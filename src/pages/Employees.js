// import * as React from 'react';
import React, { useEffect, useState } from 'react';
import logoLightGreen from '../../src/assets/img/logo-lightGreen.svg'


//Material UI
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import { TextField, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from "@material-ui/core/Modal";
import LinearProgress from '@mui/material/LinearProgress';


//Material UI Dropdown
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//CSS
import './employees.css'

//Components
import Buttons from '../components/shared/Buttons'
import Search from '../components/shared/Search';

//Images
import maskgroup from '../assets/img/Mask-group.png'

//Swal
import Swal from 'sweetalert2';

//Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import GroupsIcon from '@mui/icons-material/Groups';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import Loading from '../components/shared/Loading'
import AOS from "aos";

//Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

//axios
import axios from 'axios';

//Pagination
import Pagination from 'react-js-pagination';


import { makeStyles } from "@material-ui/core/styles";


//////////////////////
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
/////////////////////
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#8ab038',
        color: '#ededed',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
        color: 'var(--textcolor1)',
        transition: '.5s',
        backgroundColor: 'var(--background2)',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({

    backgroundColor: "#F9F9F9",

    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    }

}));
function createData(image, first_name, last_name, email, phone, team, id, password, kpi, team_id) {
    return { image, first_name, last_name, email, phone, team, id, password, kpi, team_id };
}


function Employees(props) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `90%`,
        maxWidth: `1000px`,
        height: `80%`,
        overflow: 'auto',
        bgcolor: 'background.paper',
        border: '10px solid #ffffff',
        borderRadius: '20px',
        boxShadow: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    };

    const [open, setOpen] = React.useState(false); //for delete dialog
    const [openEmployee, setOpenEmployee] = useState(false); //for add dialog
    const [openEditEmployee, setOpenEditEmployee] = useState(false);//for edit dialog
    const [kpiList, setKpiList] = useState([]);
    const [kpiListObject, setKpiListObject] = useState([]);
    const [kpi, setKpi] = useState({ name: '' });// add new kpi to kpi list
    const [kpiSave, setKpiSave] = useState([])
    const [kpiEmployee, setKpiEmployee] = useState('');
    const [openChild, setOpenChild] = React.useState(false);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [teams, setTeams] = useState([]);    


    const [employeeToDelete, setEmployeeToDelete] = useState('');
    const [employeeToEdit, setEmployeeToEdit] = useState({
        first_name: "",
        last_name: "",
        email: "",
        // image: "",
        phone: "",
        password: "",
        kpi: [],
        kpi_id: "",
        rate: "",
    });
    const [formImage, setFormImage] = useState("");
    const [formFirstName, setFirstName] = useState("");
    const [formLastName, setLastName] = useState("");
    const [formPhone, setPhone] = useState("");
    const [formEmail, setEmail] = useState("");




    const [finalPagination, setFinalPagination] = useState({});

    const [final, setFinal] = useState([]);
    const [employee, setEmployee] = useState({
        image: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",

    })



    //============> Edit Employee
    const handleSubmitEdit = () => {
        const data = {
            first_name: employeeToEdit.first_name,
            last_name: employeeToEdit.last_name,
            email: employeeToEdit.email,
            // image: employee.image,
            phone: employeeToEdit.phone,
            password: employeeToEdit.password,
            team_id: employeeToEdit.team_id,
            kpi_id: employeeToEdit.kpi_id,
            rate: employeeToEdit.rate,
        }
        axios.post(`https://sleepy-wave-82877.herokuapp.com/api/employees/${employeeToEdit.id}`, data).then(() => {
            console.log("Data")
            getAllEmployees()
        }
        )

    }
    //============> For Add Kpi
    const handleOpenChild = () => {
        setOpenChild(true);
    };

    const handleCloseChild = () => {
        setOpenChild(false);
    };
    //

    //============> For Delete Dialog
    const handleClickOpen = (emp) => {
        setEmployeeToDelete(emp);
        console.log(emp)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    //

    //============> For Add Employee Dialog
    const handleClickOpenEmployee = () => {
        setOpenEmployee(true);
    }
    const handleClickCloseEmployee = () => {
        setOpenEmployee(false);
        setEmployee("");

    }

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.name === 'first_name') setFirstName(e.target.value);
        if (e.target.name === 'last_name') setLastName(e.target.value);
        if (e.target.name === 'email') setEmail(e.target.value);
        if (e.target.name === 'phone') setPhone(e.target.value);
        console.log("first_name:", formFirstName, "email:", formEmail, "phone:", formPhone);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        var formData = new FormData();
        formData.append("first_name", formFirstName);
        formData.append("last_name", formLastName);
        formData.append("email", formEmail);
        formData.append("phone", formPhone);
        formData.append("image", formImage);

        await axios.post(`https://sleepy-wave-82877.herokuapp.com/api/employees/`, formData)
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    Swal.fire({
                        title: 'ERP System',
                        text: 'Employee Added Successfully!',
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
                getAllEmployees();
            })
    }

    //============> For Edit Employee Dialog
    const handleClickOpenEdit = async (emp) => {
        setEmployeeToEdit(emp);
        console.log("Employee to Edit:", emp);
        console.log("KPIS:", emp.kpi)
        getAllKpis(emp);
        setOpenEditEmployee(true);
        // getKpiEmployee(emp.id);
        setKpiEmployee([...kpiEmployee, emp.kpi]);
        console.log('all teams', teams)
        //    await console.log('kpi:',kpiEmployee);
    }

    const handleClickCloseEdit = () => {
        setOpenEditEmployee(false);
        setKpiEmployee([]);
    }
    const handleChangeEdit = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setEmployeeToEdit({ ...employeeToEdit, [e.target.name]: value })
        console.log(employeeToEdit);
    }


    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const ValidationTextField = styled(TextField)({
        '& input:valid + fieldset': {
            borderColor: 'green',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    });
    //

    const getAllEmployees = async () => {
        await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/employees`, { crossdomain: true }).then(response => {
            console.log('asdf', response.data.data)
            const result = response.data.data;

            const employeeList = []
            result.map((employee) => {
                if (employee.team_id === null) {
                    employeeList.push(createData(employee.image, employee.first_name, employee.last_name, employee.email, employee.phone, "No Team assigned", employee.id, employee.password, employee.kpi, employee.team_id))
                } else
                    employeeList.push(createData(employee.image, employee.first_name, employee.last_name, employee.email, employee.phone, employee.team.name, employee.id, employee.password, employee.kpi, employee.team_id))
            })
            console.log('employeeList', employeeList);
            setFinal(employeeList);

        }).finally(setLoading(false));
    }

    const getAllKpis = async () => {
        const kkppii = []
        const kkkpppiii = [];
        await axios.get("https://sleepy-wave-82877.herokuapp.com/api/kpi").then(response => {
            setKpiListObject(response.data.data)
            response.data.data.map((kpi) => {
                kkppii.push(kpi.name);
                kkkpppiii.push(kpi)
            })
        })
        setKpiList(kkppii);
        console.log('list kpi', kpiList)
        console.log('list kpi---------llllllllll', kpiListObject)

    }

    const getAllTeams = async () => {
        await axios.get("https://sleepy-wave-82877.herokuapp.com/api/teams").then(response => {
            console.log(response.data.data);
            setTeams(response.data.data)

        })
    }

    const handleChangeKpi = (e) => {
        e.preventDefault();
        setKpi({ name: e.target.value });
    }
    const handleSubmitKpi = async () => {
        await axios.post(`https://sleepy-wave-82877.herokuapp.com/api/kpi/`, kpi).then(response => {
            console.log(response);
            getAllKpis();
        })
    }


    const deleteRow = (id) => {
        axios.delete(`https://sleepy-wave-82877.herokuapp.com/api/employees/${id}`)
            .then(() => {
                getAllEmployees();
                console.log(id)
            }).catch(() => console.log(id));
    }

    const handleImage = (e) => {
        e.preventDefault();
        console.log(e.target.files[0])
        setFormImage(e.target.files[0])
    }
    useEffect(() => {
        AOS.init();
        AOS.refresh();
        getAllEmployees();
        getAllKpis();
        getAllTeams();
    }, [])
    return (

        <div className='employees'>
            <div className='d-flex justify-content-around' style={{marginBottom:'15px'}}>
                <Search onChange={(e) => setSearchValue(e.target.value)} placeholder="Search for an employee" />
                <Buttons text="Add Employee" buttonStyle="btn--success--solid"
                    buttonSize="btn-lg" onClick={handleClickOpenEmployee} />
            </div>
            <Dialog
                fullScreen={fullScreen}
                open={openEmployee}
                onClose={handleClickCloseEmployee}
                aria-labelledby="responsive-dialog-title"
                fullWidth
            ><div>
                    <DialogTitle id="responsive-dialog-title">
                        <h3 className='model-title'>Add new Employee</h3>
                    </DialogTitle>
                    <DialogContent >
                        <DialogContentText style={{ display: "flex", paddingTop: "10px", fontSize: '10px' }}>

                            <div>
                                <TextField
                                    onChange={handleChange}
                                    name='first_name'
                                    label=" First name"
                                    type="text"
                                    required
                                    style={{ width: '320px', paddingBottom:'20px' }}
                                />
                                <br></br>

                                <TextField
                                    onChange={handleChange}
                                    name='last_name'
                                    label="Last Name"
                                    type="text"
                                    required
                                    style={{ width: '320px', paddingBottom:'20px' }}
                                />
                                <br></br>
                                <TextField
                                    onChange={handleChange}
                                    name='email'
                                    label="Email"
                                    type="email"
                                    required
                                    style={{ width: '320px', paddingBottom:'20px' }}
                                />
                                <br></br>
                                <TextField
                                    onChange={handleChange}
                                    name='phone'
                                    label="Phone"
                                    type="text"
                                    required
                                    style={{ width: '320px', paddingBottom:'20px' }}
                                />
                                <br></br>
                                <TextField
                                    type="file"
                                    onChange={handleImage}
                                    required
                                    color='success'
                                    size='small'
                                    style={{ width: '70%' }}
                                />
                            </div>

                            <img 
                            alt=""
                            src={logoLightGreen}
                                style={{
                                    width: ' 200px',
                                    height: '200px',
                                    float: 'right',
                                }} />

                            <br></br>
                            <br></br>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Buttons buttonSize="btn-lg" text="Disagree" buttonStyle="btn--danger--solid" type="submit" autoFocus onClick={handleClickCloseEmployee} />
                        <div onClick={handleClickCloseEmployee}>
                            <Buttons buttonSize="btn-lg" text="Agree" buttonStyle="btn--success--solid" type="submit" onClick={handleSubmit} autoFocus />
                        </div>
                    </DialogActions>
                </div>
            </Dialog>

            

                <div className='employees_table' style={{ display: 'flex', position:'relative' }}>
                {loading ? <Loading /> :
                    <TableContainer  >
                        <Table sx={{ minWidth: 400 }} aria-label="contained table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left" style={{ paddingLeft: "20px", width: "25%" }} > <PersonOutlineIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>Name</span></StyledTableCell>
                                    <StyledTableCell align="left" style={{ width: "25%" }}><MailOutlineIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>Email</span></StyledTableCell>
                                    <StyledTableCell align="left" style={{ width: "15%" }}><PhoneIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>Phone</span></StyledTableCell>
                                    <StyledTableCell align="left" style={{ width: "20%" }}><GroupsIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>Team</span></StyledTableCell>
                                    <StyledTableCell align="left" style={{ width: "15%" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</StyledTableCell>
                                    {/* <StyledTableCell align="left"></StyledTableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {final.filter((val) => {
                                    if (searchValue === "") {
                                        return val;
                                    } else if (
                                        val.first_name.toLowerCase().includes(searchValue.toLowerCase())
                                    ) {
                                        return val;
                                    }
                                }).reverse().map((row) => (
                                    <StyledTableRow className="main_row" key={row.id}>
                                        <StyledTableCell align="left" style={{ paddingTop: "12px", paddingBottom: "12px" }} > 
                                        <img
                                            alt=''
                                            src={`http://127.0.0.1:8000/image/${row.image}`}
                                            style={{     
                                                width: '25px',
                                                height: '25px',
                                                borderRadius:'50%' }}
                                        />&nbsp; {row.first_name} {row.last_name}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="left">
                                            {row.email}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="left">
                                            {row.phone}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="left">
                                            {row.team}
                                        </StyledTableCell>
                                        <StyledTableCell align="left" style={{ padding: 0 }}>
                                            <div className="button_table">

                                                <Buttons
                                                    onClick={() => handleClickOpenEdit(row)}
                                                    buttonStyle="btn--success--solid"
                                                    buttonSize="btn-md"
                                                    icon={<EditIcon />}
                                                />
                                                <Buttons
                                                    onClick={() => handleClickOpen(row)}
                                                    buttonStyle="btn--danger--solid"
                                                    buttonSize="btn-md"
                                                    icon={<DeleteOutlineIcon />}
                                                />

                                            </div>
                                        </StyledTableCell>
                                        {/* <StyledTableCell align="center" style={{padding:0}}>{row.name === showActionId ?<div className="button_table"> <Button size="small" variant="contained">Delete</Button> </div>: ""}</StyledTableCell> */}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>}
                </div>
            <Dialog
                fullScreen={fullScreen}
                open={openEditEmployee}
                onClose={handleClickCloseEdit}
                aria-labelledby="responsive-dialog-title"
                fullWidth
                maxWidth={'md'}

            >
                <DialogTitle id="responsive-dialog-title">
                    {"Edit Employee"}
                </DialogTitle>
                <DialogContent  >
                    <DialogContentText style={{ display: "flex", paddingTop: "10px", fontSize: "10px", justifyContent: "space-evenly" }}>
                        <div>
                            &nbsp;
                            <TextField
                                onChange={handleChangeEdit}
                                value={employeeToEdit.first_name}
                                name='first_name'
                                label=" First name"
                                type="text"
                                required
                                style={{ width: '320px' }}
                            />
                            <br></br>
                            <br></br>
                            <TextField
                                onChange={handleChangeEdit}
                                value={employeeToEdit.last_name}
                                name='last_name'
                                label="Last Name"
                                type="text"
                                required
                                style={{ width: '320px' }}
                            />
                            <br></br>
                            <br></br>
                            <TextField
                                onChange={handleChangeEdit}
                                value={employeeToEdit.email}
                                name='email'
                                label="Email"
                                type="email"
                                required
                                style={{ width: '320px' }}
                            />
                            <br></br>
                            <br></br>

                            <TextField
                                onChange={handleChangeEdit}
                                value={employeeToEdit.phone}
                                name='phone'
                                label="Phone"
                                type="text"
                                required
                                style={{ width: '320px' }}
                            />

                            {/* <TextField
                                onChange={handleChangeEdit}
                                value={employeeToEdit.password}
                                name='password'
                                label="Passowrd"
                                type="text"
                                required
                                style={{ width: '320px' }}
                            /> */}
                            {/* <TextField
                                onChange={handleChangeEdit}
                                value={employeeToEdit.team}
                                name='team'
                                label="Team"
                                type="text"
                                required
                                style={{ width: '320px' }}
                            /> */}

                            <br></br>
                            <br></br>
                            <FormControl style={{ width: '320px' }}>
                                <InputLabel id="demo-simple-select-label">Team</InputLabel>
                                <Select
                                    value={employeeToEdit.team_id}
                                    label="Team"
                                    onChange={handleChangeEdit}
                                    defaultValue={employeeToEdit.team}
                                    id="outlined-select-currency"
                                    labelId="demo-simple-select-label"
                                    size="small"
                                    className='P-TextField'
                                    color='success'
                                    name="team_id"
                                >
                                    {
                                        teams.map(team => (
                                            <MenuItem value={team.id}>{team.name}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                            <br></br>
                            <br></br>
                        </div>
                        <div className='body-list' style={{ alignSelf: 'self-start', width: "40%", height: '350px' }}>
                            <li>
                                <span style={{ fontSize: 'large' }}>kpi</span>
                                <span style={{ fontSize: 'large' }}>rate</span>
                            </li>
                            <div className='employee-list'>

                                {employeeToEdit.kpi.filter(({ id }, index) => !employeeToEdit.kpi.map(o => o.id).includes(id, index + 1)).map(kpi => {
                                    let v = kpi;
                                    return (

                                        <li style={{ gap: '10px' }}>

                                            <FormControl className='Roles' fullWidth>

                                                <TextField
                                                    value={kpi.name}
                                                    label="Kpi"
                                                    name='kpi_id'
                                                    defaultValue={kpi.id}
                                                    id={`outlined-select-currency-${kpi}`}
                                                    labelId="demo-simple-select-label"
                                                    size="small"
                                                    className='P-TextField'
                                                    color='success'
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                >
                                                    {/* {kpiList.map((kpi) => (

                                                                                        <MenuItem value={kpi}>{kpi}</MenuItem>
                                                                                    ))} */}
                                                    {/* <MenuItem value={20}>Kpi</MenuItem>
                                                                            <MenuItem value={30}>Kpi</MenuItem> */}
                                                </TextField>
                                            </FormControl>

                                            <FormControl className='Roles' fullWidth>
                                                <InputLabel id="demo-simple-select-label">Rate</InputLabel>
                                                <Select
                                                    value={employeeToEdit.rate}
                                                    label="Age"
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        setKpiSave([...kpiSave, { kpi_id: e.target.value, role: v }])
                                                        console.log(kpiSave)
                                                        console.log(employeeToEdit.id, employeeToEdit.last_name, employeeToEdit.first_name)
                                                        axios.post(`https://sleepy-wave-82877.herokuapp.com/api/employees/${employeeToEdit.id}`, {
                                                            first_name: employeeToEdit.first_name,
                                                            last_name: employeeToEdit.last_name,
                                                            email: employeeToEdit.email,
                                                            phone: employeeToEdit.phone,
                                                            password: employeeToEdit.password,
                                                            team_id: employeeToEdit.team_id,
                                                            kpi_id: v.id,
                                                            rate: e.target.value
                                                        }).then(() => {
                                                            console.log("Data")
                                                            console.log("Don't play with me", v);
                                                            getAllEmployees()
                                                        }
                                                        )
                                                    }}
                                                    defaultValue={kpi.pivot.rate}
                                                    id={`outlined-select-currency-${kpi}`}
                                                    labelId="demo-simple-select-label"
                                                    size="small"
                                                    className='P-TextField'
                                                    color='success'
                                                    name="rate"
                                                >
                                                    <MenuItem value={1}>1</MenuItem>
                                                    <MenuItem value={2}>2</MenuItem>
                                                    <MenuItem value={3}>3</MenuItem>
                                                    <MenuItem value={4}>4</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={6}>6</MenuItem>
                                                    <MenuItem value={7}>7</MenuItem>
                                                    <MenuItem value={8}>8</MenuItem>
                                                    <MenuItem value={9}>9</MenuItem>
                                                    <MenuItem value={10}>10</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </li>
                                    )
                                })}
                                <li style={{ gap: '10px' }}>
                                    <FormControl className='Roles' fullWidth>
                                        <InputLabel id="demo-simple-select-label">Kpi</InputLabel>
                                        <Select
                                            value={employeeToEdit.kpi_id}
                                            label="Age"
                                            onChange={handleChangeEdit}
                                            // defaultValue=""
                                            id="outlined-select-currency"
                                            labelId="demo-simple-select-label"
                                            size="small"
                                            className='P-TextField'
                                            color='success'
                                            name="kpi_id"
                                        >
                                            {
                                                kpiList.filter((el) => !employeeToEdit.kpi.map((kpii) => {
                                                    return kpii.name
                                                }).includes(el)).map((kpi) => (
                                                    <MenuItem value={kpiListObject.find((el) => el.name === kpi).id}>{kpi}</MenuItem>
                                                ))}
                                          
                                        </Select>
                                    </FormControl>

                                    <FormControl className='Roles' fullWidth>
                                        <InputLabel id="demo-simple-select-label">Rate</InputLabel>
                                        <Select
                                            value={employeeToEdit.rate}
                                            label="Age"
                                            onChange={handleChangeEdit}
                                            // defaultValue=""
                                            id="outlined-select-currency"
                                            labelId="demo-simple-select-label"
                                            size="small"
                                            className='P-TextField'
                                            color='success'
                                            name="rate"
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={6}>6</MenuItem>
                                            <MenuItem value={7}>7</MenuItem>
                                            <MenuItem value={8}>8</MenuItem>
                                            <MenuItem value={9}>9</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                        </Select>
                                    </FormControl>
                                </li>
                            </div>

                            <Buttons text="Add KPI" buttonSize='btn-lg' buttonStyle='btn--success--solid' onClick={() => handleOpenChild()} />
                            <Modal
                                hideBackdrop
                                open={openChild}
                                onClose={handleCloseChild}
                                aria-labelledby="child-modal-title"
                                aria-describedby="child-modal-description"
                            >
                                <Box sx={{ ...style, width: 200 }}>
                                    <form>
                                        <TextField
                                            onChange={handleChangeKpi}
                                            id="Role_name"
                                            size="small"
                                            label="Kpi name"
                                            variant="outlined"
                                            color='success'
                                            value={kpi.name}
                                        />
                                        <div onClick={handleCloseChild}>
                                            <Buttons
                                                type='button'
                                                onClick={handleSubmitKpi}
                                                buttonStyle="btn--success--solid"
                                                buttonSize="btn-lg"
                                                text={"Save"}
                                            />
                                        </div>
                                    </form>
                                    <Buttons
                                        onClick={handleCloseChild}
                                        buttonStyle="btn--danger--solid"
                                        buttonSize="btn-lg"
                                        text={"Close"}
                                    />
                                </Box>
                            </Modal>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Buttons buttonSize="btn-lg" text="Disagree" buttonStyle="btn--danger--solid" type="submit" autoFocus onClick={handleClickCloseEdit} />

                    <div onClick={handleClickCloseEdit}>
                        <Buttons buttonSize="btn-lg" text="Agree" buttonStyle="btn--success--solid" type="submit" onClick={handleSubmitEdit} autoFocus />
                    </div>
                </DialogActions>
            </Dialog>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Do You want to DELETE ${employeeToDelete.first_name} ${employeeToDelete.last_name} ?`}
                </DialogTitle>
                <DialogActions>
                    <Buttons buttonSize="btn-lg" text="Cancel" buttonStyle="btn--success--solid" type="submit" onClick={handleClose} />
                    <div onClick={handleClose}>
                        <Buttons buttonSize="btn-lg" text="Delete" buttonStyle="btn--danger--solid" type="submit" onClick={() => deleteRow(employeeToDelete.id)} autoFocus />

                    </div>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Employees