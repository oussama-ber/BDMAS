import React, { useState } from "react";

// MUI
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";

// Components
import WhiteModeButton from "../../../../shared/UIElements/WhiteModeButton";
import DialogActions from "@mui/material/DialogActions";

const Review = (props) => {
  const [edited, setEdited] = useState(props.edited);

  return (
    <React.Fragment>
      <DialogContent>
        <DialogContentText> Are you sure to submit ? </DialogContentText>
      </DialogContent>
      <DialogActions>
        <WhiteModeButton onClick={props.onBack}>Back</WhiteModeButton>
        <WhiteModeButton onClick={props.onSubmit}>Create</WhiteModeButton>
      </DialogActions>
    </React.Fragment>
  );
};
export default Review;
