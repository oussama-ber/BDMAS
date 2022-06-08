import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
// Components
import ProjectChart from "../../../projects/components/ProjectChart";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
const ProjectStats = (props) => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // Variables
  const [loadedSessionIds, setLoadedSessionIds] = useState();
  const [loadedAnswers, setLoadedAnswers] = useState();

  const projectId = props.projectId;
  // DONE
  useEffect(() => {
    const getSessionsIDS = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/project/${projectId}/sessionIds`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        // console.log(responseData.sessionIds);
        setLoadedSessionIds(responseData.sessionIds);
      } catch (err) {}
    };
    getSessionsIDS();
  }, [sendRequest, projectId]);

  // TESTING
  useEffect(() => {
    const getAsnwerByProjectId = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/project/project/${projectId}/answers`,
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
    getAsnwerByProjectId();
  }, [sendRequest, projectId]);

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedAnswers && loadedSessionIds && (
        <ProjectChart data={loadedAnswers} schema={loadedSessionIds} />
      )}
    </React.Fragment>
  );
};
export default ProjectStats;
