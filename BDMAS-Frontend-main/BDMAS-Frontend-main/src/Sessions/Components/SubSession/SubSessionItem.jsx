import React, { useState } from "react";
//MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";

//icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
//component
import UpdateSubSessionDialog from "./UpdateDialog/UpdateSubSessionDialog";
import ConfirmationDialog from "../../../projects/components/Dialogs/ConfirmationDialog";

const SubSessionItem = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [makeSure, setMakeSure] = useState(false);
  const [makeSureStart, setMakeSureStart] = useState(false);
  // menu management
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  // update Dialog managment
  const openUpdateHandler = () => {
    setOpenUpdateDialog(true);
    handleClose();
  };
  const closeUpdateHandler = () => setOpenUpdateDialog(false);

  //make sure dialog (update)
  const openMakeSureDialog = () => {
    setMakeSure(true);
    handleClose();
  };
  const closeMakeSureDialog = () => setMakeSure(false);
  const dialogTitle = "Delete Confirmation";
  const dialogContent = `Are you sure you want to proceed with this action?
    Warning: This cannot be undone. `;
  //make sure dialog (Start Axe)
  const openMakeSureStartDialog = () => {
    setMakeSureStart(true);
    handleClose();
  };
  const closeMakeSureStartDialog = () => setMakeSureStart(false);
  const dialogTitleStart = "Start Confirmation";

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
                    component="div"
                    color="white"
                  >
                    {props.subSession.title}
                  </Typography>
                </Grid>
                <Grid item lg={4}>
                  <Chip
                    label={
                      <Typography variant="body1">
                        {props.subSession.state}
                      </Typography>
                    }
                    color={
                      props.subSession.state === "Pending"
                        ? "warning"
                        : props.subSession.state === "Closed"
                        ? "error"
                        : "success"
                    }
                  />
                </Grid>
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
                  style={{ color: "#23232F" }}
                  color="#23232F"
                >
                  <MenuItem
                    onClick={() => {
                      props.openSubSessionDetailedDialog(props.subSession);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <InfoOutlinedIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <Typography variant="inherit">Info</Typography>
                  </MenuItem>
                  <MenuItem onClick={openMakeSureStartDialog}>
                    <ListItemIcon>
                      <SendOutlinedIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <Typography variant="inherit">Start</Typography>
                  </MenuItem>
                  <MenuItem onClick={openUpdateHandler}>
                    <ListItemIcon>
                      <ModeEditIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Update</Typography>
                  </MenuItem>
                  <MenuItem onClick={openMakeSureDialog}>
                    <ListItemIcon>
                      <DeleteOutlineIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography variant="inherit">Delete</Typography>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            }
          />
          <CardActionArea
            onClick={() => props.openSubSessionDetailedDialog(props.subSession)}
          >
            <CardContent>
            <Grid container direction="row">
                <Typography
                  variant="body2"
                  color="white"
                  sx={{ marginRight: 3 }}
                >
                  Start Date : {props.subSession.startDate.stringDate}
                </Typography>
                <Typography variant="body2" color="white">
                  End Date : {props.subSession.endDate.stringDate}
                </Typography>
              </Grid>
              <Grid container direction="row" alignItems="center" spacing={2} mt={.1}>
                <Grid item>
                  <Typography variant="body2" color="white">
                    Moderator :
                  </Typography>
                </Grid>
                <Grid item>
                  <Tooltip
                    title={
                      <Typography>
                        {props.subSession.creatorData.userName} (
                        {props.subSession.creatorData.userEmail})
                      </Typography>
                    }
                  >
                    <Avatar
                      src={`http://localhost:5000/${props.subSession.creatorData.userImage}`}
                      alt={props.subSession.creatorData.userName}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
              {/* <Typography color="white">{`#of bank members: ${props.subSession.bankMembers.length}`}</Typography> */}
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <UpdateSubSessionDialog
        subSesionID={props.subSession._id}
        sessionId={props.sessionId}
        open={openUpdateDialog}
        onClose={closeUpdateHandler}
        title={props.subSession.title}
        description={props.subSession.description}
        bankMembers={props.subSession.bankMembers}
        state={props.subSession.state}
        startDate={props.subSession.startDate}
        endDate={props.subSession.endDate}
        onRefresh={props.onRefresh}
      />
      <ConfirmationDialog
        open={makeSure}
        title={dialogTitle}
        content={dialogContent}
        onClose={closeMakeSureDialog}
        onConfirm={() =>
          props.deactivateSubSessionHandler(props.subSession._id)
        }
      />
      <ConfirmationDialog
        open={makeSureStart}
        title={dialogTitleStart}
        content={dialogContent}
        onClose={closeMakeSureStartDialog}
        onConfirm={() => props.startSubSession(props.subSession._id)}
      />
    </React.Fragment>
  );
};
export default SubSessionItem;
