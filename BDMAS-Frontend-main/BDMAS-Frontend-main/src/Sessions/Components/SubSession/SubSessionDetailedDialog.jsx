import React, { useState } from "react";
//MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
//icons
import ClearIcon from "@mui/icons-material/Clear";

import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
// Components
import SubSessionStat from "../Helpers/SubSessionStat";

const SubSessionDetailedDialog = (props) => {
  const [answersNum, setAnswersNum] = useState();
  const updateAnswersNum = (num) => {
    setAnswersNum(num);
  };
  const subSessionId = props.data._id;
  console.log(`subSessionId : ${subSessionId}`);
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item lg={3}>
            <Typography Typography variant="h3" gutterBottom component="div">
              {props.data.title}
            </Typography>
          </Grid>
          <Grid item lg={8.25}>
            <Chip
              label={props.data.state}
              color={
                props.data.state === "Pending"
                  ? "warning"
                  : props.data.state === "Closed"
                  ? "error"
                  : "success"
              }
            />
          </Grid>
          <Grid item lg>
            <IconButton onClick={props.onClose} color="error">
              <ClearIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="row">
          {/* LEFT */}
          <Grid item lg={6}>
            {/* DATE */}
            <Grid container direction="row" spacing={3}>
              <Grid
                item
                lg={6}
                container
                direction="row"
                alignItems="center"
                spacing={3}
              >
                <Grid item>
                  <Typography variant="h5" color="#3A3A4A">
                    Start Date:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5">
                    {props.data.startDate.stringDate}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                item
                lg={6}
                container
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={3}
              >
                <Grid item>
                  <Typography variant="h5" color="#3A3A4A">
                    End Date:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5">
                    {props.data.endDate.stringDate}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* DESCRIPTION */}
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <Typography color="#3A3A4A" variant="h5">
                  Description :
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="black" variant="h5">
                  {JSON.stringify(props.data.description)}
                </Typography>
              </Grid>
            </Grid>

            {/* STATS TO DELETE IMPORTANT*/}
            <Typography color="#3A3A4A" variant="h5">
              STATS
            </Typography>
            <Typography>#MEMBERS {props.bankMembers.length}</Typography>
            {answersNum && (
              <React.Fragment>
                <Typography>
                  Answers: {answersNum} (
                  {(answersNum * 100) / props.bankMembers.length}%)
                </Typography>
                <Typography>
                  Pending: {props.bankMembers.length - answersNum} (
                  {((props.bankMembers.length - answersNum) * 100) /
                    props.bankMembers.length}
                  %)
                </Typography>
              </React.Fragment>
            )}
            {/* CLIENT LIST */}
            <Typography color="#3A3A4A" variant="h5">
              Client List
            </Typography>
            <List
              sx={{ overflowY: "scroll", maxHeight: "300px", marginTop: 3 }}
            >
              {props.bankMembers.map((item, index) => {
                return <ListItem key={index}>{item.Email}</ListItem>;
              })}
            </List>
          </Grid>

          {/* RIGHT */}
          <Grid item lg={6}>
            {/* MEMBERS LIST */}

            {/* Chart TODO: getting data by subsession id */}
            <SubSessionStat
              subSessionId={subSessionId}
              answserNum={updateAnswersNum}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default SubSessionDetailedDialog;
