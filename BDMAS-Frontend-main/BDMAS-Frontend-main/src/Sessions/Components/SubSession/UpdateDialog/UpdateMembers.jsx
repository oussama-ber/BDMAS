import React, { useState, useContext, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
//components
import MembersList from "../../MembersList";
import WhiteModeButton from "../../../../shared/UIElements/WhiteModeButton";
//MUI
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
//icons
import FileUploadIcon from "@mui/icons-material/FileUpload";

const UpdateMembers = (props) => {
  const [csvArray, setCsvArray] = useState(props.csvArray);

 
  const filePickerRef = useRef();
  //user data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  //Read From Excel
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      setCsvArray(d);
      props.setCsvArray(d);
    });
  };
  // Delete Item
  const deleteitem = (itemName) => {
    setCsvArray(csvArray.filter((item) => item.Name !== itemName));
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const addMember = () => {
    setCsvArray((prevData) => {
      return [...prevData, { Name: name, Email: email, token: "none" }];
    });
    
  };
  const onNext = ()=> {
    props.setCsvArray(csvArray);
    props.handleNext();
  }

  return (
    <React.Fragment>
      <DialogContent sx={{ mt: 3, marginX: 3, padding: 1 }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          {/* list from csv */}
          <Grid item lg={5}>
            <form>
              <Button
                sx={{
                  borderRadius: 0,
                  borderColor: "#3A3A4A ",
                  backgroundColor: "#FFE600",
                }}
                color="inherit"
                variant="outlined"
                component="span"
                onClick={pickImageHandler}
                endIcon={<FileUploadIcon />}
              >
                Upload
              </Button>
              <input
                type="file"
                style={{ display: "none" }}
                ref={filePickerRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  readExcel(file);
                }}
              />
            </form>
            <br />
            {csvArray && (
              <MembersList
                items={csvArray}
                title="Bank Member"
                onDelete={deleteitem}
              />
            )}
          </Grid>
          {/* <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{
              "&.MuiDivider-root": {
                "&::before": {
                  borderTop: `thin solid`,
                  color: "#FFE600",
                },
                "&::after": {
                  borderTop: `thin solid`,
                  color: "#FFE600",
                },
              },
            }}
          >
            {" "}
            User{" "}
          </Divider> */}
          {/* Add member */}
          <Grid item lg={4}>
            {/* User Name */}
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ marginY: 1.5 }}
            />
            {/* TITLE */}
            <TextField
              autoFocus
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginY: 1.5 }}
            />
          </Grid>
          {/* Add button */}
          <Grid item lg={3}>
            <WhiteModeButton
              onClick={addMember}
              icon="add"
              // disabled={email.length == 0}
            >
              Add
            </WhiteModeButton>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onBack}
          sx={{
            borderRadius: 0,
            borderColor: "#3A3A4A ",
            backgroundColor: "#FFE600",
          }}
          color="inherit"
          variant="outlined"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          sx={{
            borderRadius: 0,
            borderColor: "#3A3A4A ",
            backgroundColor: "#FFE600",
          }}
          color="inherit"
          variant="outlined"
          disabled={!!!csvArray.length}
        >
          NEXT
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
export default UpdateMembers;
