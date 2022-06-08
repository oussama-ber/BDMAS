import React, { useState } from "react";

//MUI
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//Components
import WhiteModeButton from "../../../../shared/UIElements/WhiteModeButton";
import UploadImageButton from "../../../../shared/UIElements/UploadImageButton";

const GeneralForm = (props) => {
  const [data, setData] = useState(() => {
    if (props.data === null) {
      return {
        title: "",
        description: "",
        address: "",
        state: "",
        startDate: { stringDate: "", date: {} },
        endDate: { stringDate: "", date: {} },
        image: null,
        editedImage: false,
      };
    } else return props.data;
  });

  const onChangeField = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const updateDate = (newValue, nDate) => {
    const rightValue = newValue;

    console.log("rightValue.month" + rightValue.month);
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
    console.log(month + 1, day, year);
    return `${month + 1}-${day}-${year}`;
  };
  //get Image:
  const getImage = (pickedImage) => {
    console.log(pickedImage, typeof pickedImage);
    setData({ ...data, image: pickedImage, editedImage: true });
  };

  const stateHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const onNext = () => {
    props.updateData(data);
    props.handleNext();
  };
  return (
    <React.Fragment>
      {/* height: "600px" */}
      <DialogContent sx={{ mt: 3, marginX: 3, padding: 1 }}>
        <Grid container direction="row" spacing={3}>
          <Grid item container direction="column" lg={6}>
            {/* TITLE */}
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={data.title}
              onChange={(e) => onChangeField(e)}
              sx={{ marginY: 1.5 }}
            />

            {/* STATE */}
            <FormControl variant="standard" fullWidth sx={{ marginY: 1.5 }}>
              <InputLabel id="select-label">Status</InputLabel>
              <Select
                labelId="select-label"
                id="state-select"
                name="state"
                value={data.state}
                label="Status"
                onChange={stateHandler}
              >
                <MenuItem value={"Closed"}>
                  <Typography color="#E0362C">Closed</Typography>
                </MenuItem>
                <MenuItem value={"Pending"}>
                  <Typography color="#FF810A">Pending</Typography>
                </MenuItem>
                <MenuItem value={"Done"}>
                  <Typography color="#168736">Done</Typography>
                </MenuItem>
              </Select>
            </FormControl>

            {/* ADDRESS */}
            <TextField
              autoFocus
              margin="dense"
              id="address"
              name="address"
              label="Address"
              type="text"
              fullWidth
              variant="standard"
              value={data.address}
              onChange={(e) => onChangeField(e)}
              sx={{ marginY: 1.5 }}
            />

            {/* DESCRIPTION */}
            <TextField
              autoFocus
              margin="dense"
              id="description"
              name="description"
              label="Description"
              multiline
              type="text"
              fullWidth
              variant="standard"
              value={data.description}
              onChange={(e) => onChangeField(e)}
              sx={{ marginY: 1.5 }}
            />
          </Grid>

          <Grid
            item
            lg={6}
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            spacing={2}
          >
            <Grid item container direction="row" spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item lg={6}>
                  <DatePicker
                    label="Start Date"
                    name="startDate"
                    value={data.startDate.date}
                    onChange={(newValue) => {
                      updateDate(newValue, "startDate");
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item lg={6}>
                  <DatePicker
                    label="End Date"
                    name="endDate"
                    value={data.endDate.date}
                    onChange={(newValue) => {
                      updateDate(newValue, "endDate");
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <UploadImageButton
                id="image"
                errorText="Please provide an image."
                image={data.image}
                getImage={getImage}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <WhiteModeButton onClick={props.onCancel}>Cancel</WhiteModeButton>
        <WhiteModeButton onClick={onNext}>Next</WhiteModeButton>
      </DialogActions>
    </React.Fragment>
  );
};
export default GeneralForm;
