import React from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
// components
import Contactus from "../layout/Contactus";
import "./Dashboard.css";
const Dashboard = () => {
  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <Paper elevation={3} sx={{ bgcolor: "#1A1A24" }}>
          <img
            src="https://images.unsplash.com/photo-1647686874935-611af6288c6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY0ODY1OTc1MQ&ixlib=rb-1.2.1&q=80&w=1080"
            alt="presentation"
            className="img-presentation"
          />
          <Typography
            variant="h3"
            gutterBottom
            component="div"
            color="#ffff"
            margin={3}
          >
            Our purpose
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            component="div"
            color="#ffff"
            margin={3}
          >
            At EY, our purpose is Building a better working world. The insights
            and quality services we provide help build trust and confidence in
            the capital markets and in economies the world over. We develop
            outstanding leaders who team to deliver on our promises to all our
            stakeholders. In so doing, we play a critical role in building a
            better working world for our people, for our clients and for our
            communities. In a world that’s changing faster than ever, our
            purpose acts as our ‘North Star’ guiding our more than 300,000
            people — providing the context and meaning for the work we do every
            day. We help digital pioneers fight data piracy; guide governments
            through cash flow crises; unlock new medical treatments with data
            analytics; and pursue high quality audits to build trust in
            financial markets and business. In other words, working with
            entrepreneurs, companies, and entire countries to solve their most
            pressing challenges.
          </Typography>
          <Button href="#text-buttons" margin={3}>
            Explore our purpose
          </Button>
        </Paper>
      </Container>
      <Box width="100%">
        <Contactus />
      </Box>
    </React.Fragment>
  );
};
export default Dashboard;
