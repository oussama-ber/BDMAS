import React, { useContext, useEffect, useState, useRef } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
//MUI
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
//ICONS
import AddIcon from "@mui/icons-material/Add";
import SubSessionListCard from "./SubSessionListCard";

//components
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import SubSessionDetailedDialog from "./SubSessionDetailedDialog";
import WhiteModeButton from "../../../shared/UIElements/WhiteModeButton";
import CreateSubSessionDialog from "./CreateSubSessionDialog";

const SubSessions = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSubSessions, setLoadedSubSessions] = useState();
  const [searchData, setSearchData] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [openSubsession, setOpenSubsession] = useState(false);
  const sessionId = props.sid;

  //detail dialog for subsession managment.
  const [openDetailSubSession, setOpenDetailSubSession] = useState(false);
  const openSessionDialog = () => setOpenDetailSubSession(true);
  const closeSessionDialog = () => setOpenDetailSubSession(false);
  //fetch data.
  useEffect(() => {
    const fetchSubSessions = async () => {
      try {
        const subSessionsData = await sendRequest(
          `http://localhost:5000/api/projects/project/session/${sessionId}/subsessions`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedSubSessions(subSessionsData.subSesions);
      } catch (err) {}
    };
    fetchSubSessions();
  }, [sendRequest, sessionId, refresh]);
  // Session Dialog management
  const openSubSessionDialog = () => setOpenSubsession(true);
  const closeSubSessionDialog = () => setOpenSubsession(false);
  return (
    <Container maxWidth="false">
      {/* LOADING */}
      {isLoading && (
        <Box alignItems="center" justifyContent="center">
          <LoadingSpinner />
        </Box>
      )}
      {/* NO DATA FOUND */}
      {(!loadedSubSessions || loadedSubSessions.length == 0) && !isLoading && (
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
            No SubSessions found. Maybe create one?
          </Typography>
          <WhiteModeButton icon="Add" onClick={openSubSessionDialog}>
            Create SubSession
          </WhiteModeButton>
        </Grid>
      )}

      {!isLoading && loadedSubSessions && loadedSubSessions.length >= 1 && (
          <SubSessionListCard
            items={loadedSubSessions}
            sessionId={sessionId}
            projectId={props.projectId}
            onRefresh={setRefresh}
          />
      )}
      <CreateSubSessionDialog
        sessionId={sessionId}
        projectId={props.projectId}
        open={openSubsession}
        onCloseDialog={closeSubSessionDialog}
        onRefresh={setRefresh}
      />
    </Container>
  );
};
export default SubSessions;
