import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { NavLink } from "react-router-dom";
//ui material
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormsList from "./FormsList";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
//icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Forms = () => {
  const auth = useContext(AuthContext);
  const [loadedForms, setLoadedForms] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [refreshForms, setRefreshFroms] = useState(false);
  const history = useHistory();

  const refreshData = () => setRefreshFroms((prevData) => !prevData);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/forms`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(JSON.parse(responseData.forms[0].form).title);
        setLoadedForms(responseData);
      } catch (err) {}
    };
    fetchForms();
  }, [sendRequest, refreshForms]);

  // TO CHANGE
  const deleteFromHandler = async (formID) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/forms/form/${formID}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
    formDeletedHandler(formID);
  };
  // DONE
  const deactivateFormHandler = async (formID) => {
    formDeletedHandler(formID);
    try {
      await sendRequest(
        `http://localhost:5000/api/forms/form/desactivate/${formID}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      refreshData();
    } catch (err) {}
  };

  const formDeletedHandler = (formId) => {
    console.log("the formid to delete" + formId);

    if (!loadedForms || loadedForms.forms.length === 0) {
      console.log("should stop");
      return;
    } else if (loadedForms.forms.length >= 1) {
      setLoadedForms((prevData) =>
      prevData.forms.filter((form) => form._id !== formId)
      );
      console.log("length before deletion" + loadedForms.forms.length);
      console.log(
        "filtred forms : " +
          loadedForms.forms.filter((form) => form._id !== formId) +
          "length" +
          loadedForms.forms.filter((form) => form._id !== formId).length
      );
    }
  };
  // const filterHandler = (form)

  const onCreateForm = () => history.push(`/createv2`);
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
    <Typography key="2" color="#FFE600">
      Forms
    </Typography>,
  ];

  // if (!isLoading && loadedForms) {
  //   console.log("loadedForms.forms.length" + loadedForms.forms.length);
  //   console.log(
  //     "loadedforms title : " + JSON.parse(loadedForms.forms[0].form).title
  //   );
  // }
  if (!isLoading && !loadedForms) {
    return (
      <div className="form-list center">
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
            No Forms found. Maybe create one?
          </Typography>
          <WhiteModeButton icon="Add" onClick={onCreateForm}>
            Create Form
          </WhiteModeButton>
        </Grid>
      </div>
    );
  }
  return (
    <React.Fragment>
      <Breadcrumbs
        color="white"
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner />}
      <Container maxWidth="false">
        {/* TITLE */}
        <Container maxWidth="false">
          <Typography
            sx={{ mb: 6, mt: 2 }}
            variant="h3"
            component="div"
            color="#FFE600"
          >
            Forms List
          </Typography>
          {!isLoading && loadedForms && (
            <Grid item lg={12} md={12} xs={12}>
              <FormsList
                onCreateForm={onCreateForm}
                items={loadedForms}
                onDeleteProject={deactivateFormHandler}
              />
            </Grid>
          )}
        </Container>
      </Container>
    </React.Fragment>
  );
};

export default Forms;
