import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import UserList from "../components/UserList";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { NavLink } from "react-router-dom";
//ui material
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import { AuthContext } from "../../shared/context/auth-context";
import Breadcrumbs from "@mui/material/Breadcrumbs";
//dialog
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
//icons
import AddIcon from "@mui/icons-material/Add";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// select
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Users = () => {
  const auth = useContext(AuthContext);
  const [loadedUsers, setLoadedUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [deleteBool, setDeleteBool] = useState(true);

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const handleEmail = (event) => setEmail(event.target.value);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // TO CHANGE
  const userId = useParams().userId;

  const createUser = async () => {
    try {
      console.log("role ", role);
      await sendRequest(
        "http://localhost:5000/api/users/user/createuser",
        "POST",
        JSON.stringify({ email, role }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log("make it to close the dialog");
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const activateUser = () => {
    console.log(loadedUsers);
    setLoadedUsers((previewData) =>
      previewData.filter((item) => item.activated === true)
    );
    setDeleteBool(!deleteBool);
  };
  console.log(loadedUsers);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedUsers(responseData.users);
        console.log(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, userId, deleteBool]);

  const userDeletedHandler = (deletedUserId) => {
    setLoadedUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== deletedUserId)
    );
  };
  const breadcrumbs = [
    <NavLink
      style={{ textDecoration: "none" }}
      underline="hover"
      key="1"
      color="white"
      href="/user/dashboard"
      to="/user/dashboard"
    >
      <Typography color="white">Dashboard</Typography>
    </NavLink>,
    <Typography key="2" color="#FFE600">
      Users
    </Typography>,
  ];
  return (
    <React.Fragment>
      <Breadcrumbs
        color="white"
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>

      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      <Container maxWidth="false">
        <Container maxWidth="false">
          <Typography
            sx={{ mb: 6, mt: 2 }}
            variant="h3"
            component="div"
            color="#FFE600"
          >
            Users List
          </Typography>

          <Box
            width="auto"
            height="auto"
            alignItems="center"
            justifyContent="center"
            marginTop={7}
          >
            {!isLoading && loadedUsers && (
              <UserList
                items={loadedUsers}
                activateUser={activateUser}
                onCreateUser={handleClickOpen}
              />
            )}

            <Dialog
              open={open}
              onClose={handleClose}
              fullWidth
              sx={{ borderRadius: 0 }}
            >
              <DialogTitle>Create User</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To subscribe to this website, please enter your email address
                  here. We will send updates occasionally.
                </DialogContentText>

                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Email Address"
                  type="email"
                  variant="standard"
                  onChange={handleEmail}
                />

                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Role
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={role}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"Consultant"}>Consultant</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button
                  sx={{
                    borderRadius: 0,
                    borderColor: "#3A3A4A ",
                    backgroundColor: "#FFE600",
                  }}
                  color="inherit"
                  variant="outlined"
                  endIcon={<DoDisturbAltIcon />}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    borderRadius: 0,
                    borderColor: "#3A3A4A ",
                    backgroundColor: "#FFE600",
                  }}
                  color="inherit"
                  variant="outlined"
                  endIcon={<AddIcon />}
                  onClick={createUser}
                >
                  Create
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Container>
      </Container>
    </React.Fragment>
  );
};

export default Users;
