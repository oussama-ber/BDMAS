import React, { useState } from "react";
// material ui.
import {
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";

//icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from '@mui/icons-material/Add';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

//components
import ItemsList from "./ItemsList";

// question : title is the actual question (seen by the user), name : result seen by the developer
const QuestionFrom = (props) => {
  //predefined questions (comment, rating, radio questions).
  let comment = {
    type: "comment",
    name: "",
    title: "What would make you more satisfied with the Product?",
  };
  let ratingQuestion = {
    type: "rating",
    name: "satisfaction",
    title: "How satisfied are you with the Product?",
    minRateDescription: "Not Satisfied",
    maxRateDescription: "Completely satisfied",
  };
  let radioQuestion = {
    type: "radiogroup",
    name: "car",
    title: "What car are you driving?",
    isRequired: true,
    colCount: 4,
    choices: [], // TO CHANGE
  };
  let checkQuestion = {
    type: "checkbox",
    name: "",
    title: "",
    isRequired: true,
    colCount: 4,
    choices: [],
  };

  const [enteredQuestion, setEnteredQuestion] = useState("");
  const [type, setType] = useState("");
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [isDisabledItemButton, setIsDisabledItemButton] = useState(true);
  const [choicesForm, setChoicesFrom] = useState(radioQuestion.choices); // TODO
  const [item, setItem] = useState();
  const [itemIndex, setItemIndex] = useState(1);
  const [itemTitleError, setItemTitleError] = useState(false);
  const [startCreateQuestion, setStartCreateQuestion] = useState(false);
  const [required, setRequired] = useState(true);
  const [startSubmit, setStartSubmiting] = useState(false);

  //update type
  const handleChange = (event) => {
    setType(event.target.value);
  };
  //Get question data.
  const questionChangeHandler = (event) => {
    setEnteredQuestion(event.target.value);
    changeDisabledHandler(event.target.value);
  };
  // check quetion type, using the predefined quetions update question's title, name.
  const submitHandler = (event) => {
    let questionn;
    //check preffered type.
    switch (type) {
      case "Comment":
        questionn = { ...comment };
        break;
      case "Rating":
        questionn = { ...ratingQuestion };
        break;
      case "Check":
        questionn = { ...checkQuestion };
        questionn.choices = choicesForm;
        questionn.type = "checkbox";
        break;
      case "Radio":
        questionn = { ...radioQuestion };
        questionn.choices = choicesForm;
        break;
      default:
        questionn = { ...comment };
    }

    // update question title, isRequired and name.
    questionn.title = enteredQuestion;
    questionn.name = questionn.title;
    questionn.isRequired = required;

    //save the question
    props.onSaveData(questionn);

    setEnteredQuestion("");
    setType("");
    props.onCancel();
  };
  const paperStyle = {
    padding: 5,
    // width:,
    // margin: "20px auto",
  };

  // DONE IMPORTANT
  const deleteThisItemHandler = (thisItem) => {
    setChoicesFrom((prevChoicess) => {
      console.log(prevChoicess);
      return choicesForm.filter((value) => {
        return value !== thisItem;
      });
    });
  };

  // DONE Add item to json question //
  const addItemHandler = () => {
    if (!item || item.length === 0) {
      return;
    }
    if (choicesForm.includes(item)) {
      setItemTitleError(true);
      return;
    }
    setChoicesFrom((prevChoices) => {
      return [...prevChoices, item];
    });
    setItem("");
    setStartCreateQuestion(false);
    setIsDisabledItemButton(true);
  };

  // DONE
  const updateItemHandlerr = (prevItem, newItem) => {
    if (!newItem || newItem.length === 0) {
      return;
    } else {
      const itemIndex = choicesForm.indexOf(prevItem);
      setChoicesFrom(() => {
        choicesForm[itemIndex] = newItem;
        return choicesForm;
      });
    }
  };
  //Get Item value
  const changeItemHandler = (event) => {
    setItemTitleError(false);
    // event.preventDefault();
    setItem(event.target.value);
    changeItemDisabledHandler(event.target.value);
  };

  const changeDisabledHandler = (input) => {
    if (!input || input.length === 0) {
      setIsDisabledButton(true);
    } else {
      setIsDisabledButton(false);
    }
  };
  // TO CHANGE
  const changeItemDisabledHandler = (input) => {
    if (!input || input.length === 0) {
      setIsDisabledItemButton(true);
    } else {
      setIsDisabledItemButton(false);
    }
  };
  const startCreateQuestionHandler = () => {
    setStartCreateQuestion(true);
  };
  const endCreateQuestionHandler = () => {
    setStartCreateQuestion(false);
  };
  const startSubmitingQuestion = () => {
    setStartSubmiting(true);
  };
  const endSubmitingQuestion = () => {
    setStartSubmiting(false);
  };
  const changeRequiredHandler = () => {
    setRequired(!required);
    console.log(!required);
  };

  return (
    <form onSubmit={submitHandler}>
      <Paper elevation={0} style={paperStyle}>
      <Typography
              variant="h6"
              gutterBottom
              component="div"
              align="center"
              sx={{ marginTop: 2 }}
            >
              QUESTION
            </Typography>
        {!startSubmit && (
          <React.Fragment>
            
            <Button
              variant="contained"
              fullWidth
              onClick={startSubmitingQuestion}
              sx={{ maxWidth: 550 }}
            >
              {!!enteredQuestion ? enteredQuestion : "START CREATION"}
            </Button>
          </React.Fragment>
        )}
        <br />
        {startSubmit && (
          <React.Fragment>
            <TextField
              element="input"
              id="question"
              type="text"
              label="Question"
              variant="standard"
              multiline
              maxRows={4}
              value={enteredQuestion}
              onChange={questionChangeHandler}
              sx={{ marginLeft: 5, width: 350 }}
            />
            <IconButton onClick={endSubmitingQuestion} >
              <DoneIcon fontSize="large" color="success" />
            </IconButton>

            <br />
          </React.Fragment>
        )}
        {!!enteredQuestion && (
          <React.Fragment>
            <FormControl
              variant="standard"
              sx={{ m: 1, marginLeft: 5, minWidth: 120 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Assign Type
              </InputLabel>

              {/* <FormLabel component="legend">Assign Type</FormLabel> */}

              <React.Fragment>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={type}
                  onChange={handleChange}
                  label="Type"
                  defaultValue="Comment"
                >
                  <MenuItem value="Comment">Comment</MenuItem>
                  <MenuItem value="Radio">RadioGroup</MenuItem>
                  <MenuItem value="Check">Check Box</MenuItem>
                  <MenuItem value="Rating">Rating</MenuItem>
                </Select>
              </React.Fragment>
            </FormControl>
            <FormControlLabel
              sx={{ marginLeft: 3, marginTop: 3 }}
              control={
                <Switch checked={required} onChange={changeRequiredHandler} />
              }
              label="Required"
            />

            <Divider sx={{ marginTop: 1 }} />
            {["Check", "Radio"].includes(type.toString())  && (
              <React.Fragment>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  align="center"
                  sx={{ marginTop: 2 }}
                >
                  ITEM
                </Typography>
                {!startCreateQuestion && (
                  <Button
                    variant="contained"
                    onClick={startCreateQuestionHandler}
                    fullWidth
                    endIcon={<AddCircleIcon />}
                    sx={{ marginTop: 1 }}
                  >
                    Add Item
                  </Button>
                )}

                {startCreateQuestion && (
                  <React.Fragment>
                    <TextField
                      element="input"
                      id="Item"
                      type="text"
                      label="Item"
                      variant="standard"
                      // helperText="Already !"
                      error={itemTitleError}
                      onChange={changeItemHandler}
                      value={item}
                      sx={{ marginLeft: 5, marginTop: 0 }}
                      DONE
                    />
                    <IconButton onClick={addItemHandler} sx={{ marginTop: 0 }}>
                      <AddCircleIcon color="primary" fontSize="large" />
                    </IconButton>
                    <IconButton
                      onClick={endCreateQuestionHandler}
                      sx={{ marginTop: 0 }}
                    >
                      <CancelIcon color="error" fontSize="large" />
                    </IconButton>
                  </React.Fragment>
                )}

                {/* {choicesForm && <Typography>{choicesForm}</Typography>} */}
                {/* TO CHANGE  IMPORTANT*/}
                {choicesForm && (
                  <ItemsList
                    items={choicesForm}
                    onDelete={deleteThisItemHandler}
                    onUpdate={updateItemHandlerr}
                  />
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Paper>

      <Box sx={{marginTop: 2, marginBottom :1}}>
        <Button
          type="button"
          onClick={props.onCancel}
          margin={4}
          variant="outlined"
          color="warning"
          endIcon={<CloseOutlinedIcon />}
          sx={{marginLeft: 5 , width: 180}}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="outlined"
          margin={4}
          endIcon={  <AddIcon fontSize="large"  />}
          disabled={isDisabledButton}
          sx={{marginLeft: 5, width: 180}}
        >
          ADD
        </Button>
      </Box>
    </form>
  );
};
export default QuestionFrom;
