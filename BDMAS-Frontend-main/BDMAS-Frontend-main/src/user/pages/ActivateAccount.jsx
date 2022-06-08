import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
const ActivateAccount = () => {
    const secretToken = useParams().secretToken;
    const history = useHistory();

  const [mainPassword, setMainPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [submitdisabled, setSubmitdisabled] = useState(true);
  const getMainPassword = (event) => setMainPassword(event.target.value);
  const getSecondPassword = (event) => setSecondPassword(event.target.value);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(()=>{
    if (
        (!mainPassword || mainPassword.length === 0) &&
        (!secondPassword || secondPassword.length === 0)
      ) {
        setSubmitdisabled(true);
      } else {
        if (mainPassword === secondPassword) {
          setSubmitdisabled(false);
        }
      }
  },[mainPassword, secondPassword])

  const activateAccount = async () => {
    try {
        //TO CHANGE THE URL
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/user/activate/${secretToken}`,
          "POST",
          JSON.stringify({password: mainPassword}), 
          {
            "Content-Type": "application/json"
          }
        );
        history.push(`/authenticate`);
        
      } catch (err) {}
  }
  

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#F6F6FA",
          padding: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#FFE600", color: '#3A3A4A'}}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color="Black">
          Account Activation
        </Typography>
        <hr  />
        <Box component="form" noValidate sx={{ mt: 3 }} color="white">
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={12} lg={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password1"
                autoComplete="new-password"
                onChange={getMainPassword}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Reenter Password"
                type="password"
                id="password2"
                autoComplete="new-password"
                onChange={getSecondPassword}
              />
            </Grid>
          </Grid>
          <Button
            sx={{
              borderRadius: 0,
              borderColor: "#3A3A4A",
              backgroundColor: "#FFE600",
              color: "#2E2E38",
              mt: 3,
              mb: 2,
            }}
            color="inherit"
            variant="outlined"
            fullWidth
            disabled={submitdisabled}
            onClick={activateAccount}
          >
            Activate
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/authenticate" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
export default ActivateAccount;
