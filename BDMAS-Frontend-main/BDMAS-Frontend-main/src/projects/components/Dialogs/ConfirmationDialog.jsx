import React from "react";
//MUI
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
//Components
import WhiteModeButton from "../../../shared/UIElements/WhiteModeButton";

const ConfirmationDialog = (props) => {
  const onProceed = () => {
    console.log(`from confirmation dialog: ${props.sessionID}`);
    props.onConfirm();
    props.onClose();
    // props.onAlert();
  };
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>
        {props.title ? props.title : "Action Confirmation"}

        {props.sessionTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.content
            ? props.content
            : "Are you sure you want to proceed with this action?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <WhiteModeButton onClick={props.onClose}>Cancel</WhiteModeButton>
        <WhiteModeButton onClick={onProceed}>Proceed</WhiteModeButton>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmationDialog;
