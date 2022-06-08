import React, { useState, useContext, useEffect } from "react";

// import Button from '../../shared/components/FormElements/Button';

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
// import './PlaceItem.css';

// ui material
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionActions from "@mui/material/AccordionActions";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import SubUserProjectsList from "./SubUserPojectsList";
import { Box } from "@mui/system";

// update file: DONE works: TODO
const UserItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`http://localhost:5000/api/users`, "DELETE", null, {
        Authorization: "Bearer " + auth.token,
      });
      props.onDelete(props.id);
    } catch (err) {}
  };
  const [loadedProjects, setLoadedProjects] = useState();
  const currentUserId = props.id;
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/user/${currentUserId}`,
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
  }, [sendRequest]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
        <Avatar src={`http://localhost:5000/${props.image}`} alt={props.name} />
        <Typography variant="h6" gutterBottom component="div" marginLeft={2}>
          {props.name}
        </Typography>
        <Typography variant="overline" display="block" gutterBottom>
          {props.email}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Box textAlign="center">
            <Typography>User's projects</Typography>
          </Box>
          {loadedProjects &&
            loadedProjects.map((project) => (
              <SubUserProjectsList
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                address={project.address}
              />
            ))}
        </List>
      </AccordionDetails>
      <AccordionActions>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
          Delete
        </Button>
        <Button variant="contained" color="primary" onClick={openMapHandler}>
          Update
        </Button>
        <Button variant="contained" color="primary" onClick={openMapHandler} disabled>
          Details
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default UserItem;
