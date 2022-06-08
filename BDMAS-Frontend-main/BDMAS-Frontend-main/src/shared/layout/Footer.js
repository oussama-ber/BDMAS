import React from "react";
//ui material
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//icons
//component
import "../../App.css";
import  Grid from "@mui/material/Grid";

const Footer = () => {
  return (
    <div  style={{ width: "100%" }}>
      <Grid   container spacing={2} sx={{padding: 3}}>
        <Grid item lg={2}>
          <img
            src="https://www.maschinenbau-gipfel.de/fileadmin/user_upload/maschinenbau-gipfel/2021/partner/EY_Logo_800x500.png"
            alt="ey-logo"
            className="img-footer"
          />
        </Grid>
        <Grid item lg={5}>
          {" "}
          <Typography variant="caption" display="block" gutterBottom>
            EY refers to the global organization, and may refer to one or more,
            of the member firms of Ernst & Young Global Limited, each of which
            is a separate legal entity.
          </Typography>{" "}
        </Grid>
        <Grid item lg={5}>
          <Typography variant="caption" display="block" gutterBottom>
            Ernst & Young Global Limited, a UK company limited by guarantee,
            does not provide services to clients. &copy;
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};
export default Footer;
