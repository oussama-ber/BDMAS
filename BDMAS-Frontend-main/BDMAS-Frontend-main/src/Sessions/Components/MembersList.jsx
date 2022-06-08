import React from "react";
// ui material
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

//icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { List, ListItem } from "@mui/material";

const MembersList = (props) => {
  return (
    <List sx={{ overflow: "auto", height: "300px", width: "400px " }}>
      {props.items &&
        props.items.map((member, index) => {
          return (
            <ListItem
              key={index}
              secondaryAction={
                <React.Fragment>
                  <IconButton onClick={() => props.onDelete(member.Name)}>
                    <DeleteOutlineIcon color="error" />
                  </IconButton>
                </React.Fragment>
              }
            >
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography variant="h6" component="div" color="black">
                      {member.Name}
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {member.Email}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
    </List>
    // </List>
  );
};
export default MembersList;
