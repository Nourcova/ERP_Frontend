import React, {useState} from 'react'

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

function AddEmployee() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [openEmployee, setOpenEmployee] = useState(false); //for add dialog

    const [employee, setEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",

    })

     //============> When Filling the Fields
     const handleChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setEmployee({ ...employee, [e.target.name]: value })
        console.log(employee);
    }

     //============> Add Employee
     const handleSubmit = () => {
        const data = {
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            phone: employee.phone,
            password: employee.password,
        }
        axios.post("https://sleepy-wave-82877.herokuapp.com/api/employees", data).then(() => {
            console.log("Data")
            // getAllEmployees()
        }
        )
    }
    

    //============> For Add Employee Dialog
    const handleClickOpenEmployee = () => {
        setOpenEmployee(true);
    }
    const handleClickCloseEmployee = () => {
        setOpenEmployee(false);
        setEmployee("");
    }

    return (
        <div>AddEmployee</div>
    )
}

export default AddEmployee