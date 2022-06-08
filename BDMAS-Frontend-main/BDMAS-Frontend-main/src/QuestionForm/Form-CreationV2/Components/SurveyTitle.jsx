import React, { useState } from "react";
//mui.
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
//card mui
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

//icons
import EditIcon from "@mui/icons-material/Edit";
import { Divider, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
export default function SurveyTitle({
  title,
  handleChangeTitle,
  description,
  handleChangeDescription,
}) {
  const [editing, setEditing] = useState(false);

  function toggleEditing() {
    setEditing(!editing);
  }

  return (
    <div className="card m-3 p-3 " style={{backgroundColor: '#EAEAF2'}}>
      <div>
        <div className="card-body">
          {editing ? (
            <div>
              <TextField
                variant="standard"
                type="text"
                required
                label="Title Form"
                value={title}
                onChange={handleChangeTitle}
              />
              <TextField
                variant="standard"
                type="text"
                label="Description Form"
                value={description}
                onChange={handleChangeDescription}
                sx={{ marginLeft: 3 }}
              />
            </div>
          ) : (
            <h5 className="card-title "> {title}</h5>
          )}
        </div>
        <div className="card-body">
          <Button
          sx={{borderRadius: 0, borderColor:'#3A3A4A ', backgroundColor: '#FFE600'}}
            color= 'inherit'
            onClick={toggleEditing}
            variant="outlined"
            endIcon={<EditIcon />}
            
          >
            {editing ? (
              <>
                
                Save Header
              </>
            ) : (
              <>
              
                Edit Header
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
