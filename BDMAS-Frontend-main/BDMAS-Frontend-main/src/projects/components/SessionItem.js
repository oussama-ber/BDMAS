import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";

// ui material
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";

//icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Components
import ConfirmationDialog from "./Dialogs/ConfirmationDialog";

const SessionItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [makeSure, setMakeSure] = useState(false);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  //make sure dialog
  const openMakeSureDialog = () => {
    setMakeSure(true);
  };
  const closeMakeSureDialog = () => setMakeSure(false);
  const dialogTitle = "Delete Confirmation";
  const dialogContent = `Are you sure you want to proceed with this action?
    Warning: This cannot be undone. `;
  return (
    <React.Fragment>
      <Grid item key={props.index} lg={4}>
        <Card sx={{ backgroundColor: "#3A3A4A" }}>
          <CardHeader
            title={
              <Grid container direction="row">
                <Grid item lg={8}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    component="div"
                    color="white"
                  >
                    {props.title}
                  </Typography>
                </Grid>
                <Grid item lg={4}>
                  <Chip
                    label={
                      <Typography variant="body1"> {props.state} </Typography>
                    }
                    color={
                      props.state === "Pending"
                        ? "warning"
                        : props.state === "Closed"
                        ? "error"
                        : "success"
                    }
                  />
                </Grid>
              </Grid>
            }
            subheader={
              <Grid container direction="row">
                <Typography
                  variant="body2"
                  color="white"
                  sx={{ marginRight: 3 }}
                >
                  StartDate : {props.startDate}
                </Typography>
                <Typography variant="body2" color="white">
                  EndDate : {props.endDate}
                </Typography>
              </Grid>
            }
            action={
              <React.Fragment>
                <IconButton
                  aria-label="settings"
                  sx={{
                    color: "#FFE600",
                    ":hover": {
                      bgcolor: "#FFE600",
                      color: "#23232F",
                    },
                  }}
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  onClose={handleClose}
                  open={open}
                  style={{ color: "#FFE600" }}
                  color="#FFE600"
                >
                  <MenuItem onClick={() => props.enterSession(props.id)}>
                    <ListItemIcon>
                      <InfoOutlinedIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <Typography variant="inherit">Info</Typography>
                  </MenuItem>
                  {/* <MenuItem>
                    <ListItemIcon>
                      <ModeEditIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <Typography variant="inherit">Update</Typography>
                  </MenuItem> */}
                  <MenuItem onClick={() => openMakeSureDialog(props.id)}>
                    <ListItemIcon>
                      <DeleteOutlineIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography variant="inherit">Delete</Typography>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            }
          />
          <CardActionArea onClick={() => props.enterSession(props.id)}>
            <CardContent>
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="body2" color="white">
                    Created By :
                  </Typography>
                </Grid>
                <Grid item>
                  <Avatar src={`http://localhost:5000/${props.userImage}`} />
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
          {/* <CardActions>
                <Button
                  sx={{
                    borderRadius: 0,
                    borderColor: "#3A3A4A ",
                    backgroundColor: "#FFE600",
                  }}
                  color="inherit"
                  variant="outlined"
                  // onClick={openSessionDialog}
                  onClick={() => goToSessionDetails(session._id)}
                  //   onClick={() => openDetailViewHandler(project.id)}
                >
                  Details
                </Button>
              </CardActions> */}
        </Card>
      </Grid>
      <ConfirmationDialog
        open={makeSure}
        title={dialogTitle}
        content={dialogContent}
        sessionID={props.id}
        sessionTitle={props.title}
        onClose={closeMakeSureDialog}
        onConfirm={() => props.onDeleteItem(props.id)}
        onAlert={props.onDeleteProjectAlert}
      />
    </React.Fragment>
  );
};

export default SessionItem;
