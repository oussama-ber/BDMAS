import React from "react";
//MUI
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
//Icons
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
const DetailsCard = (props) => {
  let Icon;
  switch (props.icon) {
    case "Pending":
      Icon = <HourglassBottomIcon color="warning" fontSize="large"/>;
      break;
    case "Done":
      Icon = <CheckCircleIcon color="success" fontSize="large"/>;
      break;
    default:
      Icon = <ViewListIcon color="info" fontSize="large"/>;
      break;
  }
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h4"  component="div" color="black">
            {props.title} {Icon}
          </Typography>
        }
        subheader={
          <Typography
            variant="h3"
            
            component="div"
            color={props.color}
          >
            {props.number}
          </Typography>
        }
      />
      {/* <CardContent>
        
      </CardContent> */}
    </Card>
  );
};
export default DetailsCard;
