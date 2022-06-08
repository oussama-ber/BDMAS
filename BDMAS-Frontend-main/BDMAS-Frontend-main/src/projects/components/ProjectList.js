import React, { useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

// ui material
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputBase from "@mui/material/InputBase";
import CardActionArea from "@mui/material/CardActionArea";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
//icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
//components
import NewProjectDialog from "./Dialogs/NewProjectDialog";
import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";
import ConfirmationDialog from "./Dialogs/ConfirmationDialog";
import ProjectItem from "./ProjectItem";

const ProjectList = (props) => {
  const [searchData, setSearchData] = useState("");
  const auth = useContext(AuthContext);
  //more options
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProjectCreation, setOpenProjectCreation] = useState(false);
  const [updatedProjects, setUpadtedProjects] = useState(props.items);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [openAddProjectAlert, setOpenAddProjectAlert] = useState(false);
  const [makeSure, setMakeSure] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const MyOptions = ["Share via Whatsapp", "Delete"];

  const history = useHistory();
  const openDetailViewHandler = (projectID) =>
    history.push("/projects/detailedview/" + projectID);

  const createProject = () => history.push("/project/new");

  // Create project Dialog
  const openProjectDialog = () => setOpenProjectCreation(true);
  const closeProjectDialog = () => setOpenProjectCreation(false);

  // OPEN/CLOSE  QUESTION ADDED
  const openAddProjectAlertHandler = () => setOpenAddProjectAlert(true);
  const closeAddProjectAlertHandler = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAddProjectAlert(false);
  };
  //make sure dialog
  const openMakeSureDialog = () => setMakeSure(true);
  const closeMakeSureDialog = () => setMakeSure(false);
  const dialogTitle = "Delete Confirmation";
  const dialogContent = `Are you sure you want to proceed with this action?
  Warning: This cannot be undone. `;

  const deleteProjectHandler = async (pojectID) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/projects/desactivate/${pojectID}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setUpadtedProjects(responseData.projects);
      props.refresh((prevData) => !prevData);
    } catch (err) {}
  };

  if (props.items.length === 0) {
    return (
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
          No projects found. Maybe create one?
        </Typography>
        <WhiteModeButton icon="Add" onClick={openProjectDialog}>
          Project
        </WhiteModeButton>
        <NewProjectDialog
          refresh={props.refresh}
          open={openProjectCreation}
          onClose={closeProjectDialog}
          openAlert={props.onAddProjectAlert}
        />
      </Grid>
    );
  }

  return (
    <Grid container direction="column">
      <Grid
        item
        container
        direction="row"
        alignItems="center"
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
                inputProps={{ searchData: "search google maps" }}
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
            <WhiteModeButton onClick={openProjectDialog}>
              Create Project
            </WhiteModeButton>
            <NewProjectDialog
              refresh={props.refresh}
              open={openProjectCreation}
              onClose={closeProjectDialog}
              openAlert={props.onAddProjectAlert}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container direction="row" spacing={3}>
        <Grid item lg={12} container spacing={3} direction="row">
          {props.items
            .filter((item) => item.title.toLowerCase().includes(searchData))
            .map((project, index) => {
              return (
                <React.Fragment>
                  <ProjectItem
                    index={index}
                    id={project.id}
                    title={project.title}
                    state={project.state}
                    image={project.image}
                    description={project.description}
                    address={project.address}
                    startDate={project.startDate.stringDate}
                    endDate={project.endDate.stringDate}
                    creatorName={project.creatorData.userName}
                    creatorEmail={project.creatorData.userEmail}
                    creatorImage={project.creatorData.userImage}
                    colleagues={project.colleagues}
                    enterProject={openDetailViewHandler}
                    onDeleteItem={deleteProjectHandler}
                    onAlert={props.onDeleteProjectAlert}
                  />
                </React.Fragment>
              );
            })}
        </Grid>
      </Grid>
      {/* <Snackbar
        open={openAddProjectAlert}
        autoHideDuration={2000}
        onClose={closeAddProjectAlertHandler}
      >
        <Alert
          onClose={closeAddProjectAlertHandler}
          severity="success"
          sx={{ width: "100%" }}
        >
          Project Added !
        </Alert>
      </Snackbar> */}
    </Grid>
  );
};

export default ProjectList;
