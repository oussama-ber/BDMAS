import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";

// ui material
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import AvatarGroup from "@mui/material/AvatarGroup";
import ListItemIcon from "@mui/material/ListItemIcon";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import InputBase from "@mui/material/InputBase";
import CardActionArea from "@mui/material/CardActionArea";
//icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// Components

const CProjectItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [makeSure, setMakeSure] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  //make sure dialog
  const openMakeSureDialog = () => setMakeSure(true);
  const closeMakeSureDialog = () => setMakeSure(false);
  const dialogTitle = "Delete Confirmation";
  const dialogContent = `Are you sure you want to proceed with this action?
    Warning: This cannot be undone. `;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Grid item key={props.index} lg={4}>
        <Card key={props.index} sx={{ backgroundColor: "#2E2E38" }}>
          <CardHeader
            avatar={
              <Avatar
                src={`http://localhost:5000/${props.image}`}
                alt={props.title}
              />
            }
            action={
              <React.Fragment>
                <IconButton
                  aria-label="settings"
                  sx={{
                    color: "#FFE600",
                    ":hover": {
                      bgcolor: "#FFE600", // theme.palette.primary.main
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
                  style={{ color: "#23232F" }}
                  color="#23232F"
                >
                  <MenuItem onClick={() => props.enterProject(props.id)}>
                    <ListItemIcon>
                      <InfoOutlinedIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <Typography variant="inherit">Info</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => openMakeSureDialog()}>
                    <ListItemIcon>
                      <DeleteOutlineIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography variant="inherit">Delete</Typography>
                  </MenuItem>
                </Menu>
              
              </React.Fragment>
            }
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
                  sx={{ marginRight: 2 }}
                >
                  Start Date : {props.startDate}
                </Typography>
                <Typography variant="body2" color="white">
                  End Date : {props.endDate}
                </Typography>
              </Grid>
            }
          />
          <CardActionArea onClick={() => props.enterProject(props.id)}>
            <CardContent sx={{ paddingX: 4 }}>
              <Typography
                variant="body2"
                color="white"
                sx={{ marginBottom: 1 }}
              >
                ADDRESS : {props.address}
              </Typography>
              {/* IMPORTANT */}
              {/* <Typography variant="body2" color="#AFADAD">
                          DESCRIPTION : {project.description}
                        </Typography> */}

              <Grid
                container
                direction="row"
                alignItems="center"
                sx={{ mt: 2, mb: 2 }}
              >
                <Typography variant="body2" color="white">
                  Moderator :
                </Typography>
                <Tooltip
                  title={
                    <Typography>
                      {props.creatorName} ({props.creatorEmail}){" "}
                    </Typography>
                  }
                >
                  <Avatar
                    sx={{ marginX: 2 }}
                    alt={props.creatorName}
                    src={`http://localhost:5000/${props.creatorImage}`}
                  />
                </Tooltip>
              </Grid>
              {props.colleagues.length !== 0 ? (
                <Grid container direction="row" alignItems="center">
                  <Typography variant="body2" color="white">
                    Contributors :
                  </Typography>

                  <AvatarGroup max={4} sx={{ marginX: 2 }}>
                    {props.colleagues.map((item, index) => {
                      return (
                        <Avatar
                          key={index}
                          alt={item.name}
                          src={`http://localhost:5000/${item.image}`}
                        />
                      );
                    })}
                  </AvatarGroup>
                </Grid>
              ) : (
                <Typography
                  variant="body2"
                  color="#AFADAD"
                  sx={{ mt: 4, mb: 1 }}
                >
                  No Contributors.
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </React.Fragment>
  );
};

export default CProjectItem;
