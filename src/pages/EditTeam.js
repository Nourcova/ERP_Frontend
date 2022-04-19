import React, { useState, useEffect } from "react";
import "./EditTeam.css";
import Buttons from "../components/shared/Buttons";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Box from "@mui/material/Box";

import Search from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 500,
  overflow: "auto",
  bgcolor: "background.paper",
  border: "10px solid #ffffff",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};
//* Tables
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F4F3F4",
    color: "#193C5E",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    paddingTop: 6,
    paddingBottom: 6,
    color: "#193C5E",
    fontWeight: "bold",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#F9F9F9",
}));
function addEmp(id, name, teams) {
  return id, name, teams;
}

export default function EditTeam() {
  const [team, setTeam] = useState({});
  const [emp, setEmp] = useState([]);
  const [proj, setProj] = useState([]);
  const [empWithteam, setWith] = useState([]);
  const [empNoteam, setNo] = useState([]);
  const [empToteam, setEmpToTeam] = useState("");
  const array = [];
  const { id } = useParams();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await getTeams();
    await getempWithteam();
    await getempNoteam();
  }, []);

  // const handleChangeAdd = (e) => {
  //   e.preventDefault();
  //   const { name, value } = e.target;
  //   setEmpToTeam({ ...empToteam, [name]: value });
  //   console.log(empNoteam);
  // };
  const getTeams = async () => {
    let res = await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/teams/${id}`);
    try {
      await setTeam(res.data.data);
      setEmp(res.data.data.employee);
      setProj(res.data.data.project);
      console.log("Em", res.data.data.employee);
      console.log("project", res.data.data.project);
      console.log("Teams", res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getempWithteam = async () => {
    let res = await axios.get(
      `https://sleepy-wave-82877.herokuapp.com/api/teams/employeesWith/team`
    );
    try {
      setWith(res.data.data);
      console.log("With", res.data.data);
      console.log("souad", res.data.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getempNoteam = async () => {
    let res = await axios.get(
      `https://sleepy-wave-82877.herokuapp.com/api/teams/employeesWithout/team`
    );
    try {
      setNo(res.data.data);
      console.log("No", res.data.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const empDelete = async (id) => {
    let res = await axios.get(
      `https://sleepy-wave-82877.herokuapp.com/api/teams/employeesWithout/remove/${id}`
    );
    try {
      getTeams();
      console.log("del", res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const projDelete = async (id) => {
    let res = await axios.post(
      `https://sleepy-wave-82877.herokuapp.com/api/teams/project/remove/${id}`
    );
    try {
      getTeams();
      console.log("del", res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteTeam = async () => {
    console.log("emp", emp);

    // let res = await axios.delete(`https://sleepy-wave-82877.herokuapp.com/api/teams/${id}`);
    // try {
    //   getTeams();
    //   console.log("del", res.data);
    // } catch (err) {
    //   console.log(err);
    // }
    if (emp.length === 0) {
      axios.delete(`https://sleepy-wave-82877.herokuapp.com/api/teams/${id}`);
      Swal.fire({
        title: "ERP System",
        text: "Successflully deleted !!",
        icon: "success",
        confirmButtonText: "OK",
      });
      // navigate("/dashboard/Admins");
    } else {
      Swal.fire({
        title: "Error!",
        text: "Not Empty team can not be deleted !",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  const empToTeam = async (employee_id) => {
    // console.log("onCkick ", team);
    const team_id = { id };
    const data = {
      team_id: team_id.id,
    };
    axios
      .post(`https://sleepy-wave-82877.herokuapp.com/api/teams/empToTeam/${employee_id}`, data)
      .then((res) => {
        console.log(res.data.data);
        getempNoteam();
        getempWithteam();
        getTeams();
      })
      .catch((err) => console.log(err));
  };

  // await axios
  //   .get(`https://sleepy-wave-82877.herokuapp.com/api/teams/${id}`)
  //   .then(async (res) => {
  //     array.push(res.data.data);
  //     await setTeam(res.data.data);
  //     await setEmp(res.data.data.employee);
  //     console.log("this is the state", team);
  //     console.log(res.data.data);
  //     console.log("this is the array", array);
  //     setLoading(false);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  const [teamStatus, setteamStatus] = useState("W_T");
  const handleChange = (e) => {
    setteamStatus(e.target.value);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const [openD, setOpenE] = useState(false);
  // const handleCloseE = () => {
  //   setOpenE(false);
  // };


  return (
    <div className="Edit-Team">
      <div className="Team-Name">
        {/* <h1>{JSON.stringify(params)}</h1> */}
        <h3>{team.name}</h3>
      </div>
      <div className="Editing-Tables">
        <div className="E_table">
          <h4>
            <PersonOutlineIcon /> Employees
          </h4>
          <div className="E_list">
          <div style={{ margin : '15px' }}>
            {emp.map((e) => {
              return (
                  <li key={e.id}>
                    {e.first_name}
                    <Buttons
                      onClick={() => empDelete(e.id)}
                      buttonStyle="btn--danger--solid"
                      buttonSize="btn-sn"
                      icon={<RemoveIcon />}
                    />
                  </li>
              );
            })}
            </div>
          </div>
        </div>
        <div className="E_table">
          <h4>
            <GroupsOutlinedIcon /> Projects
          </h4>
          <div className="E_list">
            <div style={{ margin : '15px' }}>
            {proj.map((e) => {
              return (
                  <li key={e.id}>
                    {e.name}
                    <Buttons
                      onClick={() => projDelete(e.id)}
                      buttonStyle="btn--danger--solid"
                      buttonSize="btn-sn"
                      icon={<RemoveIcon />}
                    />
                  </li>
              );
            })}
            </div>
          </div>
        </div>
      </div>
      <div className="Buttons">
          <Buttons
            onClick={() => deleteTeam(id)}
            buttonStyle="btn--danger--solid"
            buttonSize="btn-lg"
            text={"Delete Team"}
          />

        <Buttons
          onClick={handleOpen}
          buttonStyle="btn--success--solid"
          buttonSize="btn-lg"
          text={"Add Employee"}
        />
      </div>
      {/**Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Employees <Search />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="Modal-Buttons" id="modal-buttons">
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Employee Status
                </FormLabel>
                <RadioGroup
                  defaultValue={"W_T"}
                  row
                >
                  <FormControlLabel
                    sx={{ color: "#163a5e" }}
                    value="W_T"
                    name={"radio"}
                    onChange={handleChange}
                    control={<Radio id={"ra1"} color="success" />}
                    label="With_Teams "
                  />
                  <FormControlLabel
                    sx={{ color: "#163a5e" }}
                    value="N_T"
                    name={"radio"}
                    onChange={handleChange}
                    control={<Radio id={"ra2"} color="success" />}
                    label="Without_Teams"
                  />
                </RadioGroup>
              </FormControl>
              <Typography>
                <TableContainer
                  sx={{
                    "&::-webkit-scrollbar": { width: 1 },
                    "&::-webkit-scrollbar-track": { backgroundColor: "orange" },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "red",
                      borderRadius: 2,
                    },
                  }}
                >
                  {teamStatus === "W_T" ? (
                    <Table
                      style={{ overflow: "auto", height: "200px" }}
                      sx={{ minWidth: 400 }}
                      aria-label="contained table"
                    >
                      <TableHead>
                        <StyledTableCell
                          align="left"
                          style={{ paddingLeft: "10px", width: "30%" }}
                        >
                          {" "}
                          <PersonOutlineIcon /> &nbsp;
                          <span
                            style={{
                              fontWeight: "bold",
                              verticalAlign: "bottom",
                            }}
                          >
                            Name
                          </span>
                        </StyledTableCell>
                        <StyledTableCell align="left" style={{ width: "40%" }}>
                          <PersonOutlineIcon /> &nbsp;
                          <span
                            style={{
                              fontWeight: "bold",
                              verticalAlign: "bottom",
                            }}
                          >
                            Teams
                          </span>
                        </StyledTableCell>
                        <StyledTableCell align="left" style={{ width: "10%" }}>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {empWithteam.map((row) => (
                          <StyledTableRow key={row.id}>
                            <StyledTableCell
                              align="left"
                              style={{
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }}
                            >
                              {row.first_name}
                            </StyledTableCell>
                            <StyledTableCell
                              align="left"
                              style={{
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }}
                            >
                              {row.team.name}
                            </StyledTableCell>
                            <StyledTableCell
                              align="left"
                              style={{
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }}
                            >
                              <Buttons
                                onClick={() => empToTeam(row.id)}
                                buttonStyle="btn--success--solid"
                                buttonSize="btn-md"
                                icon={<AddCircleOutline />}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Table
                      id="W_T"
                      style={{ overflow: "auto", height: "200px" }}
                      sx={{ minWidth: 400 }}
                      aria-label="contained table"
                    >
                      <TableHead>
                        <StyledTableCell
                          align="left"
                          style={{ paddingLeft: "10px", width: "30%" }}
                        >
                          {" "}
                          <PersonOutlineIcon /> &nbsp;
                          <span
                            style={{
                              fontWeight: "bold",
                              verticalAlign: "bottom",
                            }}
                          >
                            Name
                          </span>
                        </StyledTableCell>
                        <StyledTableCell align="left" style={{ width: "10%" }}>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {empNoteam.map((row) => (
                          <StyledTableRow key={row.id}>
                            <StyledTableCell
                              align="left"
                              style={{
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }}
                            >
                              {row.first_name}
                            </StyledTableCell>

                            <StyledTableCell
                              align="left"
                              style={{
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }}
                            >
                              <Buttons
                                onClick={() => empToTeam(row.id)}
                                buttonStyle="btn--success--solid"
                                buttonSize="btn-md"
                                icon={<AddCircleOutline />}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TableContainer>
              </Typography>{" "}
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
