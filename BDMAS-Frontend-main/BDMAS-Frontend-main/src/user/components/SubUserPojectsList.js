import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from "../../shared/hooks/http-hook";
//ui material;
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";


// ui material
import ListItemText from "@mui/material/ListItemText";

const SubUserProjectsList = (props) => {
  return (
      <React.Fragment>
        
    

     <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={props.title} src={`http://localhost:5000/${props.image}`} />
        </ListItemAvatar>
        <ListItemText
          primary={props.title}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {props.address}
              </Typography>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {props.description}
              </Typography>
              
            </React.Fragment>
          }
        />
      </ListItem>
  
      </React.Fragment>
    
  );

          };
export default SubUserProjectsList;

