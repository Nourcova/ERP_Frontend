import React, { useState, useEffect } from 'react';
import Search from '../components/shared/Search';
import Buttons from '../components/shared/Buttons'
import Loading from '../components/shared/Loading'
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from "aos";
import './reports.css';

function Reports(props) {

    const [employees, setEmployees] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);

    const getEmployees = async () => {
        await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/employees`)
            .then(res => {
                setEmployees(res.data.data); 
                console.log(res.data.data)
            })
            .finally(() => {
                setLoading(false)
            })
            .catch(err => console.log(err))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        AOS.init();
        AOS.refresh();
        await getEmployees();
    }, []);

    return (
        <div className='reports'>

            <div className='d-flex ' style={{marginLeft:'30px'}}>
                <Search onChange={(e) => setSearchValue(e.target.value)} placeholder="Search for a employee" />
            </div>

                <div className='cards'>
                    {employees.filter((val) => {
                        if (searchValue === '') {
                            return val
                        } else if ((val.first_name.toLowerCase().includes(searchValue.toLowerCase())) || (val.last_name.toLowerCase().includes(searchValue.toLowerCase()))) {
                            return val
                        }
                    }).map((employee, i) => (
                        <>
                            {loading ?
                                <Loading />
                                :
                                <div className="row2-container">
                                    <div className="box green">
                                    <img src={`http://127.0.0.1:8000/image/${employee.image}`} alt='' />
                                    <h4>{employee.first_name + ' ' + employee.last_name}</h4>
                                    <p>{employee.team?.name}</p>
                                    <div className="button_table">
                                        <Link to={`/dashboard/reports/${employee.id}/reportData/kpis`}>
                                            <Buttons
                                                onCkick={() => console.log("TEST")}
                                                buttonStyle="btn--success--solid"
                                                buttonSize="btn-sm"
                                                text="KPI"
                                            />
                                        </Link>
                                        <Link to={`/dashboard/reports/${employee.id}/reportData/projects`}>
                                            <Buttons
                                                onCkick={() => console.log("TEST")}
                                                buttonStyle="btn--success--solid"
                                                buttonSize="btn-sm"
                                                text="Projects"
                                            />
                                        </Link>
                                        <Link to={`/dashboard/reports/${employee.id}/reportGraph`}>
                                            <Buttons
                                                onCkick={() => console.log("TEST")}
                                                buttonStyle="btn--success--solid"
                                                buttonSize="btn-sm"
                                                text="Graph"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                    }
                        </>
                    ))}
                </div>

           
        </div>
    )
}

export default Reports
