import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useHistory } from "react-router-dom";

const MainPosts = () => {
    const history = useHistory();
    const goToProjects = ( ) => history.push(`/projects`);
    const goToUsers = ( ) => history.push(`/users`);
    const goToForms = ( ) => history.push(`/forms`);
    const goToCreateForm = ( ) => history.push(`/createv2`);
    const goToProjectComparison = ( ) => history.push(`/comparison`);
  return (
    <Grid container spacing={4}>
      {/* USER MANAGEMENT */}
      <Grid item xs={12} md={12} lg={6}>
        <CardActionArea component="a" href="#" onClick={goToUsers}>
          <Card sx={{ display: "flex" }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography component="h2" variant="h5">
                User Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                date
              </Typography>
              <Typography variant="subtitle1" paragraph>
                this is a description for user management
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Continue reading...
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: "none", sm: "block" } }}
              image={require("../images/users.png")}
              alt="image text"
            />
          </Card>
        </CardActionArea>
      </Grid>
      {/* PROJECT MANAGEMENT */}
      <Grid item xs={12} md={12} lg={6}>
        <CardActionArea component="a" href="#" onClick={goToProjects}>
          <Card sx={{ display: "flex" }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography component="h2" variant="h5">
                Project Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                date
              </Typography>
              <Typography variant="subtitle1" paragraph>
                this is a description for project list
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Continue reading...
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: "none", sm: "block" } }}
              image={require("../images/projects.png")}
              alt="image text"
            />
          </Card>
        </CardActionArea>
      </Grid>
      {/* Project Comparison */}
      <Grid item xs={12} md={12} lg={12}>
        <CardActionArea component="a" href="#" onClick={goToProjectComparison}>
          <Card sx={{ display: "flex" }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography component="h2" variant="h5">
                Project Comparison
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                date
              </Typography>
              <Typography variant="subtitle1" paragraph>
                this is a description for project Comparison
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Continue reading...
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: "none", sm: "block" } }}
              image={require("../images/projects.png")}
              alt="image text"
            />
          </Card>
        </CardActionArea>
      </Grid>
      {/* FORM LIST */}
      <Grid item xs={12} md={6} lg={6}>
        <CardActionArea component="a" href="#" onClick={goToForms}>
          <Card sx={{ display: "flex" }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography component="h2" variant="h5">
                Form List
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                date
              </Typography>
              <Typography variant="subtitle1" paragraph>
                this is a description for form list
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Continue reading...
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: "none", sm: "block" } }}
              image={require("../images/advanced.png")}
              alt="image text"
            />
          </Card>
        </CardActionArea>
      </Grid>
      {/* CREATE FORM */}
      <Grid item xs={12} md={6} lg={6}>
        <CardActionArea component="a" href="#" onClick={goToCreateForm}>
          <Card sx={{ display: "flex" }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography component="h2" variant="h5">
                Create Form
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                date
              </Typography>
              <Typography variant="subtitle1" paragraph>
                this is a description for Form creation
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Continue reading...
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: "none", sm: "block" } }}
              image={require("../images/check_list.png")}
              alt="image text"
            />
          </Card>
        </CardActionArea>
      </Grid>
    </Grid>
  );
};
export default MainPosts;
