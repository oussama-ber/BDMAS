import React, { useState, useContext, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
//components
import MembersList from "../MembersList";
//MUI
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
//icons
import FileUploadIcon from "@mui/icons-material/FileUpload";

const AddBankMembers = (props) => {
  const [csvArray, setCsvArray] = useState(props.csvArray);
  const filePickerRef = useRef();

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
      console.log(d);
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
  return (
    <React.Fragment>
      <DialogContent sx={{ mt: 3, marginX: 3, padding: 1 }}>
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
            // accept=".csv"
            // id="csvFile"
            // onChange={(event) => {
            //   setCsvFile(event.target.files[0]);
            // }}
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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.handleBack}
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
          onClick={props.finalSubmit}
          sx={{
            borderRadius: 0,
            borderColor: "#3A3A4A ",
            backgroundColor: "#FFE600",
          }}
          color="inherit"
          variant="outlined"
          disabled={!!!csvArray.length}
        >
          Submit
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
export default AddBankMembers;
