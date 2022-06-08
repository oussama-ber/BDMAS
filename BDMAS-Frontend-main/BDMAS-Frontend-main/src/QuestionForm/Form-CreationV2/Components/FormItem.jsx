import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//MUI
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from  "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
// components ConfirmationDialog
import ConfirmationDialog from "../../../projects/components/Dialogs/ConfirmationDialog";
// icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";

const FormItem = (props) => {
  // variables: index, item
  // Confirmation Dialog
  const history = useHistory();

  const [makeSure, setMakeSure] = useState(false);

  //   routers
  const goToFormHandler = (item) => history.push(`/form/${item._id}`);
  const updateFormHandler = (item) => history.push(`/form/update/${item._id}`);
  // Confirmation Dialog
  const openMakeSureDialog = () => setMakeSure(true);
  const closeMakeSureDialog = () => setMakeSure(false);
  const dialogTitle = "Delete Confirmation";
  const dialogContent = `Are you sure you want to proceed with this action?
      Warning: This cannot be undone. `;

  return (
    <TableRow
      key={props.index}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        backgroundColor: "#EAEAF2",
      }}
    >
      <TableCell key={props.index} component="th" scope="row">
        {props.index + 1}
      </TableCell>
      {/* TODO display just the title */}
      <TableCell>
        {" "}
        <Typography variant="h6" component="div">
          {JSON.parse(props.item.form).title}
        </Typography>
      </TableCell>
      <TableCell>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Grid item>
            <Avatar
              src={`http://localhost:5000/${
                JSON.parse(props.item.createdBy).userImage
              }`}
              alt={JSON.parse(props.item.createdBy).userName}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              {JSON.parse(props.item.createdBy).userName}
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography variant="h6" component="div">
          {JSON.parse(props.item.form).date}
        </Typography>
      </TableCell>
      <TableCell>
        <IconButton
          onClick={() => {
            goToFormHandler(props.item);
          }}
          color="info"
        >
          <InfoIcon />
        </IconButton>
        <IconButton onClick={openMakeSureDialog} color="error">
          <DeleteOutlineIcon />
        </IconButton>
        <ConfirmationDialog
          open={makeSure}
          title={dialogTitle}
          content={dialogContent}
          onClose={closeMakeSureDialog}
          onConfirm={() => props.onDeleteProject(props.item._id)}
        />
        <IconButton
          onClick={() => updateFormHandler(props.item)}
          sx={{ color: "#1A1A24" }}
        >
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
export default FormItem;
