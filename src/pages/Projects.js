// import * as React from 'react';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Buttons from '../components/shared/Buttons'
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import Search from '../components/shared/Search';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LoopIcon from '@mui/icons-material/Loop';
import PeopleIcon from '@mui/icons-material/People';
import Modal from "@material-ui/core/Modal";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import Loading from '../components/shared/Loading'
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from "aos";

import './projects.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `90%`,
    maxWidth: `1000px`,
    height: `85%`,
    overflow: 'auto',
    bgcolor: 'background.paper',
    border: '10px solid #ffffff',
    borderRadius: '20px',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#8ab038',
        color: '#ededed',
        textAlign: 'center'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 16,
        color: 'var(--textcolor1)',
        textAlign: "center",
        transition: '.5s'
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: "var(--background2)",
    transition: '.5s',
    '&:last-child td, &:last-child th': {
        border: 0,
    }
}));

function Projects() {

    const initialValues = { name: ' ,', in_progress: 'true' };
    const [formValues, setFormValues] = useState(initialValues);
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);
    const [team, setTeam] = useState('Null');
    const [searchValue, setSearchValue] = useState('');
    const [employees, setEmployees] = useState([]);
    const [employeesModal, setEmployeesModal] = useState([]);
    const [roles, setRols] = useState([]);
    const [role, setRole] = useState({ name: '' });
    const [open, setOpen] = useState(false);
    const [openChild, setOpenChild] = useState(false);
    const [loading, setLoading] = useState(true)

    const handleOpenChild = () => {
        setOpenChild(true);
    };

    const handleCloseChild = () => {
        setOpenChild(false);
    };

    const handleChangeModal = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        console.log(formValues.name)
    };

    const handleChangeNestedModal = (e) => {
        setRole({ ...role, name: e.target.value });
    };

    const addNewRole = (async () => {
        axios.post(`https://sleepy-wave-82877.herokuapp.com/api/roles`, role)
            .then(async role => {
                await getRols();
                handleCloseChild();
            }
            ).catch(err => console.log(err))

    });

    const addProject = (async () => {
        let team_id = { team_id: team };
        console.log(formValues)
        let new_project = null;
        await axios.post(`https://sleepy-wave-82877.herokuapp.com/api/projects`, formValues)
            .then(res => {
                new_project = res.data.data
            }).catch(err => console.log(err))

        await axios.post(`https://sleepy-wave-82877.herokuapp.com/api/projects/projToTeam/${new_project.id}`, team_id)
            .then(res => {
                console.log(res.data.data)
            }).catch(err => console.log(err))

        await employeesModal.map((e) => {
            const data = { role: e.role_id, employee: e.employee_id }
            axios.post(`https://sleepy-wave-82877.herokuapp.com/api/projects/roleToEmp/${new_project.id}`, data)
                .then(res => {
                    console.log(res.data)
                }).catch(err => console.log(err))
        })
        handleClose()
        getProjects()
    });


    const deleteProject = (id) => {
        console.log(id)
        axios.delete(`https://sleepy-wave-82877.herokuapp.com/api/projects/${id}`)
            .then(res => {
                setProjects(projects.filter(e => e.name !== id));
                if (res.data.status === 400) {
                    alert(res.data.message)
                } else {
                    alert(res.data.message)
                    getProjects()
                }
            })
            .catch(err => console.log(err))
    }


    const getProjects = (async () => {
        await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/projects`)
        .then(res => {setProjects(res.data.data.reverse()); console.log(res.data.data)})
        .finally(() => {
            setLoading(false)
        }).catch(err => console.log(err))

     
    });

    const getRols = (async () => {
        let res = await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/roles`)
        try {
            setRols(res.data.data)
        } catch (err) {
            console.log(err)
        }
    });

    const getTeams = (async () => {
        let res = await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/teams`)
        try {
            setTeams(res.data.data)
            console.log(res.data.data)
        } catch (err) {
            console.log(err)
        }
    });

    const handleOpen = () => {
        setOpen(true);
        setTeam('Null')
    };

    const handleClose = () => {
        setOpen(false)
        setEmployees([])
    };

    const handleChangeTeam = (e) => {
        const selected_team = teams.find(team => { return team.id === e.target.value })
        setTeam(e.target.value);
        console.log(e.target.value)
        if (e.target.value === 'Null') {
            setEmployees([])
            setEmployeesModal([])
        } else {
            setEmployees(selected_team.employee)
            setEmployeesModal([])
        }
    };

    const handleClickRole = async (employee_id, role_id, role_name) => {
        let exist = false;
        const data = {
            employee_id: employee_id,
            role_id: role_id,
            role_name: role_name
        }

        await employeesModal.map((e) => {
            if (e.employee_id === employee_id) {
                exist = true;
            }
        });
        if (exist === false) {
            await setEmployeesModal([...employeesModal, data])
        } else {
            employeesModal.map((e) => {
                if (e.employee_id === employee_id) {
                    e.role_id = role_id
                    e.role_name = role_name
                }
            });
        }
        console.log(employeesModal)
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        AOS.init();
        AOS.refresh();
        await getProjects();
        await getTeams();
        await getRols();
    }, []);

    return (
        <div className='projects'>
            <div className='d-flex justify-content-around'>
                <Search onChange={(e) => setSearchValue(e.target.value)} placeholder="Search for a project" />
                <Buttons
                    onClick={handleOpen}
                    buttonStyle="btn--success--solid"
                    buttonSize="btn-lg"
                    text={"Add Projects"}
                />
            </div>
            <div className='projects_table' style={{ display: 'flex', position: 'relative', height: "100%" }}>
                <TableContainer >
                    <Table sx={{ minWidth: 400 }} aria-label="contained table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left" style={{ width: "25%" }} > <AccountTreeIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>Project Name</span></StyledTableCell>
                                <StyledTableCell align="left" ><LoopIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>In Progress </span></StyledTableCell>
                                <StyledTableCell align="left" ><GroupsIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>Team</span></StyledTableCell>
                                <StyledTableCell align="left" ><PeopleIcon /> &nbsp;<span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>Employees Number</span></StyledTableCell>
                                <StyledTableCell align="left" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {loading ? <Loading />
                            :
                        <TableBody>
                            {projects.filter((val) => {
                                if (searchValue === '') {
                                    return val
                                } else if (val.name.toLowerCase().includes(searchValue.toLowerCase())) {
                                    return val
                                }
                            }).map((project, i) => (
                                <StyledTableRow className="main_row" key={i}>
                                    <StyledTableCell key={i} lign="left" style={{ paddingTop: "12px", paddingBottom: "12px" }} >{project.name}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="center">
                                        {project.in_progress === 0 ? < CheckCircleIcon  sx={{ color:"#8ab038" }} /> : <DoDisturbOnIcon sx={{ color: '#d15959' }}/>}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="center">
                                        {
                                            project.team === null ? 'no team' : project.team.name
                                        }
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="center">
                                        {teams.find(e => e.id === project.team_id)?.employee.length}
                                    </StyledTableCell>
                                    <StyledTableCell align="left" style={{ padding: 0 }}>
                                        <div className="button_table">
                                            <Link to={`/dashboard/Projects/${project.id}`}>
                                                <Buttons
                                                    buttonStyle="btn--success--solid"
                                                    buttonSize="btn-md"
                                                    icon={<EditIcon />}
                                                />
                                            </Link>
                                            <Buttons
                                                key={i}
                                                onClick={() => deleteProject(project.id)}
                                                buttonStyle="btn--danger--solid"
                                                buttonSize="btn-md"
                                                icon={<DeleteOutlineIcon />}
                                            />
                                        </div>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody> 
                        }
                    </Table>
                </TableContainer>
            </div>

            {/* first modal to add projects */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                
                <Box sx={style}>
                <div style={{width: '100%', display:'flex', flexDirection:'column'}} data-aos-duration="1500" data-aos="fade-up">
                    <h3 className='model-title' data-aos-duration="1500" data-aos="fade-down">Add new project</h3>
                    <Typography component={'div'} id="modal-modal-description" sx={{ m: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountTreeOutlinedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField
                                onChange={handleChangeModal}
                                name="name"
                                id="Projects_name"
                                size="small"
                                label="Projects name"
                                variant="outlined"
                                color='success' />
                        </Box>
                    </Typography>

                    <Typography component={'div'} id="modal-modal-description" sx={{ m: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GroupsOutlinedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Select"
                                value={team}
                                size="small"
                                onChange={handleChangeTeam}
                                helperText="Please select Team"
                                className='P-TextField'
                                color='success' >
                                <MenuItem key='-1' value='Null'>
                                    Null
                                </MenuItem>
                                {teams.map((team) => (
                                    <MenuItem key={team.id} value={team.id} >
                                        {team.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Typography>
                    <Typography component={'div'} id="modal-modal-description" sx={{ m: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GroupAddOutlinedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <div className='body-list'>
                                <li><span>employee</span><span>Role</span></li>
                                <div className='employee-list'>

                                    {employees.map((employee, i) => {
                                        return (
                                            <li key={employee.id}>
                                                <span>{employee.first_name + ' ' + employee.last_name} </span>
                                                <FormControl className='Roles' fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                                    <Select
                                                        id="outlined-select-currency"
                                                        labelId="demo-simple-select-label"
                                                        label="Role"
                                                        size="small"
                                                        className='P-TextField'
                                                        color='success'
                                                    >
                                                        {roles.map((role) => (
                                                            <MenuItem onClick={() => handleClickRole(employee.id, role.id, role.name)} key={role.id} value={role.id} >
                                                                {role.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </li>
                                        )
                                    })}
                                </div>
                            </div>
                        </Box>
                    </Typography>
                    <Typography component={'div'} id="modal-modal-description" sx={{ marginLeft: 'auto' }}>
                        <Buttons
                            onClick={() => handleOpenChild()}
                            buttonStyle="btn--success--solid"
                            buttonSize="btn-lg"
                            text={"New Role"}
                        />
                        <Buttons
                            onClick={() => addProject()}
                            buttonStyle="btn--success--solid"
                            buttonSize="btn-lg"
                            text={"Save"}
                        />
                    </Typography>
                    <Modal
                        hideBackdrop
                        open={openChild}
                        onClose={handleCloseChild}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                    >
                        <Box sx={{ ...style, width: 200 }}>
                            <form className='form-role'>
                                <TextField
                                    onChange={handleChangeNestedModal}
                                    id="Role_name"
                                    size="small"
                                    label="Role name"
                                    variant="outlined"
                                    color='success' />
                                <div className='form-button'>
                                    <Buttons
                                        type='button'
                                        onClick={() => addNewRole()}
                                        buttonStyle="btn--success--solid"
                                        buttonSize="btn-lg"
                                        text={"Save"}
                                    />
                                    <Buttons
                                        onClick={handleCloseChild}
                                        buttonStyle="btn--danger--solid"
                                        buttonSize="btn-lg"
                                        text={"Close"}
                                    />
                                </div>

                            </form>

                        </Box>
                    </Modal> </div>
                </Box>
               
            </Modal>
            {/* end modal to add projects */}
        </div>
    )
}

export default Projects
