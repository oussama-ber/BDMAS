import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//ui material.
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";

// components

import { Menu, MenuItem } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2E2E38",
    },
  },
});
const Header = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const allUsersListHandler = () => {
    history.push(`/users`);
  };
  const AddQuestion = () => {
    history.push("/question-form/new");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      
        <AppBar position="static" color="primary">
          <Toolbar>
            {/* <img
              src="https://assets.ey.com/content/dam/ey-sites/ey-com/en_ph/generic/logos/ey-white-logo.png"
              alt="EY_logo"
              className="imgg"
            /> */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Form Management
            </Typography>
            {
              <React.Fragment>
                <Button
                  variant="primary"
                  color="#FFFFFF"
                  onClick={allUsersListHandler}
                >
                  Form Header
                </Button>
                <Button
                  variant="primary"
                  color="#FFFFFF"
                  onClick={allUsersListHandler}
                >
                  Form Qeustion
                </Button>
                <Button
                  variant="primary"
                  color="#FFFFFF"
                  onClick={allUsersListHandler}
                >
                  Delete Question
                </Button>
              </React.Fragment>
            }
          </Toolbar>
        </AppBar>
     
    </Box>
  );
};
export default Header;
