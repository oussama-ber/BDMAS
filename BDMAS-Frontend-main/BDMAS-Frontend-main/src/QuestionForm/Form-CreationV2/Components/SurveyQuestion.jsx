import React, { useState } from "react";
import QuestionForm from "./QuestionForm";
//mui
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

//icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DoneIcon from "@mui/icons-material/Done";
import Grid from "@mui/material/Grid";
import { ButtonGroup, TextField, Typography } from "@mui/material";
export default function SurveyQuestion({
  question,
  setQuestion,
  removeQuestion,
  moveQuestionUp,
  moveQuestionDown,
}) {
  const [editing, setEditing] = useState(false);

  function toggleEditing() {
    setEditing(!editing);
  }

  function range(start, end) {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  }
  let resultButtons = [];
  if (question.isRating) {
    resultButtons = range(+question.rateMin, +question.rateMax);
    console.log(resultButtons);
  }
  

  return (
    <div className="card m-3 p-3" style={{ backgroundColor: "#EAEAF2" }}>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-8">
            {editing ? (
              <QuestionForm question={question} setQuestion={setQuestion} />
            ) : (
              <>
                <h5 className="card-title">
                {question.name} {question.isRequired === true ? "*" : ""}
                </h5>
                {question.hasOptions ? (
                  question.choices.map((option, i) => (
                    <ol key={i}>
                      <input
                        type={question.inputType}
                        id={option}
                        name={option}
                        value={option}
                        disabled
                        style={{ padding: 3 }}
                      />
                      {option}
                    </ol>
                  ))
                ) : (
                  <>
                    {question.isRating ? (
                      <ButtonGroup>
                        <Typography sx={{ marginX: 1 }}>
                          {question.minRateDescription}
                        </Typography>
                        {resultButtons.map((item, index) => {
                          return (
                            <Button
                              key={item}
                              sx={{
                                borderRadius: 0,
                                borderColor: "#3A3A4A ",
                              }}
                            >
                              {item}
                            </Button>
                          );
                        })}
                        <Typography sx={{ marginX: 1 }}>
                          {" "}
                          {question.maxRateDescription}
                        </Typography>
                      </ButtonGroup>
                    ) : (
                      <textarea disabled />
                    )}{" "}
                  </>
                )}
              </>
            )}
          </div>
          <div className="col-sm-4">
            <Button onClick={toggleEditing}>
              {editing ? (
                <>
                  <DoneIcon />
                </>
              ) : (
                <>
                  <EditIcon />
                </>
              )}
            </Button>
            <IconButton
              onClick={removeQuestion}
              aria-label="Delete Question"
              variant="outlined"
              color="error"
            >
              <DeleteIcon color="error" />
            </IconButton>
          </div>
        </div>
        <br />
        Move Question:{" "}
        <Button
          sx={{
            borderRadius: 0,
            borderColor: "#3A3A4A ",
            backgroundColor: "#FFE600",
            marginLeft: 3,
          }}
          color="inherit"
          onClick={moveQuestionUp}
          variant="outlined"
          endIcon={<KeyboardArrowUpIcon />}
        >
          Up
        </Button>
        <Button
          sx={{
            borderRadius: 0,
            borderColor: "#3A3A4A ",
            backgroundColor: "#FFE600",
            marginLeft: 3,
          }}
          color="inherit"
          onClick={moveQuestionDown}
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
        >
          <i className="fas fa-angle-down icon" />
          Down
        </Button>
      </div>
    </div>
  );
}
