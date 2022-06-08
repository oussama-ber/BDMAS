import React, { useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Grid from "@mui/material/Grid";
// Components
import SessionItem from "./SessionItem";
import UpdateSessionDialog from "../../Sessions/Components/UpdateSessionDialog/UpdateSessionDialog";

const SessionListCard = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();


  const deactivateSessionHandler = async (SessionID) => {
    console.log(`sessionID : ${SessionID}`);
    try {
      await sendRequest(
        `http://localhost:5000/api/projects/session/deactivate/${SessionID}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      props.onRefresh((prevData) => !prevData);
    } catch (err) {}
  };

  const goToSessionDetails = (sid) =>
    history.push(`/project/${props.projectId}/session/details/${sid}`);

  return (
    <React.Fragment>
      <Grid container direction="row" spacing={3}>
        {props.items.map((session, index) => {
          return (
            <React.Fragment>
              <SessionItem
                key={index}
                id={session.id}
                title={session.title}
                state={session.state}
                startDate={session.startDate.stringDate}
                endDate={session.endDate.stringDate}
                userImage={session.creatorImage}
                enterSession={goToSessionDetails}
                onDeleteItem={deactivateSessionHandler}
              />
            </React.Fragment>
          );
        })}
      </Grid>
      <UpdateSessionDialog />
    </React.Fragment>
  );
};
export default SessionListCard;
