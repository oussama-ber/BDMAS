import React, { useEffect, useState } from "react";
import "./Sidebar.css";
//component
import AddFormDetails from "./AddFormDetails";
import AddQuestionCard from "./AddQuestionCard";
import DeleteQuestion from "./DeleteQuestion";
//mui
import List from "@mui/material/List";
import { Button } from "@mui/material";

const SideBarFromMangement = (props) => {

  const [maxIndex, setMaxIndex] = useState(props.form.elements.length);
  const [form, setForm] = useState(props.form);
  const maxValueIndexHandler = () => {
    const max = props.form.elements.length;
    setMaxIndex(max);
  };
  const length = props.form.elements.length;
  console.log(length);

    useEffect(()=>{
    console.log(JSON.stringify(form));
    setForm(form)
  },[form])

  return (
    <div className="sidebar">
      <List sx={{ margin: 0, padding: 0 }}>
        <AddFormDetails
          onSubmitHandler={props.onSubmitHandler}
          form={props.json}
        />
        <AddQuestionCard onAddQuestion={props.onAddQuestion} />
        <DeleteQuestion
          form={props.form}
          onDelete={props.onDelete}
          formLength={maxValueIndexHandler}
          max={length}

        />
      </List>
    </div>
  );
};
export default SideBarFromMangement;
