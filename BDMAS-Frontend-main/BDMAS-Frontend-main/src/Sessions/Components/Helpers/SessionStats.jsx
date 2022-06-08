import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
// Components
import Chart from "../../../projects/components/Chart";
import DChart from "../../../projects/components/DChart";
import ChartPerAxe from "../../../projects/components/ChartPerAxe";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
// import StatItem from "./StatItem";

const SessionStats = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // Variables
  const [loadedSubSessionIds, setLoadedSubSessionIds] = useState();

  const [answers, setAnswers] = useState();
  const [loadedAnswers, setLoadedAnswers] = useState();

  // console.log("auth.token from subSessionStats" + auth.token);

  //idsS
  const sessionId = props.sessionId;

 
  //  get sub sessions ids.
  useEffect(() => {
    const getSubsessions = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/session/${sessionId}/subsessionsIds`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        // console.log(
        //   "subSessions Ids " + JSON.stringify(responseData.subSesionsIds)
        // );
        setLoadedSubSessionIds(responseData.subSesionsIds);
      } catch (err) {}
    };
    getSubsessions();
  }, [sendRequest, sessionId]);

  // get answers by subsession id
  useEffect(() => {
    const getSubSessionsAnswers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/forms/answers/session/${sessionId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        // console.log(responseData.answers);
        setLoadedAnswers(responseData.answers);
      } catch (err) {}
    };
    getSubSessionsAnswers();
  }, [sendRequest, sessionId]);

  return (
    <React.Fragment>
      {isLoading && !loadedAnswers && <LoadingSpinner />}
      {loadedAnswers && loadedSubSessionIds && (
        <DChart data={loadedAnswers} schema={loadedSubSessionIds} />
      )}
    </React.Fragment>
  );
};
export default SessionStats;
