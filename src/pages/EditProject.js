import React, { useState, useEffect } from 'react'
import Buttons from '../components/shared/Buttons'
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from "@material-ui/core/Modal";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useParams } from "react-router-dom";
import axios from 'axios';
import AOS from "aos";
import './EditProject.css';

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

export default function EditProject() {

    const initialValues = { name: '', in_progress: true, team_id: '' };
    const [project, setProject] = useState({initialValues});
    const [team, setTeam] = useState({});
    const [employees, setEmployees] = useState([]);
    const [role, setRole] = useState({ name: '' });
    const [roles, setRols] = useState([]);
    const [openChild, setOpenChild] = useState(false);
    const { id } = useParams();


    const addNewRole = (async () => {
        axios.post(`https://sleepy-wave-82877.herokuapp.com/api/roles`, role)
            .then(async role => {
                await getRols();
                handleCloseChild();
            }
            ).catch(err => console.log(err))

    });

    const handleOpenChild = () => {
        setOpenChild(true);
    };

    const handleChangeNestedModal = (e) => {
        setRole({ ...role, name: e.target.value });
    };

    const handleCloseChild = () => {
        setOpenChild(false);
    };

    const getRols = (async () => {
        let res = await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/roles`)
        try {
            setRols(res.data.data)
        } catch (err) {
            console.log(err)
        }
    });

    const getProject = (async () => {
        axios.get(`https://sleepy-wave-82877.herokuapp.com/api/projects/${id}`)
        .then(async res => {
            await setProject(res.data.data)
        })
        .catch(err => console.log(err))
    });

    const getTeam = (async () => {
        let res = await axios.post(`https://sleepy-wave-82877.herokuapp.com/api/teams/test/${project.team_id}`, {id})
        try {
            setTeam(res.data.data)
            setEmployees(res.data.data.employee)
            console.log('dddddddd', res.data.data.employee)
        } catch (err) {
            console.log(err)
        }
    });

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'name') {
            setProject({ ...project, [name]: value });
        } else {
            setProject({ ...project, [name]: checked });
        }
    }

    const editProject = async (e) => {
        e.preventDefault()
        let res = await axios.post(`https://sleepy-wave-82877.herokuapp.com/api/projects/${id}`, project)
        try {
            setProject(res.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const saveRole = async (employee_id, role_id) => {
        const data = {
            role : role_id,
            employee : employee_id
        }

        await axios.post(`https://sleepy-wave-82877.herokuapp.com/api/projects/roleToEmp/${id}`, data)
        .then(res => console.log(res))
        .catch(err => console.log(err))
        
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        AOS.init();
        AOS.refresh();
        await getProject()
        await getRols()
    }, []);

    useEffect(() => {
        if(project.name !== ''){
              getTeam()
        }
    }, [project]);

    return (
        <div className='Edit_Project'>
            <div className='Project_Name'>
                <h3 data-aos-duration="1000" data-aos="fade-down">{project.name}</h3>
            </div>
            <form className='Edit_Form'  data-aos-duration="1500" data-aos="fade-down">
                <label>Name
                    <input
                        className='input_p_name'
                        placeholder='ERP_Project V-02'
                        type="text"
                        defaultValue={project.name}
                        name='name'
                        onChange={handleChange}
                    />
                </label>
                <label>In_Progress
                    <Checkbox
                        defaultChecked
                        color="success"
                        name='in_progress'
                        onChange={handleChange}
                    />
                </label>
                <div>
                    <Buttons
                        onClick={editProject}
                        buttonStyle="btn--success--solid"
                        buttonSize="btn-lg"
                        text={"Save"}
                    />
                    <Buttons
                        onClick={() => console.log("TEST")}
                        buttonStyle="btn--danger--solid"
                        buttonSize="btn-lg"
                        text={"Delete"}
                    />
                </div>
            </form>
            <div className='Editing-Tables' data-aos-duration="1500" data-aos="flip-left">
                <div className='E_table'>
                    <div className='E_table_header'>
                        <h4><span>{
                            team?.name
                        }</span></h4>
                    </div>
                    <div className='E_list'>
                        {employees.map((e) => {
                            return (
                                <div key={e.id} className='dropdown' >
                                    <p> {e.first_name + ' ' + e.last_name}</p>
                                    <FormControl className='Roles' fullWidth>
                                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                        <Select
                                            id="outlined-select-role"
                                            label="Role"
                                            className='P-TextField'
                                            defaultValue={
                                                e.roleProject[0]?.role_id === undefined ? '' : e.roleProject[0]?.role_id
                                            } 
                                            size="small"
                                            color='success'
                                        > 
                                            {roles.map((role) => (
                                                <MenuItem value={role.id} key={role.id} onClick={()=> saveRole(e.id, role.id)}>
                                                    {role.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            )
                        })}
                    </div>
                    <Buttons
                        onClick={() => handleOpenChild()}
                        buttonStyle="btn--success--solid"
                        buttonSize="btn-lg"
                        text={"New Role"}
                    />
                </div>
                <Modal
                        open={openChild}
                        onClose={handleCloseChild}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
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
                    </Modal>
            </div>
        </div>
    )
}
