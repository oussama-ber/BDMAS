import React from "react";
import Button from "@mui/material/Button";
//ICONS
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import DeleteIcon from "@mui/icons-material/Delete";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
/* icon, onclick, type, content */
const WhiteModeButton = (props) => {
  let Icon;
  switch (props.icon) {
    case "Add":
      Icon = <AddIcon />;
      break;
    case "Delete":
      Icon = <DeleteOutlineIcon />;
      break;
    case "Cancel":
      Icon = <ClearIcon />;
      break;
    default:
      break;
  }

  return (
    <Button
      sx={{
        borderRadius: 0,
        borderColor: "#3A3A4A",
        backgroundColor: "#FFE600",
        marginBottom: 2,
        ":hover": {
          bgcolor: "#3A3A4A",
          color: "#FFE600",
        },
      }}
      color="inherit"
      variant="outlined"
      type={props.type || "button"}
      onClick={props.onClick}
      endIcon={Icon}
      disabled={props.disabled || false}
    >
      {props.children}
    </Button>
  );
};
export default WhiteModeButton;
