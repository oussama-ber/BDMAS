import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { NavLink } from "react-router-dom";
import Link from "@mui/material/Link";
import ProjectList from "../components/ProjectList";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
//ui material
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Chip from "@mui/material/Chip";
import SessionListCard from "../components/SessionListCard";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Projects = () => {
  const auth = useContext(AuthContext);
  const [loadedProjects, setLoadedProjects] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [refresh, setRefresh] = useState(false);
  const userId = useParams().userId;
  const [openAddProjectAlert, setOpenAddProjectAlert] = useState(false);
  const [openDeleteProjectAlert, setOpenDeleteProjectAlert] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedProjects(responseData.projects);
      } catch (err) {}
    };
    fetchProjects();
  }, [sendRequest, userId, refresh]);

  const projectDeletedHandler = (deletedProjectId) => {
    setLoadedProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== deletedProjectId)
    );
  };
  const breadcrumbs = [
    <NavLink
      style={{ textDecoration: "none" }}
      key="1"
      color="white"
      href="/user/dashboard"
      to="/user/dashboard"
    >
      <Typography key="2" color="white">
        Dashboard
      </Typography>
    </NavLink>,
    <Typography key="2" color="#FFE600">
      Projects
    </Typography>,
  ];

  // OPEN/CLOSE  PROJECT ADDED
  const openAddProjectAlertHandler = () => setOpenAddProjectAlert(true);
  const closeAddProjectAlertHandler = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAddProjectAlert(false);
    console.log("alert should close" + reason);
  };
  // OPEN/CLOSE  Project Deleted
  const openDeleteProjectAlertHandler = () => setOpenDeleteProjectAlert(true);
  const closeDeleteProjectAlertHandler = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteProjectAlert(false);
  };
  return (
    <React.Fragment>
      <CssBaseline />

      <Container maxWidth="false">
        <Breadcrumbs
          color="white"
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        <Container maxWidth="false">
          <Typography
            sx={{ mb: 6, mt: 2 }}
            variant="h3"
            component="div"
            color="#FFE600"
          >
            Projects List
          </Typography>

          <Box
            display="flex"
            width="auto"
            height="auto"
            alignItems="center"
            justifyContent="center"
            marginTop={4}
          >
            {!isLoading && loadedProjects && (
              <ProjectList
                items={loadedProjects}
                onDeleteProject={projectDeletedHandler}
                refresh={setRefresh}
                onAddProjectAlert={openAddProjectAlertHandler}
                onDeleteProjectAlert={openDeleteProjectAlertHandler}
              />
            )}
          </Box>
        </Container>
      </Container>

      <Snackbar
        open={openAddProjectAlert}
        onClose={closeAddProjectAlertHandler}
        autoHideDuration={3000}
      >
        <Alert
          onClose={closeAddProjectAlertHandler}
          severity="success"
          sx={{ width: "100%" }}
        >
          Project Added !
        </Alert>
      </Snackbar>
      <Snackbar
        open={openDeleteProjectAlert}
        onClose={closeDeleteProjectAlertHandler}
        autoHideDuration={3000}
      >
        <Alert
          onClose={closeDeleteProjectAlertHandler}
          severity="error"
          sx={{ width: "100%" }}
        >
          Project Deleted !
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Projects;
