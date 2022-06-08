import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";

//material ui
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";
import { Grid, IconButton } from "@mui/material";
//icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

// components
import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";
import ConfirmationDialog from "../../projects/components/Dialogs/ConfirmationDialog";
import FormItem from "../Form-CreationV2/Components/FormItem";

const FormsList = (props) => {
  const history = useHistory();
  const [searchData, setSearchData] = useState("");
  const [makeSure, setMakeSure] = useState(false);
  // console.log(props.items.forms[0].form);
  if (props.items.length === 0) {
    return (
      <div className="project-list center">
        <Paper elevation={3}>
          <h2>No forms found. Maybe create one?</h2>
          <Button href="/question-form/new">Create Form</Button>
        </Paper>
      </div>
    );
  }
  const goToFormHandler = (item) => history.push(`/form/${item._id}`);
  const updateFormHandler = (item) => history.push(`/form/update/${item._id}`);

  // Confirmation Dialog
  const openMakeSureDialog = () => setMakeSure(true);
  const closeMakeSureDialog = () => setMakeSure(false);

  const dialogTitle = "Delete Confirmation";
  const dialogContent = `Are you sure you want to proceed with this action?
    Warning: This cannot be undone. `;
  return (
    <Box maxWidth="inherent">
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        spacing={8}
        sx={{ marginBottom: 2 }}
      >
        <Grid item lg={7}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 400,
              marginBottom: 2,
            }}
          >
            <form>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Form"
                inputProps={{ "aria-label": "search google maps" }}
                value={searchData}
                onChange={(event) => setSearchData(event.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    ev.preventDefault();
                  }
                }}
              />
            </form>
          </Paper>
        </Grid>
        <Grid item lg={5}>
          <Box display="flex" justifyContent="flex-end">
            <WhiteModeButton icon="Add" onClick={props.onCreateForm}>
              Create Form
            </WhiteModeButton>
          </Box>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table
          aria-label="simple table"
          striped
          bordered
          hover
          size="sm"
         
        >
          <TableHead sx={{ bgcolor: "#2E2E38" }}>
            <TableRow align="center">
              <TableCell>
                <Typography variant="h6" color="#F6F6FA">
                  #
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6" color="#F6F6FA">
                  Form Title
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6" color="#F6F6FA">
                  Created By
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6" color="#F6F6FA">
                  Date
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6" color="#F6F6FA">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {props.items.forms &&
              props.items.forms
                .filter((item) => item.hidden === false)
                .filter((item) =>
                  JSON.parse(item.form).title.toLowerCase().includes(searchData)
                ).length == 0 && (
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="h5">No form with this title</Typography>
                </Grid>
              )}
            {props.items.forms &&
              props.items.forms
                .filter((item) => item.hidden === false)
                .filter((item) =>
                  JSON.parse(item.form).title.toLowerCase().includes(searchData)
                )
                .map((item, index) => {
                  return (
                    <React.Fragment>
                      <FormItem
                       index={index} 
                       item={item}
                       onDeleteProject={props.onDeleteProject}
                       
                       />
                    </React.Fragment>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default FormsList;

