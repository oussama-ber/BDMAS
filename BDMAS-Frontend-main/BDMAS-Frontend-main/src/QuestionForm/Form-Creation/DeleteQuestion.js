import React, { useState } from "react";
// material ui.
import { Button, List, ListItem, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

//dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";

const DeleteQuestion = (props) => {
  const [enteredIndexQuestion, setEnteredQuestionIndex] = useState("");
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [startEditing, setStartEditing] = useState(false);
  const [questions, setQuestions] = useState(props.form.elements);
  const [deleteDialog, setDeleteDialog] = useState(false);

  //Get question index. // TESTING
  const questionChangeHandler = (event) => {
    event.preventDefault();
    setEnteredQuestionIndex(event.target.value);
    console.log(typeof event.target.value);
    changeDisabledHandler(event.target.value);
  };
  // delete the question using the index
  const submitHandler = (event) => {
    event.preventDefault();
    //Delete question
    console.log(+enteredIndexQuestion);
    props.onDelete(+enteredIndexQuestion );
    handleClose();
    setEnteredQuestionIndex("");
    setStartEditing(false);
  };

  const deleteee = (index) => {
    console.log(+index )
    props.onDelete(+index  );
  };
  // open Dialog
  const handleClickOpen = () => {
    setDeleteDialog(true);
  };
  //close Dialog
  const handleClose = () => {
    setDeleteDialog(false);
  };

  const startEditingHandler = () => {
    setStartEditing(!startEditing);
  };

  const changeDisabledHandler = (input) => {
    if (!input || input.length === 0) {
      setIsDisabledButton(true);
    } else {
      setIsDisabledButton(false);
    }
  };

  const paperStyle = {
    padding: 20,
    // width: 600,
    margin: "20px auto",
  };
  return (
    <React.Fragment>
      <ListItemButton
        onClick={startEditingHandler}
        style={{ lineHeight: 33, margin: 0, padding: 20 }}
        selected={startEditing}
      >
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="DELETE QUESTION" />
      </ListItemButton>
      {startEditing && (
        <form onSubmit={submitHandler}>
           <Typography
            variant="h6"
            gutterBottom
            component="div"
            align="center"
            sx={{ marginTop: 2 }}
          >
           DELETE BY INDEX
          </Typography>
          <TextField
            element="input"
            id="question"
            type="number"
            inputProps={{ min: 1, max: props.max }}
            variant="standard"
            label="Question index"
            sx={{ width: 300, marginLeft: 5 }}
            onChange={questionChangeHandler}
          />
          <br />
          <Box sx={{marginTop: 2, marginX:1}}>

          <Button
            variant="outlined"
            color="warning"
            onClick={startEditingHandler}
            endIcon={<CloseOutlinedIcon />}
            sx={{marginLeft:5, width:180}}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClickOpen}
            disabled={isDisabledButton}
            endIcon={<DeleteIcon />}
            sx={{marginLeft:5, width:180}}
          >
            Delete
          </Button>
          </Box>
          
          <Divider sx={{marginTop:2}}/>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            align="center"
            sx={{ marginTop: 2 }}
          >
            Question List
          </Typography>

          <List sx={{ marginLeft: 3 }}>
            {props.form.elements.map((question, index) => {
              return (
                <ListItem
                  key={question.title}
                  secondaryAction={
                    <React.Fragment>
                      <IconButton
                        edge="start"
                        aria-label="delete"
                        onClick={() => deleteee(index)}
                      >
                        <DeleteIcon color="error" fontSize="large" />
                      </IconButton>
                    </React.Fragment>
                  }
                >
                  <Typography>
                    {" "}
                    {+index + 1}. {question.title}
                  </Typography>
                </ListItem>
              );
            })}
          </List>

          <Dialog
            open={deleteDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure to delete this question"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                If you proceed you can't undo this action.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={submitHandler}
                autoFocus
                variant="outlined"
                color="error"
                endIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </React.Fragment>
  );
};
export default DeleteQuestion;
