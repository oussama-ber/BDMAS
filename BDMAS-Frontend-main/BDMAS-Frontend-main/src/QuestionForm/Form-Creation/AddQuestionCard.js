import React, { useState } from "react";
//components
import QuestionFrom from "./QuestionFrom";
// UI material
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";

const AddQuestionCard = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  // saving the question data.
  const saveQuestionDataHandler = (enteredQuestionData) => {
    const questionData = {
      ...enteredQuestionData,
    };
    props.onAddQuestion(questionData);
    setIsEditing(false);
  };

  // Card managment.
  const startEditingHandler = () => {
    setIsEditing(!isEditing);
  };
  const stopEditingHandler = () => {
    setIsEditing(false);
  };
  const paperStyle = {
    // padding: 20,
    // width: 600,
    // margin: "20px auto",
    
  };
  return (
    <React.Fragment>
    
        
          <ListItemButton
          
            onClick={startEditingHandler}
            style={{ lineHeight: 33, margin: 0, padding: 20 }}
            selected = {isEditing}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="ADD QUESTION " />
          </ListItemButton>
       

        {isEditing && (
          <QuestionFrom
            onCancel={stopEditingHandler}
            onAddQuestion={props.onAddQuestion}
            onSaveData={saveQuestionDataHandler}
          />
        )}
      
    </React.Fragment>
  );
};
export default AddQuestionCard;
