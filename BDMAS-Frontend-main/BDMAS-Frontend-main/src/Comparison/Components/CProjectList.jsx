import React, { useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

// MUI
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputBase from "@mui/material/InputBase";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// Date Picker

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//components
import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";
import CProjectItem from "./CProjectItem";
import ProjectsTable from "./ProjectsTable";
import ComparisonChart from "./ComparisonChart";
import { Avatar } from "@mui/material";

const CProjectList = (props) => {
  const [searchData, setSearchData] = useState("");
  const auth = useContext(AuthContext);
  const history = useHistory();
  //more options
  const [projects, setProjects] = useState(props.items);

  const [filtredProjects, setFiltredProjects] = useState(props.items);
  const [finalProject, setFinalProject] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // FILTERS
  let [projectStatus, setProjectStatus] = useState("NAN");
  let [beforedateFilter, setBeforeDateFilter] = useState();
  let [afterdateFilter, setAfterDateFilter] = useState();
  let [projectCreator, setProjectCreator] = useState();
  let [projectAddress, setProjectAddress] = useState();

  const usersList = props.items
    .map((project) => project.creatorData)
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.userEmail === value.userEmail)
    );
  const projectAddresses = [
    ...new Set(props.items.map((project) => project.address)),
  ];

  // console.log(`uniqueAddresses : ${JSON.stringify(projectAddresses)}`);
  const [projectCreators, setProjectCreators] = useState(usersList);
  const [projectsToChart, setProjectsToChart] = useState([]);
  // console.log(`beforedateFilter ${beforedateFilter}`);

  // DONE
  const projectStatusHandler = (event) => {
    setProjectStatus(event.target.value);
  };
  const updateDate = (newValue, nDate) => {
    if (nDate === "startDate") {
      setBeforeDateFilter(newValue);
    } else if (nDate === "endDate") {
      setAfterDateFilter(newValue);
    }
  };
  const resetFilters = () => {
    setProjectStatus("NAN");
    setBeforeDateFilter(null);
    setAfterDateFilter(null);
    setProjectCreator(null);
    setProjectAddress();
  };
  const creatorHandler = (event) => setProjectCreator(event.targer.value);
  const projectAddressHandler = (event) => {
    setProjectAddress(event.target.value);
  };

  const getProjectCreatorHandler = (event) => {};
  const openDetailViewHandler = (projectID) =>
    history.push("/projects/detailedview/" + projectID);

  // Create project Dialog
  const projectManagementHandler = () => history.push(`/projects`);

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

        <WhiteModeButton icon="Add" onClick={projectManagementHandler}>
          Project Management
        </WhiteModeButton>
        {/* RESET */}
        <WhiteModeButton icon="Add" onClick={resetFilters}>
          Reset Filters
        </WhiteModeButton>
      </Grid>
    );
  }
  const forwardProjectsToChart = (data) => setProjectsToChart(data);

  return (
    <Grid container direction="column">
      <Grid item lg={12} sx={{ mb: 5 }}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: "#23232F",
            paddingTop: 1,
            paddingLeft: 3,
            paddingRight: 3,
            paddingBottom: 1,
          }}
        >
          <CardHeader
            title={
              <Typography variant="h3" component="div" color="#FFE600">
                Filters
              </Typography>
            }
          />
          <CardContent>
            {/* Filters */}
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {/* Filter By Status */}
              <Grid item lg={1}>
                <FormControl
                  variant="filled"
                  sx={{
                    m: 1,
                    minWidth: 120,
                    backgroundColor: "white",
                    borderRadius: 1,
                  }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Project Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={projectStatus}
                    onChange={projectStatusHandler}
                    label="Chart Type"
                  >
                    <MenuItem value={"NAN"}>NAN</MenuItem>
                    <MenuItem value={"Done"}>Done</MenuItem>
                    <MenuItem value={"Pending"}>Pending</MenuItem>
                    <MenuItem value={"Closed"}>Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Filters Dates */}

              <Grid item lg={5} container direction="row" spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item>
                    <Paper component="form">
                      <DatePicker
                        label="Start Date"
                        name="startDate"
                        value={beforedateFilter}
                        onChange={(newValue) => {
                          updateDate(newValue, "startDate");
                        }}
                        renderInput={(params) => (
                          <TextField variant="filled" {...params} />
                        )}
                      />
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper component="form">
                      <DatePicker
                        label="End Date"
                        name="endDate"
                        value={afterdateFilter}
                        onChange={(newValue) => {
                          updateDate(newValue, "endDate");
                        }}
                        renderInput={(params) => (
                          <TextField variant="filled" {...params} />
                        )}
                      />
                    </Paper>
                  </Grid>
                </LocalizationProvider>
              </Grid>
              {/* PROJECT CREATOR FILTER */}
              <Grid item lg={2}>
                <FormControl
                  variant="filled"
                  sx={{
                    m: 1,
                    minWidth: 120,
                    backgroundColor: "white",
                    borderRadius: 1,
                  }}
                >
                  <InputLabel id="input-project-creator">
                    Project Creator
                  </InputLabel>
                  <Select
                    labelId="input-project-creator"
                    id="demo-simple"
                    value={projectCreator}
                    onChange={creatorHandler}
                    label="Chart Type"
                  >
                    {projectCreators &&
                      projectCreators.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item.userName}>
                            <Grid
                              container
                              dicrection="row"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Avatar
                                src={`http://localhost:5000/${item.userImage}`}
                                alt={item.userImage}
                              />
                              <Typography> {item.userName}</Typography>
                              <Typography> ({item.userEmail})</Typography>
                            </Grid>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              {/* PROJECT ADDRESS FILTER */}
              <Grid item lg={2}>
                <FormControl
                  variant="filled"
                  sx={{
                    m: 1,
                    minWidth: 120,
                    maxWidth: 300,
                    backgroundColor: "white",
                    borderRadius: 1,
                  }}
                >
                  <InputLabel id="input-project-creator">
                    Project Address
                  </InputLabel>
                  <Select
                    labelId="input-project-creator"
                    id="demo-simple"
                    value={projectAddress}
                    onChange={projectAddressHandler}
                    label="Chart Type"
                  >
                    {projectAddresses &&
                      projectAddresses.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item}>
                            <Typography>{item}</Typography>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* Filter By title */}
            <Grid
              item
              container
              direction="row"
              alignItems="center"
              spacing={8}
            >
              <Grid item lg={7}>
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 400,
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
                  <WhiteModeButton onClick={projectManagementHandler}>
                    Project Management
                  </WhiteModeButton>
                  <WhiteModeButton onClick={resetFilters}>
                    Reset Filters
                  </WhiteModeButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid container direction="row" spacing={3}>
        {/* <Grid item lg={12} container spacing={3} direction="row">
          {projects
            .filter((item) => {
              if (projectStatus !== "NAN") {
                return item.state === projectStatus;
              } else {
                return true;
              }
            })
            .filter((item) => {
              //check start date and filter
              let paseBefore = true;
              let paseAfter = true;

              if (beforedateFilter) {
                paseBefore =
                  new Date(item.startDate.date) >= new Date(beforedateFilter);
              } else paseBefore = true;
              if (afterdateFilter) {
                paseAfter =
                  new Date(item.endDate.date) <= new Date(afterdateFilter);
              } else paseAfter = true;
              return paseBefore && paseAfter;
            })

            .filter((item) => {
              if (projectCreator) {
                return item.creatorData.userEmail === projectCreator.userEmail;
              } else {
                return true;
              }
            })
            .filter((item) => {
              if (projectAddress) {
                return item.address === projectAddress;
              } else {
                return true;
              }
            })
            .filter((item) => item.title.toLowerCase().includes(searchData))
            .map((project, index) => {
              return (
                <React.Fragment>
                  <CProjectItem
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
                  />
                </React.Fragment>
              );
            })}
        </Grid> */}
        <Grid item lg={6} container spacing={3} direction="row">
          {projects && (
            <ProjectsTable
              forwardData={forwardProjectsToChart}
              data={projects
                .filter((item) => {
                  if (projectStatus !== "NAN") {
                    return item.state === projectStatus;
                  } else {
                    return true;
                  }
                })
                .filter((item) => {
                  //check start date and filter
                  let paseBefore = true;
                  let paseAfter = true;

                  if (beforedateFilter) {
                    paseBefore =
                      new Date(item.startDate.date) >=
                      new Date(beforedateFilter);
                  } else paseBefore = true;
                  if (afterdateFilter) {
                    paseAfter =
                      new Date(item.endDate.date) <= new Date(afterdateFilter);
                  } else paseAfter = true;
                  return paseBefore && paseAfter;
                })
                .filter((item) => {
                  if (projectCreator) {
                    return (
                      item.creatorData.userEmail === projectCreator.userEmail
                    );
                  } else {
                    return true;
                  }
                })
                .filter((item) => {
                  if (projectAddress) {
                    return item.address === projectAddress;
                  } else {
                    return true;
                  }
                })
                .filter((item) =>
                  item.title.toLowerCase().includes(searchData)
                )}
            />
          )}
        </Grid>
        <Grid item lg={6} container spacing={3} direction="row">
          {projectsToChart && <ComparisonChart data={projectsToChart} />}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CProjectList;
