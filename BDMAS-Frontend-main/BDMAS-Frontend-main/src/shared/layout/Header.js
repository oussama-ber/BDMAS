import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
//ui material.
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
//bootstrap
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/Nav";

// components
import "./Header.css";
import { AuthContext } from "../context/auth-context";
import { Menu, MenuItem } from "@mui/material";
//icons
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#2E2E38",
    },
  },
});
const Header = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorElForm, setAnchorElForm] = useState(null);
  const [anchorElProject, setAnchorElProject] = useState(null);
  const openForm = Boolean(anchorElForm);
  const openProject = Boolean(anchorElProject);
  //open/close profile menu
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  //open/close form/menu
  const handleFormClick = (event) => setAnchorElForm(event.currentTarget);
  const handleFormClose = () => setAnchorElForm(null);

  //open/close project/menu
  const handleProjectClick = (event) => setAnchorElProject(event.currentTarget);
  const handleProjectClose = () => setAnchorElProject(null);

  // functions to render TO CHANGE
  const myprojectsHandler = () => history.push(`/${auth.userId}/projects`);
  const profileHandler = () => history.push(`/profile`);
  const dashboardHandler = () => history.push(`/user/dashboard`);
  const allProjectsHandler = () => history.push(`/projects`);
  const createProjectHandler = () => history.push(`/projects/new`);
  const allUsersListHandler = () => history.push(`/users`);
  const createFormHandler = () => history.push("/question-form/new");
  const formsHandler = () => history.push("/forms");
  const formsManagementHandler = () => history.push("/createv2");
  const comparisonHandler = () => history.push('/comparison');
  // console.log(auth);
  // console.log("auth.image" + auth.image);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              href="/"
            >
              <img
                src="https://assets.ey.com/content/dam/ey-sites/ey-com/en_ph/generic/logos/ey-white-logo.png"
                alt="EY_logo"
                className="imgg"
              />
            </IconButton>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              mt={2.5}
              ml={-3}
            >
              <Grid item mb={-0.5}>
                <Typography variant="button" sx={{ flexGrow: 1 }}>
                  EY Digital Maturity
                </Typography>
              </Grid>
              <Grid item mt={-0.5}>
                <Typography variant="button" sx={{ flexGrow: 1 }}>
                  Assessment Tool
                </Typography>
              </Grid>
            </Grid>

            {!auth.isLoggedIn && (
              <Button color="inherit" href="/authenticate">
                Login
              </Button>
            )}
            {auth.isLoggedIn && (
              <React.Fragment>
                {/* USER DASHBOARD */}
                <Button
                  variant="primary"
                  color="#FFFFFF"
                  onClick={dashboardHandler}
                >
                  Dashboard
                </Button>

                {/* Project mangement */}
                {
                  <Button
                    variant="primary"
                    color="#FFFFFF"
                    onClick={allProjectsHandler}
                  >
                    Project
                  </Button>
                }
                {auth.role === "Admin" && (
                  <Button
                    variant="primary"
                    color="#FFFFFF"
                    onClick={allUsersListHandler}
                  >
                    Users
                  </Button>
                )}
                {auth.role === "Admin" && (
                  <Button
                    variant="primary"
                    color="#FFFFFF"
                    onClick={comparisonHandler}
                  >
                    Comparison
                  </Button>
                )}
                {/* Form management */}
                {
                  <React.Fragment>
                    <Button
                      variant="primary"
                      color="#FFFFFF"
                      onClick={handleFormClick}
                      endIcon={<KeyboardArrowDownIcon />}
                    >
                      Form
                    </Button>
                    <Menu
                      anchorEl={anchorElForm}
                      id="form-menu"
                      open={openForm}
                      onClose={handleFormClose}
                      onClick={handleFormClose}
                    >
                      <MenuItem onClick={formsHandler}>Forms</MenuItem>
                      <Divider />
                      <MenuItem onClick={formsManagementHandler}>
                        Create
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                }

                {/* Profil menu */}

                <IconButton onClick={handleClick} sx={{ color: "#FFE600" }}>
                  <Avatar
                    src={`http://localhost:5000/${auth.image}`}
                    alt={auth.role}
                  />

                  {/* <AccountCircleIcon fontSize="large" /> */}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                >
                  <MenuItem onClick={profileHandler}>Profile</MenuItem>
                  <MenuItem onClick={myprojectsHandler}>My projects</MenuItem>
                  <Divider />
                  <MenuItem onClick={auth.logout}>
                    <Logout fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Box>
  );
};
export default Header;
