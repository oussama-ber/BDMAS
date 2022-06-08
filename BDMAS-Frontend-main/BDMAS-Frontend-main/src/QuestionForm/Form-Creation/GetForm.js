import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { NavLink } from "react-router-dom";

import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

// Survey
import "survey-react/survey.css";
import * as Survey from "survey-react";
// MUI
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
//icons
import UndoIcon from "@mui/icons-material/Undo";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// Components
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";

const GetForm = () => {
  const [loadedform, setLoadedForm] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const formId = useParams().formId;

  useEffect(() => {
    const GetFormById = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/forms/form/${formId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        console.log(responseData.form[0].form);
        console.log(JSON.stringify(responseData));

        //  const  newResponseData = JSON.stringify(responseData.form[0].form).replace("\'", '');

        //    newResponseData = JSON.stringify(responseData).replace('\'', '');
        //  console.log(newResponseData);

        setLoadedForm(responseData.form[0].form);
      } catch (err) {}
    };
    GetFormById();
  }, [sendRequest, formId]);

  const backToFormList = () => {
    history.push("/forms");
  };
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
      color="white"
      href="/forms"
      to="/forms"
    >
      <Typography color="white">Forms</Typography>
    </NavLink>,
    <Typography key="2" color="#FFE600">
      Form
    </Typography>,
  ];
  // console.log(JSON.stringify(loadedform));
  const model = new Survey.Model(loadedform);
  return (
    <React.Fragment>
      <Breadcrumbs
        color="white"
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        mb={5}
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
      {!isLoading && !loadedform && (
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
            There is no survey, please check your connection.
          </Typography>
        </Grid>
      )}
      {loadedform && !isLoading && (
        <Container maxWidth="false">
          <Container maxWidth="false">
          <Typography
            sx={{ mb: 6, mt: 2 }}
            variant="h3"
            component="div"
            color="#FFE600"
          >
            Form
          </Typography>

            {/* {loadedform && <h1>{JSON.stringify (responseData)}</h1>} */}
            {loadedform && <Survey.Survey model={model} json={loadedform} />}
          </Container>
        </Container>
      )}
    </React.Fragment>
  );
};
export default GetForm;
