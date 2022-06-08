import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
// "../.././shared/context/auth-context"
import { useHistory } from "react-router-dom";
import { useInputValue } from "../../../QuestionForm/Form-CreationV2/Input-hooks";
import { useHttpClient } from "../../../shared/hooks/http-hook";
//MUI
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";

const AddForms = (props) => {
  const auth = useContext(AuthContext);
  const [loadedForms, setLoadedForms] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [form, setForm] = useState(props.form);
  const [fTitle, setFTitle] = useState(props.formTitle);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/forms`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedForms(responseData);
        console.log("the responseData", responseData.forms[0]);
        console.log(
          "the responseData",
          JSON.parse(responseData.forms[0].form).title
        );
      } catch (err) {}
    };
    fetchForms();
  }, [sendRequest]);

  const updateForm = (form) => {
    setForm(form._id);
    props.setForm(form._id);
    setFTitle(JSON.parse(form.form).title);
    props.setFormTitle(JSON.parse(form.form).title);
  };
  return (
    <React.Fragment>
      <DialogContent sx={{ mt: 3, marginX: 3, padding: 1, }}>
        <DialogContentText>
          <Typography color='black'>{'Form Title : '}{fTitle ? fTitle : props.formTitle} </Typography>
        </DialogContentText>
        {loadedForms && (
          <Grid item lg={6} xs={12} md={12} marginTop={3}>
            <Autocomplete
              freeSolo
              autoHighlight
              options={loadedForms.forms}
              onChange={(event, value) => updateForm(value)}
              getOptionLabel={(option) => JSON.parse(option.form).title}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  {JSON.parse(option.form).title} 
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label="Form" />}
            />
          </Grid>
        )}
      </DialogContent>

      {/* <Button onClick={props.handleBack} sx={{ mt: 3, ml: 1 }}>
        Back
      </Button>

      <Button
        variant="contained"
        onClick={props.handleNext}
        sx={{ mt: 3, ml: 1 }}
      >
        Next
      </Button> */}
      <DialogActions>
        <Button
          onClick={props.handleBack}
          sx={{
            borderRadius: 0,
            borderColor: "#3A3A4A ",
            backgroundColor: "#FFE600",
          }}
          color="inherit"
          variant="outlined"
        >
          Back
        </Button>
        <Button
          onClick={props.handleNext}
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
          disabled={!!!fTitle}
        >
          Next
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
export default AddForms;
