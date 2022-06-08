import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Image from '../images/EY.PNG';

const MainFeature = () => {
  return (
    <Paper
      sx={{
        position: "relative",
        backgroundColor: "grey.800",
        color: "#fff",
        mb: 4,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url(${Image})`,
      }}
    >
      {/* Increase the priority of the hero background image */}
      {
        // <img
        // //   style={{ display: "none" }}
        //   src='https://source.unsplash.com/random'
        //   alt='random image'
        // />
      }
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: "rgba(0,0,0,.3)",
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              height: 400,
              position: "relative",
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            {/* <Typography
              component="h1"
              variant="h3"
              color="inherit"
              gutterBottom
            >
              this is a title
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              this is a description smldf gjsd mlksdjf gsdf mlkdsjf s fdmlkhj dsfh sdflskdfh j mdlsfk hjdsf mslkdfj  mdlkfj hs s lmdfj  lsdfkm jhsdm mlskdfj hlm smldfkh  msldfkj lkmsdjf
            </Typography> */}
            {/* <Link variant="subtitle1" href="#">
              this is a link
            </Link> */}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default MainFeature;
