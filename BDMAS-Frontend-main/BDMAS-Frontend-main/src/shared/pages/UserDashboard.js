import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Button, CardActionArea, CardActions } from "@mui/material";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";

import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import Container from "@mui/material/Container";
import "./Dashboard.css";
import MainFeature from "../UIComponents/MainFeature";
import MainPosts from "../UIComponents/MainPosts";

import post1 from "../util/post1.md";
import post2 from "../util/post2.md";
import post3 from "../util/post3.md";
const posts = [post1, post2, post3];
const UserDashboard = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const addProjectPageHandler = () => history.push(`/projects/new`);

  const projectsListHandler = () => history.push(`/projects`);

  const myProjectsHandler = () => history.push(`/${auth.userId}/projects`);

  const breadcrumbs = [
    <Typography key="2" color="#FFE600">
      {`> Dashboard`}
    </Typography>,
  ];
  return (
    <React.Fragment>
      <Container maxWidth="false">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          mb={2}
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Container>
      <Container maxWidth="xl">
        <MainFeature />
        <MainPosts />
      </Container>
    </React.Fragment>
  );
};
export default UserDashboard;
