import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  Grid,
  Paper,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import MembersTable from "../MembersTable";

const SubSessionCard = (props) => {
  const [csvArray, setCsvArray] = useState([]);
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
    });
  };
  return (
    <Paper variant="outlined">
      <Grid container direction="row">
        <Grid item lg={6} container direction="column">
          <Grid item>
            <Typography variant="h6" gutterBottom component="div">{props.title}</Typography>
          </Grid>
          <Grid item>
            <Typography>{props.description}</Typography>
          </Grid>
        </Grid>
        <Grid item lg={6}>
          <form>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                readExcel(file);
              }}
            />
          </form>
          {csvArray && <MembersTable items={csvArray} title="Bank Member" />}
        </Grid>
      </Grid>
    </Paper>
  );
};
export default SubSessionCard;