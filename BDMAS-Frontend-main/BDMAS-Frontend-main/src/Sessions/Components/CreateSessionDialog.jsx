import React, { useContext, useState } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useInputValue } from "../../QuestionForm/Form-CreationV2/Input-hooks";
//Components
import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";
//MUI
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DialogContentText from "@mui/material/DialogContentText";
import Grid from "@mui/material/Grid";
// Date picker
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CreateSessionDialog = (props) => {
  // TODO project id props
  const auth = useContext(AuthContext);
  const projectId = props.projectId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [title, handleChangeTitle] = useInputValue();
  const [description, handleChangeDescription] = useInputValue("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const SessionSubmitHandler = async () => {
    try {
      console.log(` startDate: {
         stringDate: ${parseDate(startDate)}, 
         date: ${startDate},
         },`);
      await sendRequest(
        "http://localhost:5000/api/projects/project/" + projectId,
        "POST",
        JSON.stringify({
          title,
          description,
          startDate: { stringDate: parseDate(startDate), date: startDate },
          endDate: { stringDate: parseDate(endDate), date: endDate },
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(`token: ${auth.token} userId: ${auth.userId}`);
      props.onCloseDialog();
      props.onRefresh((prevData) => !prevData);
    } catch (err) {}
  };
  const parseDate = (date) => {
    if (!date) {
      return;
    }
    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    console.log(month, day, year);
    return `${month}-${day}-${year}`;
  };
  const updateDate = (newValue, nDate) => {
    if (nDate === "startDate") {
      // setStartDate(newValue);
      setStartDate(newValue);
    } else if (nDate === "endDate") {
      setEndDate(newValue);
    }
  };
  if (startDate != null && endDate != null) {
    console.log(`STARTDATE:
                  string Date: ${parseDate(startDate)},
                  date ${startDate},
                ENDDATE:
                  string Date ${parseDate(endDate)},
                  date ${endDate}
    `);
  }
  return (
    <Dialog
      sx={{ color: "#2E2E3C" }}
      bodyStyle={{ backgroundColor: "red" }}
      open={props.open}
      onClose={props.onCloseDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Create Session</DialogTitle>
      <DialogContent sx={{ mt: 3, marginX: 3, padding: 1 }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={title}
          onChange={handleChangeTitle}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={handleChangeDescription}
          multiline
        />
        <Grid container direction="row" sx={{ mb: 1, mt: 1 }} spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item lg={6}>
              <DatePicker
                label="Start date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item lg={6}>
              <DatePicker
                label="End date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
                
              />
            </Grid>
          </LocalizationProvider>
        </Grid>
      </DialogContent>
      <DialogActions>
        <WhiteModeButton onClick={props.onCloseDialog}>Cancel</WhiteModeButton>
        <WhiteModeButton onClick={SessionSubmitHandler}>Create</WhiteModeButton>
      </DialogActions>
    </Dialog>
  );
};
export default CreateSessionDialog;
