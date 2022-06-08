import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
// Components
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import SubSessionChart from "../SubSession/Chart/SubSessionChart";

const SubSessionStat = (props) => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [subSessionAnswers, setSubSessionAnswers] = useState();

  const subSessionId = props.subSessionId;

  console.log("from StatItem " + subSessionId);
  useEffect(() => {
    const getSubSessionsAnswers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/subsession/${subSessionId}/answers`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        console.log("answers from StatItem " + JSON.stringify(responseData));

        setSubSessionAnswers(responseData.answers);
        props.answserNum(responseData.answers.length);
      } catch (err) {}
    };
    getSubSessionsAnswers();
  }, [sendRequest, subSessionId]);

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      {!isLoading && subSessionAnswers && (
        <SubSessionChart data={subSessionAnswers} />
      )}
    </React.Fragment>
  );
};
export default SubSessionStat;
