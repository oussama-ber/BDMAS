import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const GeneralForm = (props) => {
  const [data, setData] = useState(() => {
    if (props.data === null) {
      return {
        title: "",
        description: "",
        startDate: { stringDate: "", date: {} },
        endDate: { stringDate: "", date: {} },
      };
    } else return props.data;
  });
  const onChangeField = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const updateDate = (newValue, nDate) => {
    if (nDate === "startDate") {
      // setStartDate(newValue);
      setData({
        ...data,
        startDate: { stringDate: parseDate(newValue), date: newValue },
      });
    } else if (nDate === "endDate") {
      setData({
        ...data,
        endDate: { stringDate: parseDate(newValue), date: newValue },
      });
    }
  };
  // date => string "MM-DD-YYYY"
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
  const onNext = () => {
    props.getData(data);
    props.handleNext();
  };
  return (
    <React.Fragment>
      {/* height: "600px" */}
      <DialogContent sx={{ mt: 3, marginX: 3, padding: 1 }}>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          {/* TITLE */}
          <Grid item lg={10}>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={data.title}
              onChange={(e) => onChangeField(e)}
            />
          </Grid>
          {/* DESCRIPTION */}
          <Grid item lg={10}>
            <TextField
              autoFocus
              margin="dense"
              id="Description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={data.description}
              onChange={(e) => onChangeField(e)}
            />
          </Grid>
          <Grid
            item
            container
            lg={10}
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mt={1}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item lg={6}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <DatePicker
                    label="Start Date"
                    name="startDate"
                    value={data.startDate.date}
                    onChange={(newValue) => {
                      updateDate(newValue, "startDate");
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </Grid>
              <Grid item lg={6}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <DatePicker
                    label="End Date"
                    name="endDate"
                    value={data.endDate.date}
                    onChange={(newValue) => {
                      updateDate(newValue, "endDate");
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </Grid>
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onNext}
          sx={{
            borderRadius: 0,
            borderColor: "#3A3A4A ",
            backgroundColor: "#FFE600",
            ":hover": {
              bgcolor: "#C4C4CD",
              color: "#23232F",
            },
          }}
          color="inherit"
          variant="outlined"
          disabled={data.title.legth >= 3}
        >
          Next
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
export default GeneralForm;
