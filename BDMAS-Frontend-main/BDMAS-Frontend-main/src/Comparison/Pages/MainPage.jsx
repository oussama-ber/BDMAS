import React, { useContext, useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
//Mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
//icons
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// Components
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import CProjectList from "../Components/CProjectList";

const MainPage = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // Varialbles.
  const [loadedProjects, setLoadedProjects] = useState();
  const [loadedProjectswithScore, setLoadedProjectWithScore] = useState();
  const [refresh, setRefresh] = useState(false);

  // get projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/projects/all`,
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
  }, [sendRequest, refresh]);

  // Breadcrumbs
  const breadcrumbs = [
    <NavLink
      style={{ textDecoration: "none" }}
      underline="hover"
      key="1"
      color="white"
      href="/dashboard"
      to="/dashboard"
    >
      <Typography color="white">Dashboard</Typography>
    </NavLink>,
    <Typography key="2" color="#FFE600">
      Comparison
    </Typography>,
  ];

  return (
    <React.Fragment>
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
        <Grid container direction="row" alignItems="center">
          <Grid item lg={12} sx={{ mt: 3 }}>
            {!isLoading && loadedProjects && (
              <CProjectList items={loadedProjects} refresh={setRefresh} />
            )}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
export default MainPage;
