import React, { useEffect, useState } from "react";

import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
//ui material
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Avatar, Grid, requirePropFactory } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";

//Pictures
import testImage from "../../shared/images/test.png";

const Profile = () => {
  const [loadedUser, setLoadedUser] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  console.log("user role " + auth.role);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/user/${userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId]);
  console.log("profile loaded user : " + loadedUser);
  const styles = {
    paperContainer: {
      backgroundImage: `url(${testImage})`,
    },
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {loadedUser && (
        <React.Fragment>
          <Grid
            container
            direction="row"
            justifyContent="center"
            justifyItems="center"
          >
            <Paper
              style={styles.paperContainer}
              sx={{ width: "100%", height: 200 }}
            >
              <Grid
                item
                lg={12}
                container
                justifyContent="center"
                justifyItems="center"
              >
                <Grid item>
                  <Avatar
                    src={`http://localhost:5000/${loadedUser.userImage}`}
                    alt={loadedUser.userName}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant="h3"
                    gutterBottom
                    component="div"
                    color="white"
                  >
                    {loadedUser.userName}
                  </Typography>
                  <Typography variant="h6" gutterBottom component="div" color="white">{loadedUser.userEmail}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid align="center">
            <Typography>{loadedUser.userName}</Typography>
            <Typography>{loadedUser.userEmail}</Typography>
            <Avatar
              src={`http://localhost:5000/${loadedUser.userImage}`}
              alt={loadedUser.userName}
            />
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Profile;
