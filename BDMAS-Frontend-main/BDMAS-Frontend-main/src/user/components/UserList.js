import React, { useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import UserItem from "./UserItem";
// ui material
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
//table ui
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
//icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";
import ConfirmationDialog from "../../projects/components/Dialogs/ConfirmationDialog";
// update file DONE, workds: TODO
const UserList = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [deletee, setDelete] = useState(props.items);
  const [searchData, setSearchData] = useState("");

  console.log(deletee);
  const deactivateUser = async (userID) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/users/user/deactivate/${userID}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      setDelete((prevData) =>
        prevData.filter((item) => item.activated === true)
      );
      props.activateUser();
    } catch (err) {}
  };

  if (props.items.length == 0) {
    return (
      <div className="user-list center">
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 7 }}
        >
          <Typography variant="h4" gutterBottom component="div" color="white">
            No Users found. Maybe create one?
          </Typography>
          <WhiteModeButton icon="Add" onClick={props.onCreateUser}>
            Create User
          </WhiteModeButton>
        </Grid>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        spacing={8}
        sx={{ marginBottom: 2 }}
      >
        <Grid item lg={7}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 400,
              marginBottom: 2,
            }}
          >
            <form>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search User"
                inputProps={{ "aria-label": "search google maps" }}
                value={searchData}
                onChange={(event) => setSearchData(event.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    ev.preventDefault();
                  }
                }}
              />
            </form>
          </Paper>
        </Grid>
        <Grid item lg={5}>
          <Box display="flex" justifyContent="flex-end">
            <WhiteModeButton icon="Add" onClick={props.onCreateUser}>
              Create User
            </WhiteModeButton>
          </Box>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ backgroundColor: "#F6F6FA" }}>
        <Table aria-label="simple table" size="sm">
          <TableHead sx={{ bgcolor: "#2E2E38" }}>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6" color="#F6F6FA">
                  #
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6" color="#F6F6FA">
                  Name
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6" color="#F6F6FA">
                  Email
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6" color="#F6F6FA">
                  Role
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6" color="#F6F6FA">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.items &&
              props.items
                .filter((item) => item.activated === true)
                .filter((item) => item.name.toLowerCase().includes(searchData))
                .length == 0 && (
                
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="h5">No user with this name</Typography>
                  </Grid>
              
              )}
            {props.items &&
              props.items
                .filter((item) => item.activated === true)
                .filter((item) => item.name.toLowerCase().includes(searchData))
                .map((user, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor: "#EAEAF2",
                      }}
                    >
                      <TableCell
                        key={index}
                        component="th"
                        scope="row"
                        onClick={() => console.log("first")}
                        align="center"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell key={index} align="left">
                        <Grid
                          container
                          direction="row"
                          display="flex"
                          spacing={1}
                          alignItems="center"
                        >
                          <Grid item>
                            <Avatar
                              src={`http://localhost:5000/${user.image}`}
                              alt={user.name}
                            />
                          </Grid>
                          <Grid item>
                            <Typography variant="h6" component="div">
                              {user.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell key={index} align="left">
                        <Typography variant="h6" component="div">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell key={index} align="left">
                        <Typography variant="h6" component="div">
                          {user.role}
                        </Typography>
                      </TableCell>
                      <TableCell key={index} align="left">
                        <IconButton
                          color="error"
                          variant="outlined"
                          onClick={() => deactivateUser(user._id)}
                          size="small"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default UserList;
