import React, { useEffect, useState } from "react";
import Question from "../models/Question";
import ListController from "../Controllers/ListController";

import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";

//icons
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
//components
import WhiteModeButton from "../../../shared/UIElements/WhiteModeButton";

export default function QuestionForm({ question, setQuestion }) {
  const [preview, setPreview] = useState(false);
  const [minVal, setMinVal] = useState(1);
  const [maxVal, setMaxVal] = useState(5);
  const [questionVal, setQuestionVal] = useState(1);
  const [finalArray, setFinalArray] = useState([]);

  const [isRequired, setIsRequired] = useState(true);

  function handleChangeText(e) {
    setQuestion(question.merge({ name: e.target.value }));
  }
  function handlerRateMin(e) {
    setMinVal(e.target.value);
    setQuestion(question.merge({ rateMin: e.target.value }));
  }
  function handlerRateMax(e) {
    setMaxVal(e.target.value);
    setQuestion(question.merge({ rateMax: e.target.value }));
  }
  function handlerMinRateDescription(e) {
    setQuestion(question.merge({ minRateDescription: e.target.value }));
  }
  function handlerMaxRateDescription(e) {
    setQuestion(question.merge({ maxRateDescription: e.target.value }));
  }

  function handleChangeType(e) {
    setQuestion(question.merge({ type: e.target.value }));
  }

  function setOptions(choices) {
    setQuestion(question.merge({ choices }));
  }
  // TESTING
  function setChoicesWithVal(choicesWithVal) {
    setQuestion(question.merge({ choicesWithVal: choicesWithVal }));
  }

  function setCoef(e) {
    setQuestion(question.merge({ coef: e.target.value }));
  }
  function setRequirement(e) {
    setIsRequired(question.merge({ isRequired: e.target.value }));
  }

  const listController = new ListController(question.choices, setOptions);

  const listControllerForValues = new ListController(
    question.choicesWithVal,
    setChoicesWithVal
  );
  console.log("here is the question :: ------- : " + JSON.stringify(question));
  // console.log("question.choicesWithVal : " + question.choicesWithVal);
  const changleViewHandler = () => {
    setPreview(!preview);
  };

  const removeItems = (i) => {
    listControllerForValues.remove(i);
  };
  const addMainArray1 = () =>
    listControllerForValues.add({ option: "", value: 1 });
  const addMainArray2 = () => listController.add("");

  // TESTING TO CHANGE
  function addItems() {
    addMainArray1();
    question.choices.push("");
  }
  useEffect(() => {
    // console.log('question.choicesWithVal :' + question.choicesWithVal.map((item, i)=>{
    //   return item.option;
    // }))
    question.choices = question.choicesWithVal.map((item, i) => {
      return item.option;
    });
  }, [listControllerForValues]);
  //Read input
  const readInput = (event, i) => {
    event.preventDefault();
    listControllerForValues.set(i, {
      [event.target.name]: event.target.value,
      value: question.choicesWithVal[i].value,
    });
    // console.log(
    //   "listControllerForValues.getArray()" + listControllerForValues.getArray()
    // );
  };
  const readValue = (event, i) => {
    event.preventDefault();
    listControllerForValues.set(i, {
      option: question.choicesWithVal[i].option,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div class="container">
      <div class="row">
        <div className="col">
          <TextField
            type="text"
            label="Question"
            variant="standard"
            value={question.name}
            onChange={handleChangeText}
          />
        </div>
        <div className="col">
          <select
            className="form-select form-select-lg mb-3"
            aria-label=".form-select-lg example"
            id="question-type"
            value={question.type}
            onChange={handleChangeType}
          >
            {Object.values(Question.TYPES).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <TextField
            id="Coef"
            type="number"
            sx={{ width: 90, mr: 4, ml: 4 }}
            inputProps={{ min: 0 }}
            label="Coef"
            variant="standard"
            value={question.coef}
            onChange={setCoef}
          />
        </div>
        <div className="col">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
                  onChange={setRequirement}
                  color="success"
                />
              }
              label="Required"
            />
          </FormGroup>
        </div>
      </div>

      <br />

      {question.hasOptions && (
        <Card
          variant="outlined"
          sx={{ marginTop: 3, padding: 1, backgroundColor: "#F6F6FA" }}
        >
          <CardHeader title="Choices" />
          {/* <Typography variant="h4" gutterBottom component="div">
              Choices
            </Typography> */}
          <div style={{ marginButtom: 3 }}>
            {question.choicesWithVal &&
              question.choicesWithVal.map((option, i) => (
                <ListItem key={i}>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    spacing={0}
                  >
                    <Grid item>
                      <TextField
                        type="text"
                        variant="standard"
                        placeholder="Enter option"
                        label="Choice"
                        name="option"
                        value={option.option}
                        onChange={(e) => readInput(e, i)}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="value"
                        type="number"
                        label="Value"
                        placeholder="Enter Value"
                        name="value"
                        value={option.value}
                        inputProps={{ min: 0 }}
                        variant="standard"
                        onChange={(e) => readValue(e, i)}
                        sx={{ width: 80, ml: 2 }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container direction="row" alignItems="flex-start">
                    <Grid item>
                      <IconButton
                        onClick={() => listControllerForValues.moveUp(i)}
                      >
                        <KeyboardArrowUpIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        onClick={() => listControllerForValues.moveDown(i)}
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => removeItems(i)}>
                        <DeleteOutlineIcon color="error" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
          </div>

          <WhiteModeButton onClick={addItems} icon="Add">
            Add Option
          </WhiteModeButton>
        </Card>
      )}
      {question.isRating && (
        <div className="container mt-10">
          <div class="row mt-3">
            <div class="col">
              <TextField
                id="minRate"
                type="number"
                sx={{ width: 180 }}
                inputProps={{ min: 1, max: +maxVal - 1 }}
                label="Minimum Rate"
                variant="standard"
                value={question.rateMin}
                onChange={handlerRateMin}
              />{" "}
            </div>
            <div class="col">
              {" "}
              <TextField
                id="maxRate"
                type="number"
                inputProps={{ min: +minVal + 1 }}
                label="Maximum Rate"
                variant="standard"
                value={question.rateMax}
                onChange={handlerRateMax}
              />{" "}
            </div>
          </div>
          <div class="row mt-3">
            <div class="col">
              <TextField
                id="minRateDescription"
                type="text"
                label="Min Rate Description"
                variant="standard"
                value={question.minRateDescription}
                onChange={handlerMinRateDescription}
              />{" "}
            </div>
            <div class="col">
              <TextField
                id="maxRateDescription"
                type="text"
                label="Max Rate Description"
                variant="standard"
                value={question.maxRateDescription}
                onChange={handlerMaxRateDescription}
              />{" "}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
