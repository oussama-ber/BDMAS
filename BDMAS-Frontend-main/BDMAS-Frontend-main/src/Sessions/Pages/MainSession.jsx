import React, { useState, useContext, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import * as XLSX from "xlsx";

//hooks
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

// MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
//card
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { Container, Divider, IconButton, setRef } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ListItemIcon from "@mui/material/ListItemIcon";
//icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

//components
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ChartProjectItem from "../../projects/components/ChartProjectItem";
import SubSessions from "../Components/SubSession/SubSessions";
import Chart from "../../projects/components/Chart";
// TESTING
import SessionStats from "../Components/Helpers/SessionStats";
//dialogs
import UpdateSessionDialog from "../Components/UpdateSessionDialog/UpdateSessionDialog";

const MainSession = () => {
  const auth = useContext(AuthContext);
  const sessionId = useParams().sid;
  const projectId = useParams().pid;
  const history = useHistory();
  const [loadedSession, setLoadedSession] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showManagement, setShowManagement] = useState(0);
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openSubsession, setOpenSubsession] = useState(false);
  const [openFormsDialog, setOpenFormsDialog] = useState(false);
  const [openUpdateSessionDialog, setOpenUpdateSessionDialog] = useState(false);
  const openOptions = Boolean(anchorEl);
  const [refresh, setRefresh] = useState(false);

  const [loadedSessionStats, setLoadedSessionStats] = useState();
  const [closedSessions, setClosedSessions] = useState(0);
  const [pendingSessions, setPendingSessions] = useState(0);
  const [doneSessions, setDoneSessions] = useState(0);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const onRefresh = () => setRefresh(!refresh);

  useEffect(() => {
    const fetchProjectById = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/project/${projectId}/session/${sessionId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        // console.log('loaded session' + responseData.session.subSessions.length);
        setLoadedSession(responseData.session);
      } catch (err) {}
    };
    fetchProjectById();
  }, [sendRequest, sessionId, refresh]);

  useEffect(() => {
    const getSessionStats = async () => {
      try {
        const loadedSessionStats = await sendRequest(
          `http://localhost:5000/api/projects/project/session/${sessionId}/subsessions`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        const { closeds, pendings, dones } = returnStats(
          loadedSessionStats.subSesions
        );

        setClosedSessions(closeds);
        setPendingSessions(pendings);
        setDoneSessions(dones);
        setLoadedSessionStats(loadedSessionStats.subSesions);
      } catch (err) {}
    };
    getSessionStats();
  }, [sendRequest, sessionId]);

  const returnStats = (arr) => {
    let closeds = 0;
    let pendings = 0;
    let dones = 0;

    arr.map((item) => {
      if (item.state === "Done") {
        closeds++;
      }
      if (item.state === "Pending") {
        pendings++;
      }
      if (item.state === "Closed") {
        dones++;
      }
    });

    return { closeds, pendings, dones };
  };

  const processCSV = (str, delim = ";") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const newArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
      return eachObject;
    });

    setCsvArray(newArray);
  };
  const submit = () => {
    const file = csvFile;
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;

      processCSV(text);
    };
    reader.readAsText(file);
  };
  const deleteitem = (itemName) => {
    setCsvArray(csvArray.filter((item) => item.Name !== itemName));
  };
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      setCsvArray(d);
    });
  };
  const handleCloseOptions = () => setAnchorEl(null);

  const openUpdateDialog = () => {
    handleCloseOptions();
    setOpenUpdateSessionDialog(true);
  };
  const closeUpdateDialog = () => setOpenUpdateSessionDialog(false);

  const breadcrumbs = [
    <NavLink
      style={{ textDecoration: "none" }}
      underline="hover"
      key="1"
      color="white"
      href="/user/dashboard"
      to="/user/dashboard"
    >
      <Typography color="white">Dashboard</Typography>
    </NavLink>,
    <NavLink
      exact
      style={{ textDecoration: "none" }}
      underline="hover"
      key="2"
      href="/projects"
      to="/projects"
    >
      <Typography color="white"> Projects</Typography>
    </NavLink>,
    <NavLink
      exact
      style={{ textDecoration: "none" }}
      underline="hover"
      key="3"
      href={`/projects/detailedview/${projectId}`}
      to={`/projects/detailedview/${projectId}`}
    >
      <Typography color="white"> Project</Typography>
    </NavLink>,
    <Typography key="3" color="#FFE600">
      Session
    </Typography>,
  ];

  // Session Dialog management
  const openSubSessionDialog = () => setOpenSubsession(true);
  const closeSubSessionDialog = () => setOpenSubsession(false);

  const openForms = () => setOpenFormsDialog(true);
  const closeForms = () => setOpenFormsDialog(false);

  return (
    <React.Fragment>
      <Breadcrumbs
        color="white"
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>

      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!!!showManagement && loadedSession && (
        <Container maxWidth="false">
          <Grid container direction="column" spacing={5} sx={{ mt: 2 }}>
            <Grid item container direction="row" spacing={3}>
              <Grid item lg={7} height={1}>
                <Grid container direction="column" spacing={3}>
                  {/* Project Details */}
                  <Grid item>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "432px",
                        backgroundColor: "#23232F",
                        padding: 3,
                      }}
                    >
                      <CardHeader
                        // avatar={
                        //   <Avatar
                        //     src={`https://source.unsplash.com/random`}
                        //     alt={"loadedProject.title"}
                        //   />
                        // }
                        action={
                          <React.Fragment>
                            <IconButton
                              aria-label="settings"
                              sx={{
                                color: "#FFE600",
                                ":hover": {
                                  bgcolor: "#FFE600",
                                  color: "#23232F",
                                },
                              }}
                              onClick={handleClick}
                            >
                              <MoreVertIcon fontSize="large" />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              keepMounted
                              onClose={handleCloseOptions}
                              open={openOptions}
                              style={{ color: "#23232F" }}
                              color="#23232F"
                            >
                              <MenuItem onClick={openUpdateDialog}>
                                <ListItemIcon>
                                  <ModeEditIcon fontSize="small" color="info" />
                                </ListItemIcon>
                                <Typography variant="inherit">
                                  Update
                                </Typography>
                              </MenuItem>
                            </Menu>
                          </React.Fragment>
                        }
                        title={
                          <Grid container direction="row">
                            <Grid item lg={10}>
                              <Typography
                                variant="h5"
                                gutterBottom
                                component="div"
                                color="#FFE600"
                              >
                                {loadedSession.title}
                              </Typography>
                            </Grid>
                            <Grid item lg={2}>
                              <Chip
                                label={
                                  <Typography>{loadedSession.state}</Typography>
                                }
                                color={
                                  loadedSession.state === "Closed"
                                    ? "error"
                                    : loadedSession.state === "Pending"
                                    ? "warning"
                                    : "success"
                                }
                              />
                            </Grid>
                          </Grid>
                        }
                        subheader={
                          <Grid container dicrection="row" sx={{ mt: 1.5 }}>
                            <Grid item>
                              <Typography
                                color="#C4C4CD"
                                sx={{ marginRight: 3 }}
                                variant="h6"
                              >
                                {`Start Date: `}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                color="white"
                                variant="h6"
                                sx={{ marginRight: 9 }}
                              >
                                {loadedSession.startDate.stringDate}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="h6"
                                color="#C4C4CD"
                                sx={{ marginRight: 3 }}
                              >
                                {`End Date:  `}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="h6" color="white">
                                {loadedSession.endDate.stringDate}
                              </Typography>
                            </Grid>
                          </Grid>
                        }
                      />
                      <CardContent>
                        <Grid container direction="row" alignItems="center">
                          <Grid
                            item
                            container
                            direction="row"
                            alignItems="center"
                          >
                            <Typography
                              color="#C4C4CD"
                              variant="h6"
                              sx={{ marginRight: 3 }}
                            >
                              {`DESCRIPTION : `}
                            </Typography>
                            <Typography color="white" variant="h6">
                              {loadedSession.description}
                            </Typography>
                          </Grid>
                        </Grid>
                        {/* CREATOR */}
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          sx={{ marginTop: 2 }}
                        >
                          <Typography color="#C4C4CD" variant="h6" mr={3}>
                            {"Moderator :"}
                          </Typography>
                          <Tooltip
                            title={
                              <Typography>
                                {loadedSession.creatorData.userName} (
                                {loadedSession.creatorData.userEmail})
                              </Typography>
                            }
                          >
                            <Avatar
                              sx={{ ml: 2 }}
                              src={`http://localhost:5000/${loadedSession.creatorImage}`}
                              alt={loadedSession.title}
                            />
                          </Tooltip>
                        </Grid>
                        {/* STATS */}
                        {loadedSessionStats && (
                          <Grid
                            container
                            direction="row"
                            spacing={1.5}
                            sx={{ mt: 6 }}
                          >
                            <Grid item>
                              <Typography color="#C4C4CD" variant="h6" mr={3}>
                                Sub Sessions :
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Chip
                                label={
                                  <Typography>
                                    Closed : ({closedSessions})
                                  </Typography>
                                }
                                color="error"
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item>
                              <Chip
                                label={
                                  <Typography>
                                    Pending : ({pendingSessions})
                                  </Typography>
                                }
                                color="warning"
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item>
                              <Chip
                                label={
                                  <Typography>
                                    Done : ({doneSessions})
                                  </Typography>
                                }
                                color="success"
                                variant="outlined"
                              />
                            </Grid>
                          </Grid>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              {/* Chart */}
              <Grid item lg={5}>
                <Paper
                  sx={{ bgcolor: "#EAEAF2", height: "432px" }}
                  justifyContent="center"
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: "100% ",
                      padding: 2,
                    }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {/* <ChartProjectItem /> */}
                    {/* TESTING */}
                    <SessionStats sessionId={sessionId} token={auth.token}/>
                    {/* <Chart /> */}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Divider
              variant="middle"
              sx={{
                "&.MuiDivider-root": {
                  "&::before": {
                    borderTop: `thin solid`,
                    color: "#FFE600",
                  },
                  "&::after": {
                    borderTop: `thin solid`,
                    color: "#FFE600",
                  },
                },
                marginTop: 5,
              }}
              style={{
                color: "white",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                component="div"
                color="#EAEAF2"
              >
                SubSessions
              </Typography>
            </Divider>
          </Grid>
          <UpdateSessionDialog
            open={openUpdateSessionDialog}
            onClose={closeUpdateDialog}
            title={loadedSession.title}
            description={loadedSession.description}
            state={loadedSession.state}
            startDate={loadedSession.startDate}
            endDate={loadedSession.endDate}
            projectId={projectId}
            sessionId={sessionId}
            onRefresh={onRefresh}
          />
        </Container>
      )}
      <SubSessions sid={sessionId} projectId={projectId} />
    </React.Fragment>
  );
};
export default MainSession;
