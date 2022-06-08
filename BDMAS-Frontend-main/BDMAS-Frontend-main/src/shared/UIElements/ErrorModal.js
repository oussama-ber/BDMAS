import React, { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// Components 
import WhiteModeButton from "../UIElements/WhiteModeButton";
const ErrorModal = (props) => {
  const [open, setOpen] = React.useState(props.open);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={props.error}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"An Error Occurred!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.error}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <WhiteModeButton onClick={props.onClear} >Okey</WhiteModeButton>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;
