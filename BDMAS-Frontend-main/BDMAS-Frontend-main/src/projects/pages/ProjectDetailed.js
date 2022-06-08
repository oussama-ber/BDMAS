import React, { useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { NavLink } from "react-router-dom";

//components
import ChartProjectItem from "../components/ChartProjectItem";
import ColleaguesDialog from "../components/Dialogs/ColleaguesDialog";
import UpdateProject from "./UpdateProject";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import Sessions from "../../Sessions/Pages/Sessions";
import UpdateProjectDialog from "../components/Dialogs/UpdateProjectDialog";
import ProjectStats from "../../Sessions/Components/Helpers/ProjectStats";
import Chart from "../components/Chart";
//ui material
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import AvatarGroup from "@mui/material/AvatarGroup";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";

//icons
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupIcon from "@mui/icons-material/Group";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { red } from "@mui/material/colors";

const ProjectDetailed = (props) => {
  const projectId = useParams().projectId;
  const auth = useContext(AuthContext);
  const [loadedProject, setLoadedProject] = useState();
  const [projectStats, setProjectStats] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  const [showManagement, setShowManagement] = useState(0);
  const sessionsSection = useRef(null);
  const [open, setOpen] = useState(false);
  const [newMember, setNewMember] = useState();
  const [openUpdateProjectDialog, setOpenUpdateProjectDialog] = useState(false);
  const [colleagueTable, setColleagueTable] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [closedSessions, setClosedSessions] = useState(0);
  const [pendingSessions, setPendingSessions] = useState(0);
  const [doneSessions, setDoneSessions] = useState(0);

  //more options
  const [anchorEl, setAnchorEl] = useState(null);

  // handle menu (more option)
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseOptions = () => setAnchorEl(null);
  const openOptions = Boolean(anchorEl);

  // get projects
  useEffect(() => {
    const fetchProjectById = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/${projectId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedProject(responseData.project);
        setColleagueTable(
          responseData.project.colleagues.map((item) => {
            return { name: item.name, email: item.email, image: item.image };
          })
        );
      } catch (err) {}
    };
    fetchProjectById();
  }, [sendRequest, projectId, refresh]);

  const refreshProject = () => setRefresh(!refresh);

  //TO CHANGE
  const addColleague = (newMember) => {
    // console.log(newMember);
    setColleagueTable((prevData) => {
      // console.log(prevData);
      return [
        {
          name: newMember.name,
          email: newMember.email,
          image: newMember.image,
        },
        ...prevData,
      ];
    });
    setNewMember("");
  };
  // post colleagues
  const submitColleaguesHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/projects/project/addColleagues/${projectId}`,
        "POST",
        JSON.stringify({ colleaguesList: colleagueTable }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await sendRequest(
          `http://localhost:5000/api/users`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        // console.log(" usersData", usersData.users);
        setLoadedUsers(usersData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  // get Sessions stats
  useEffect(() => {
    const getProjectsStats = async () => {
      try {
        const loadedProjectStats = await sendRequest(
          `http://localhost:5000/api/projects/project/session/${projectId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        const { closeds, pendings, dones } = returnStats(
          loadedProjectStats.sessions
        );

        setClosedSessions(closeds);
        setPendingSessions(pendings);
        setDoneSessions(dones);

        setProjectStats(loadedProjectStats.sessions);
      } catch (err) {}
    };
    getProjectsStats();
  }, [sendRequest, projectId]);

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

  const deleteColleague = (deletedItem) => {
    return setColleagueTable(
      colleagueTable.filter((item) => item.name !== deletedItem)
    );
  };

  // Colleagues Dialog
  const handleClickListItem = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const openProjectDialog = () => {
    handleCloseOptions();
    setOpenUpdateProjectDialog(true);
  };
  const closeProjectDialog = () => setOpenUpdateProjectDialog(false);

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
      style={{ textDecoration: "none" }}
      underline="hover"
      key="2"
      to="/projects"
    >
      <Typography color="white"> Projects</Typography>
    </NavLink>,
    <Typography key="3" color="#FFE600">
      Detailed View
    </Typography>,
  ];

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
        <Container>
          <div className="center">
            <LoadingSpinner />
          </div>
        </Container>
      )}
      {!loadedProject && !isLoading && (
        <div>
          <h2> there are no data</h2>
        </div>
      )}
      {loadedProject && !!!showManagement && (
        <Container maxWidth="false">
          <Grid container direction="row">
            <Grid
              item
              lg={12}
              container
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 4, mt: 2 }}
            >
              <Grid item>
                <Avatar
                  src={`http://localhost:5000/${loadedProject.image}`}
                  alt={loadedProject.title}
                  sx={{ width: 56, height: 56 }}
                />
              </Grid>
              <Grid item>
                <Typography
                  variant="h3"
                  gutterBottom
                  component="div"
                  color="#F6F6FA"
                >
                  {loadedProject.title}
                </Typography>
              </Grid>
            </Grid>

            <Grid item container direction="row" spacing={4}>
              {/* PROJECT DETAILS */}

              {/* COLLEAGE LIST */}
              <Grid item lg={7}>
                <Card
                  variant="outlined"
                  maxHeight="500px"
                  sx={{
                    height: "432px",
                    backgroundColor: "#23232F",
                    padding: 3,
                  }}
                >
                  <CardHeader
                    title={
                      <Grid container direcion="row">
                        <Grid item lg={10}>
                          <Typography variant="h4" color="#FFE600">
                            Details
                          </Typography>
                        </Grid>
                        <Grid item lg={2}>
                          <Chip
                            label={
                              <Typography>{loadedProject.state}</Typography>
                            }
                            color={
                              loadedProject.state === "Closed"
                                ? "error"
                                : loadedProject.state === "Pending"
                                ? "warning"
                                : "success"
                            }
                          />
                        </Grid>
                      </Grid>
                    }
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
                          <MenuItem onClick={openProjectDialog}>
                            <ListItemIcon>
                              <ModeEditIcon fontSize="small" color="info" />
                            </ListItemIcon>
                            <Typography variant="inherit">Update</Typography>
                          </MenuItem>
                        </Menu>
                      </React.Fragment>
                    }
                    subheader={
                      <React.Fragment>
                        <Grid
                          container
                          direction="column"
                          sx={{ mt: 0.5 }}
                          spacing={3}
                        >
                          {/* Dates */}
                          <Grid
                            item
                            container
                            direction="row"
                            alignItems="center"
                          >
                            {/* Start Date */}
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
                                variant="h6"
                                color="white"
                                sx={{ marginRight: 9 }}
                              >
                                {loadedProject.startDate.stringDate}
                              </Typography>
                            </Grid>
                            {/* End Date */}
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
                                {loadedProject.endDate.stringDate}
                              </Typography>
                            </Grid>
                          </Grid>

                          {/* ADDRESS */}
                          <Grid
                            item
                            container
                            direction="row"
                            alignItems="center"
                          >
                            <Grid item>
                              <Typography
                                color="#C4C4CD"
                                variant="h6"
                                sx={{ marginRight: 3 }}
                              >
                                {`ADDRESS :  `}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography color="white" variant="h6">
                                {loadedProject.address}
                              </Typography>
                            </Grid>
                          </Grid>
                          {/* DESCRIPTION */}
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
                              {loadedProject.description}
                            </Typography>
                          </Grid>
                          {/* Moderator */}
                          <Grid
                            item
                            container
                            direction="row"
                            alignItems="center"
                            sx={{ mt: 1 }}
                          >
                            <Grid item>
                              <Typography color="#C4C4CD" variant="h6" mr={3}>
                                {"Moderator :"}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Tooltip
                                title={
                                  <Typography>
                                    {loadedProject.creatorData.userName}(
                                    {loadedProject.creatorData.userEmail})
                                  </Typography>
                                }
                              >
                                <Avatar
                                  src={`http://localhost:5000/${loadedProject.creatorData.userImage}`}
                                  alt={loadedProject.creatorData.userName}
                                />
                              </Tooltip>
                            </Grid>
                          </Grid>
                          {/* COLLEAGUES & STATS */}
                          <Grid
                            item
                            container
                            direction="row"
                            alignItems="center"
                          >
                            {/* COLLEAGUES */}
                            <Grid
                              container
                              item
                              lg={6}
                              alignItems="center"
                              spacing={1.5}
                            >
                              <Grid item>
                                <Typography color="#C4C4CD" variant="h6" mr={3}>
                                  {`Colleagues : `}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <AvatarGroup max={4}>
                                  {loadedUsers &&
                                    colleagueTable.map((item, index) => {
                                      return (
                                        <Avatar
                                          key={index}
                                          src={`http://localhost:5000/${item.image}`}
                                          alt={item.name}
                                        />
                                      );
                                    })}
                                  <IconButton
                                    onClick={handleClickListItem}
                                    sx={{
                                      ml: 3,
                                      color: "#FFE600",
                                      ":hover": {
                                        bgcolor: "#FFE600", // theme.palette.primary.main
                                        color: "#23232F",
                                      },
                                    }}
                                  >
                                    <GroupIcon fontSize="large" />
                                  </IconButton>
                                </AvatarGroup>
                              </Grid>
                            </Grid>
                            {/* Stats */}
                            {projectStats && (
                              <Grid
                                item
                                container
                                lg={6}
                                spacing={1.5}
                                alignItems="center"
                              >
                                <Grid item>
                                  <Typography color="white" variant="h6">
                                    Sessions :
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Chip
                                    label={
                                      <Typography>
                                        Closed : ({closedSessions})
                                      </Typography>
                                    }
                                    style={{
                                      color: "white",
                                      borderColor: "#B9251C",
                                      color: "#B9251C",
                                    }}
                                    // color="#FF4136"
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item>
                                  {projectStats && (
                                    <Chip
                                      label={
                                        <Typography>
                                          Pending : ({pendingSessions})
                                        </Typography>
                                      }
                                      color="warning"
                                      variant="outlined"
                                    />
                                  )}
                                </Grid>
                                <Grid item>
                                  <Chip
                                    label={
                                      <Typography>
                                        Done : ({doneSessions})
                                      </Typography>
                                    }
                                    style={{
                                      color: "white",
                                      borderColor: "#168736",
                                      color: "#168736",
                                    }}
                                    color="success"
                                    variant="outlined"
                                  />
                                </Grid>
                              </Grid>
                            )}

                            {/* <DetailsCard loadedUsers={loadedUsers} open={open} /> */}
                          </Grid>
                        </Grid>

                        {/* Colleagues Dialog */}
                        {open && (
                          <ColleaguesDialog
                            open={open}
                            closeDialog={handleClose}
                            items={colleagueTable}
                            users={loadedUsers}
                            addUser={addColleague}
                            submitColleagues={submitColleaguesHandler}
                            deleteItem={deleteColleague}
                          />
                        )}
                      </React.Fragment>
                    }
                  />
                </Card>
              </Grid>
              {/* CHART */}
              <Grid item lg={5}>
                <Paper
                  sx={{ bgcolor: "#EAEAF2", height: "432px" }}
                  justifyContent="center"
                  
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      padding: 2,
                    }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {/* <ChartProjectItem /> */}
                    {/* TESTING */}
                    <ProjectStats projectId={projectId} />
                    {/* <Chart /> */}
                  </Box>
                </Paper>
              </Grid>
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
              marginTop: 7,
              marginBottom: 4,
            }}
            style={{
              color: "white",
            }}
          >
            <div ref={sessionsSection}>
              <Typography variant="h4" component="div" color="#EAEAF2">
                Sessions
              </Typography>
            </div>
          </Divider>
          <UpdateProjectDialog
            open={openUpdateProjectDialog}
            projectId={projectId}
            onClose={closeProjectDialog}
            title={loadedProject.title}
            description={loadedProject.description}
            address={loadedProject.address}
            startDate={loadedProject.startDate}
            endDate={loadedProject.endDate}
            state={loadedProject.state}
            image={`http://localhost:5000/${loadedProject.image}`}
            items={colleagueTable}
            users={loadedUsers}
            onRefresh={refreshProject}
            addUser={addColleague}
            submitColleagues={submitColleaguesHandler}
            deleteItem={deleteColleague}
          />
        </Container>
      )}

      <Sessions projectId={projectId} />

      {!!showManagement && <UpdateProject projectId={projectId} />}
    </React.Fragment>
  );
};
export default ProjectDetailed;
