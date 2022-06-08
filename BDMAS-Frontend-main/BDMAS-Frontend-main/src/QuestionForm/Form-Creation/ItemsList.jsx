import React from "react";
import RadioItem from "./RadioItem";
//mui
import { Divider, List, Typography } from "@mui/material";

const ItemsList = (props) => {
  const onUpdateHandler = (prevTitle, newTitle) => {
    props.onUpdate(prevTitle, newTitle);
  };

  return (
    <React.Fragment>
      {props.items && (
        <React.Fragment>
          <Divider sx={{  marginTop: 3 }}/>
          <Typography variant="h6" gutterBottom component="div" align="center"  sx={{  marginTop: 2 }}>
            ITEMS LIST
          </Typography>
          <List>
            {props.items.map((item) => (
              <RadioItem
                key={item}
                title={item}
                index={props.items.indexOf(item)}
                onDelete={props.onDelete}
                onUpdateItem={onUpdateHandler}
              />
            ))}
          </List>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ItemsList;
