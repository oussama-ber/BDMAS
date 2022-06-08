import React from "react";
import SessionItem from "./SessionItem";
import { useHistory } from "react-router-dom";
// ui material
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
//table ui
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
//icons
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";

const SessionList = (props) => {
  const history = useHistory();
  if (props.items.length === 0) {
    return (
      <div className="session-list center">
        <Paper elevation={3}>
          <h2>No Sessions found. Maybe create one?</h2>
          <Button
            sx={{
              borderRadius: 0,
              borderColor: "#3A3A4A ",
              backgroundColor: "#FFE600",
            }}
            color="inherit"
            variant="outlined"
            endIcon={<AddIcon />}
            onClick={createSession}
          >
            Create Form
          </Button>
        </Paper>
      </div>
    );
  }
  const createSession = () =>
    history.push(`/project/${props.projectId}/session/new`);
  const goToSessionDetails = (sid) => 
  history.push(`/project/${props.projectId}/session/details/${sid}`)
  return (
    <Grid direction="column" width="100%">
      <Grid item>
        <Button
          sx={{
            borderRadius: 0,
            borderColor: "#3A3A4A ",
            backgroundColor: "#FFE600",
          }}
          color="inherit"
          variant="outlined"
          endIcon={<AddIcon />}
          onClick={createSession}
        >
          Create Session
        </Button>
      </Grid>
      <Grid item>
        <Paper textAlign="center" sx={{ width: "100%", bgcolor: "#F6F6FA" }}>
          {/* <Box textAlign="center">
        <Typography variant="h4" gutterBottom component="div" color="black">
          Sessions
        </Typography>
      </Box> */}

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#F6F6FA", border: 0 }}
          >
            <Table
              aria-label="simple table"
              size="sm"
              sx={{ border: 0 }}
              onCellClick={console.log("clicked")}
            >
              <TableHead sx={{ bgcolor: "#C4C4CD", border: 0 }}>
                <TableRow sx={{ border: 0 }}>
                  <TableCell>#</TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      marginLeft={2}
                    >
                      Session
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      marginLeft={2}
                    >
                      Details
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      marginLeft={2}
                    >
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ width: "100%", bgcolor: "#EAEAF2" }}>
                {props.items.map((session, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell key={index} component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell
                        key={index}
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {session.title}
                      </TableCell>

                      <SessionItem
                        key={session.id}
                        id={session.id}
                        title={session.title}
                        forms={session.forms}
                        description={session.description}
                        creator={session.creator}
                        onDelete={props.onDeleteItem}
                      />
                      <TableCell key={index} align="center">
                        <IconButton onClick={()=> goToSessionDetails(session._id)}>
                          <InfoIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SessionList;
