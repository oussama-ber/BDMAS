import React, { useContext, useEffect, useState, useRef } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

//COMPONENTS
import CreateSessionDialog from "../Components/CreateSessionDialog";
import SessionListCard from "../../projects/components/SessionListCard";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";

//MUI
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
//ICONS
import AddIcon from "@mui/icons-material/Add";

const Sessions = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSessions, setLoadedSessions] = useState();
  const [searchData, setSearchData] = useState("");
  const [openSession, setOpenSession] = useState(false);
  const [refreshSessions, setRefreshSessions] = useState(false);
  // console.log("openSession" + openSession);
  const token = props.token;
  const projectId = props.projectId;
  // console.log("projectId from sessions" + projectId);

  //fetch data.
  useEffect(() => {
    const fetchProjectSessions = async () => {
      try {
        const sessionsData = await sendRequest(
          `http://localhost:5000/api/projects/project/session/${projectId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        // console.log(sessionsData.sessions);
        setLoadedSessions(sessionsData.sessions);
      } catch (err) {}
    };
    fetchProjectSessions();
  }, [sendRequest, projectId, refreshSessions]);

  // Session Dialog management
  const openSessionDialog = () => setOpenSession(true);
  const closeSessionDialog = () => setOpenSession(false);

  return (
    <React.Fragment>
      {isLoading && (
        <Box alignItems="center" justifyContent="center">
          <LoadingSpinner />
        </Box>
      )}
      {/* TO CHANGE */}
      {(!loadedSessions || loadedSessions.length == 0) && !isLoading && (
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 7 }}
        >
          <Typography
            Typography
            variant="h4"
            gutterBottom
            component="div"
            color="white"
          >
            No Sessions found. Maybe create one?
          </Typography>
          <WhiteModeButton icon="Add" onClick={openSessionDialog}>
            Create Session
          </WhiteModeButton>
        </Grid>
      )}
      {/* TO CHANGE */}
      {loadedSessions && loadedSessions.length >= 1 && !isLoading && (
        <React.Fragment>
          <Container maxWidth="false">
            {/* <Box
              display="flex"
              maxWidth="auto"
              maxHeight
              alignItems="center"
              justifyContent="center"
              marginTop={3}
            >
              <SessionList
                projectId={projectId}
                items={loadedSessions}
                onDeleteItem={sessionDeletedHandler}
              />
            </Box> */}
            <Grid
              item
              container
              direction="row"
              alignItems="center"
              spacing={8}
              sx={{ marginBottom: 3 }}
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
                  <WhiteModeButton onClick={openSessionDialog}>
                    Create Session
                  </WhiteModeButton>
                </Box>
              </Grid>
            </Grid>

            <SessionListCard
              items={loadedSessions}
              projectId={projectId}
              onRefresh={setRefreshSessions}
              //   onDeleteItem={sessionDeletedHandler}
            />
          </Container>
        </React.Fragment>
      )}
      <CreateSessionDialog
        open={openSession}
        onRefresh={setRefreshSessions}
        onCloseDialog={closeSessionDialog}
        projectId={projectId}
      />
    </React.Fragment>
  );
};
export default Sessions;
