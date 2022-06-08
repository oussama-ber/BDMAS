import React, { useState } from "react";

// ui material
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";

import ErrorModal from "../../shared/UIElements/ErrorModal";
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import InputField from "../../shared/FormElements/InputField";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
//icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddIcon from '@mui/icons-material/Add';

//bootstrap
import B_Button from 'react-bootstrap/Button'

const AddFormDetails = (props) => {
  const { isLoading, error, clearError } = useHttpClient();
  const [startEditing, setStartEditing] = useState(false);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const submitHandler = (event) => {
    event.preventDefault();
    console.log("fromState", formState.inputs);
    props.onSubmitHandler(formState.inputs);
    setStartEditing(false);
  };

  const startEditingHandler = () => {
    setStartEditing(!startEditing);
  };
  const endEditingHandler = () => {
    setStartEditing(false);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}

      <ListItemButton
        onClick={startEditingHandler}
        style={{ lineHeight: 33, margin: 0, padding: 20 }}
        selected={startEditing}
      >
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="FORM HEADER" />
      </ListItemButton>

      {startEditing && (
        <form onSubmit={submitHandler}>
          <Box sx={{ marginX: 3, marginY: 2 }}>
            <InputField
              element="input"
              id="title"
              type="text"
              label="Form Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a title."
              onInput={inputHandler}
            />

            <InputField
              element="input"
              id="description"
              type="text"
              label="Form description"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a form description."
              onInput={inputHandler}
              variant="standard"
            />
          </Box>
          <Box textAlign="center" sx={{marginY: 2, }}>
          <Button
              type="submit"
              disabled={formState.isValid}
              onClick={endEditingHandler}
              align="center"
              variant="outlined"
              color="warning"
              height="20"
              endIcon={<CloseOutlinedIcon />}
              sx={{marginLeft:0, width:180}}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formState.isValid}
              align="center"
              variant="outlined"
              color="primary"
              height="20"
              endIcon={  <AddIcon fontSize="large"  />}
              sx={{marginLeft:5, width:180}}
            >
              Submit
            </Button>
           
            {/* <Button variant="outline-warning"></Button>
            <B_Button variant="outline-danger"size="lg" >CANCEL</B_Button> */}
          </Box>
        </form>
      )}
    </React.Fragment>
  );
};
export default AddFormDetails;
