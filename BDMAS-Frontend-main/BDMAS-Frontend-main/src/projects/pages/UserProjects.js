import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import ProjectList from "../components/ProjectList";
import ErrorModal from '../../shared/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import { useHttpClient } from "../../shared/hooks/http-hook";
//ui material
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Auth from "../../Auth/Pages/Auth";

const UserProjects = () => {
  const auth = useContext(AuthContext);
  const [loadedProjects, setLoadedProjects] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/user/${userId}`,
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
  }, [sendRequest, userId]);

  const projectDeletedHandler = (deletedProjectId) => {
    setLoadedProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== deletedProjectId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Grid  align="center"
        >
        <Typography  sx={{ mt: 4, mb: 2 }} variant="h3" gutterBottom component="div" color='white'>
          Projects List
        </Typography>
      </Grid>
      <Box
        display="flex"
        width="auto"
        height="auto"
        alignItems="center"
        justifyContent="center"
        marginTop={7}
      >
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
       
        {!isLoading && loadedProjects && (
          <ProjectList
            items={loadedProjects}
            onDeleteProject={projectDeletedHandler}
          />
        )}
      </Box>
    </React.Fragment>
  );
};

export default UserProjects;
