import React from "react";

//MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { List, ListItem, ListItemText } from "@mui/material";


const SessionDialogForms = (props) => {

    // console.log('from diagram   :'+ props.items)
  return (
    <Dialog open={props.open}>
      <DialogTitle>Session Forms</DialogTitle>
      <DialogContent>
        <DialogContentText> see memebers</DialogContentText>
          {/* <p>{props.items}</p> */}
        <List>
          {props.items.map((item, index) => {
            return (
              <ListItem key={index}>
                <ListItemText>{JSON.parse(item.form).title} </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeForms}>close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default SessionDialogForms;
