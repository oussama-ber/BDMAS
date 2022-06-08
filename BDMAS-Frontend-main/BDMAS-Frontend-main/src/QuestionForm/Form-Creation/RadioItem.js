import React, { useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../..//shared/UIElements/ErrorModal";

// ui material
import Typography from "@mui/material/Typography";
//accordion
//list
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Button, IconButton, ListItemIcon } from "@mui/material";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { ListItemButton, TextField } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";

const RadioItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [updatedItem, setUpdatedItem] = useState(props.title);
  const [startUpdating, setStartUpdating] = useState(false);
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  // DONE
  const updateItemHandler = () => {
    console.log("title: ", props.title);
    console.log(updatedItem);
    props.onUpdateItem(props.title, updatedItem);
    setStartUpdating(false);
  };
  const changeItemHandler = (event) => {
    setUpdatedItem(event.target.value);
  };
  //DONE
  const deleteHandler = () => {
    props.onDelete(updatedItem);
  };
  const showUpdateHandler = () => {
    setStartUpdating(true);
  };
  // TO CHANGE
  // const confirmDeleteHandler = async () => {
  //   setShowConfirmModal(false);
  //   try {
  //     await sendRequest(
  //       `http://localhost:5000/api/projects/${props.id}`,
  //       "DELETE",
  //       null,
  //       { Authorization: "Bearer " + auth.token }
  //     );
  //     props.onDelete(props.id);
  //   } catch (err) {}
  // };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <ListItem
        disablePadding
        secondaryAction={
          <React.Fragment>
            <IconButton
              edge="start"
              aria-label="delete"
              onClick={deleteHandler}
            >
              <DeleteIcon color="error" fontSize="large" />
            </IconButton>
          </React.Fragment>
        }
      >
        {!startUpdating && (
          <ListItemButton onClick={showUpdateHandler}>
            {" "}
            item {props.index + 1}: {updatedItem}
          </ListItemButton>
        )}
        {startUpdating && (
          <React.Fragment>
            <TextField
              element="input"
              id="Item"
              type="text"
              variant="standard"
              onChange={changeItemHandler}
              defaultValue={updatedItem}
            />
            <IconButton
              edge="false"
              aria-label="update"
              onClick={updateItemHandler}
            >
              <UpdateIcon color="primary" fontSize="large" />
            </IconButton>
          </React.Fragment>
        )}
      </ListItem>
    </React.Fragment>
  );
};
export default RadioItem;
