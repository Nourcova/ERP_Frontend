// import * as React from 'react';
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Buttons from "../components/shared/Buttons";
import EditIcon from "@mui/icons-material/Edit";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleIcon from "@mui/icons-material/People";
import Loading from '../components/shared/Loading'
import { Link } from "react-router-dom";
import "./teams.css";
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/core/styles";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import Search from "../components/shared/Search";
import AOS from "aos";

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
    backgroundColor: "#8ab038",
    color: "#ededed",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    paddingTop: 6,
    paddingBottom: 6,
    color: "var(--textcolor1)",
    transition: '.5s',
    textAlign: 'center'
  },
}));
// function createData(name, id, id) {
//   return { name, id, id };
// }

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#F9F9F9",
}));

function Teams() {
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [openChild, setOpenChild] = useState(false);
  const [loading, setLoading] = useState(true)


  const handleCloseChild = () => {
    setOpenChild(false);
  };

  const [addTeam, setAddTeam] = useState({
    name: "",
  });

  const postdata = () => {
    const url = `https://sleepy-wave-82877.herokuapp.com/api/teams/add`;
    axios.post(url, addTeam).then((res) => {
      getAllTeams()
      handleCloseChild();
      console.log(res);
    });
  };

  useEffect(() => {
    AOS.init();
    AOS.refresh();
    getAllTeams();
  }, []);
  async function getAllTeams() {
    axios
      .get("https://sleepy-wave-82877.herokuapp.com/api/teams")
      .then((res) => {
        setTeams(res.data.data);
        console.log(res.data.data);
      })
      .finally(() => {
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function getTeamById(t_id) {
    axios.get(`https://sleepy-wave-82877.herokuapp.com/api/teams/${t_id}`).then((res) => {
      setTeam(res.data.data);
      console.log(res.data.data);
    });
  }
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

  const handleOpenChild = () => {
    setOpenChild(true);
  };

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setAddTeam({ name: value });
    console.log(addTeam);
  };

  return (
    <div className="teams">
      <div className="d-flex justify-content-around">
        <Search
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search for a team"
        />
        <Buttons
          onClick={() => handleOpenChild()}
          buttonStyle="btn--success--solid"
          buttonSize="btn-lg"
          text={"Add Team"}
        />
      </div>

      <div
        className="teams_table"
        style={{
          display: "flex",
          position:'relative'
        }}
      >
        <TableContainer >
          <Table sx={{ minWidth: 400 }} aria-label="contained table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  align="left"
                  style={{ paddingLeft: "50px", width: "25%" }}
                >
                  <GroupsIcon /> &nbsp;
                  <span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>
                    Team
                  </span>
                </StyledTableCell>
                <StyledTableCell align="left" style={{ width: "25%" }}>
                  <PeopleIcon /> &nbsp;
                  <span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>
                    Employees Number
                  </span>
                </StyledTableCell>
                <StyledTableCell align="left" style={{ width: "25%" }}>
                  <AccountTreeOutlinedIcon className="icon" /> &nbsp;
                  <span style={{ fontWeight: "bold", verticalAlign: "bottom" }}>
                    Projects Number
                  </span>
                </StyledTableCell>
                <StyledTableCell align="left" style={{ width: "25%" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </StyledTableCell>
                {/* <StyledTableCell align="left"></StyledTableCell> */}
              </TableRow>
            </TableHead>
            {loading ?
              <Loading />
              :
              <TableBody>
                {teams
                  .filter((val) => {
                    if (searchValue === "") {
                      return val;
                    } else if (
                      val.name.toLowerCase().includes(searchValue.toLowerCase())
                    ) {
                      return val;
                    }
                  })
                  .map((team) => (
                    <StyledTableRow className="main_row" key={team.id}>
                      <StyledTableCell
                        align="left"
                        style={{ paddingTop: "12px", paddingBottom: "12px" }}
                      >
                        {team.name}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="left">
                        {team.employee.length}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="left">
                        {team.project.length}
                      </StyledTableCell>
                      <StyledTableCell align="left" style={{ padding: 0 }}>
                        <div className="button_table">
                          <Link to={"/dashboard/Teams/" + team.id}>
                            <Buttons
                              onCkick={() => getTeamById(team.id)}
                              buttonStyle="btn--success--solid"
                              buttonSize="btn-md"
                              icon={<EditIcon />}
                            />
                          </Link>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            }
          </Table>
        </TableContainer>

        <Modal
          open={openChild}
          onClose={handleCloseChild}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, width: 200 }}>
            <form className='form-role'>
              <TextField
                onChange={handleChange}
                id="Team_name"
                size="small"
                label="Team name"
                variant="outlined"
                color='success' />
              <div className='form-button'>
                <Buttons
                  type='button'
                  onClick={() => postdata()}
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
  );
}

export default Teams;
