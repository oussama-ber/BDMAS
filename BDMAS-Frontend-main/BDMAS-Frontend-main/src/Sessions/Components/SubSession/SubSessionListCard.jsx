import React, { useState, useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import Grid from "@mui/material/Grid";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Menu,
  IconButton,
  MenuItem,
  Avatar,
  CardActionArea,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";

//icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
//components
import CreateSubSessionDialog from "./CreateSubSessionDialog";
import SubSessionDetailedDialog from "./SubSessionDetailedDialog";
import SubSessionItem from "./SubSessionItem";

const SubSessionListCard = (props) => {
  const auth = useContext(AuthContext);
  const [searchData, setSearchData] = useState("");
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [openSubsession, setOpenSubsession] = useState(false);
  const [openDetailSubSession, setOpenDetailSubSession] = useState(false);
  const [currentSubSessionItem, setCurrentSubSessionItem] = useState();

  const sessionId = props.sessionId;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deactivateSubSessionHandler = async (subSessionID) => {
    // console.log(`subSessionID : ${subSessionID}`);
    try {
      await sendRequest(
        `http://localhost:5000/api/projects/project/session/${sessionId}/subsession/${subSessionID}/deactivate`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      //IMPORTANT
      props.onRefresh((prevData) => !prevData);
    } catch (err) {}
  };
  const startSubSession = async (subSessionID) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/projects/project/session/${sessionId}/subsession/${subSessionID}/startsession`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  const goToSessionDetails = (sid) =>
    history.push(`/project/${props.projectId}/session/details/${sid}`);

  // Session Dialog management
  const openSubSessionDialog = () => setOpenSubsession(true);
  const closeSubSessionDialog = () => setOpenSubsession(false);

  const openSubSessionDetailedDialog = (data) => {
    setOpenDetailSubSession(true);
    setCurrentSubSessionItem(data);

    // console.log("data : " + JSON.stringify(data));
    // console.log("data.bankMembers : " + data.bankMembers);
  };
  const closeSubSessionDetailedDialog = () => setOpenDetailSubSession(false);

  return (
    <React.Fragment>
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={8}
        sx={{ marginBottom: 5 }}
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
                placeholder="Search Project"
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
            <Button
              sx={{
                borderRadius: 0,
                borderColor: "#3A3A4A",
                backgroundColor: "#FFE600",
                marginBottom: 2,
                ":hover": {
                  bgcolor: "#EAEAF2",
                  color: "#23232F",
                },
              }}
              color="inherit"
              variant="outlined"
              onClick={openSubSessionDialog}
            >
              <Typography variant="button" display="block">
                Create SubSession
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={3}>
        {props.items
          .filter((item) => item.title.toLowerCase().includes(searchData))
          .map((subSession, index) => {
            return (
              <React.Fragment>
                <SubSessionItem
                  index={index}
                  sessionId={sessionId}
                  projectId={props.projectId}
                  subSession={subSession}
                  deactivateSubSessionHandler={deactivateSubSessionHandler}
                  startSubSession={startSubSession}
                  openSubSessionDetailedDialog={openSubSessionDetailedDialog}
                  onRefresh={props.onRefresh}
                />
              </React.Fragment>
            );
          })}
      </Grid>
      {openDetailSubSession && (
        <SubSessionDetailedDialog
          onClose={closeSubSessionDetailedDialog}
          open={openDetailSubSession}
          data={currentSubSessionItem}
          bankMembers={currentSubSessionItem.bankMembers}
        />
      )}
      {openSubsession && (
        <CreateSubSessionDialog
          open={openSubsession}
          onCloseDialog={closeSubSessionDialog}
          sessionId={sessionId}
          projectId={props.projectId}
          onRefresh={props.onRefresh}
        />
      )}
    </React.Fragment>
  );
};
export default SubSessionListCard;
