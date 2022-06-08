import React, { useReducer, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { validate } from "../util/validators";

import "./InputField.css";
import { FormControl } from "@mui/material";
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const InputField = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    props.onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };
  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <TextField
        error={!inputState.isValid & inputState.isTouched}
        id={props.id}
        type={props.type}
        label={props.label}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
        width='100'
        required
        
        variant="standard"
      />
    ) : (
      <TextField
        error={!inputState.isValid & inputState.isTouched}
        id={props.id}
        type={props.type}
        label={props.label}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
        variant="standard"
        // rows={props.rows || 3}
        // maxRows="5"
        // multiline
        required
      />
    );

  // console.log(props.errorText);
  return (
    <FormControl
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      {/* <label htmlFor={props.id}>{props.label}</label> */}
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
      <br/>
    </FormControl>
  );
};

export default InputField;
