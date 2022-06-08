import React from "react";
// ui material
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
//table ui
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton  from "@mui/material/IconButton";
//icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const MembersTable = (props) => {
  return (
    <Container maxWidth="xl">
      <TableContainer
        // component={Paper}
        sx={{
          maxHeight: 370,
          width: "100%",
          overflowY: "auto",
          backgroundColor: "#F6F6FA",
        }}
      >
        <Table
          stickyHeader
          size="small"
          onCellClick={console.log("clicked")}
        >
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                <Typography
                  variant="h5"
                  gutterBottom
                  component="div"
                  color="black"
                >
                  {props.title ? props.title : "Member"}
                </Typography>
              </TableCell>
              <TableCell>
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.items.map((member, index) => {
              return (
                <TableRow key={index}>
                  <TableCell key={index}>
                    {index + 1}
                  </TableCell>
                  <TableCell key={index}>
                    <Grid
                      container
                      direction="row"
                      
                      spacing={1}
                      alignItems="center"
                    >
                      <Grid item>
                        <Avatar
                          src={"https://source.unsplash.com/random"}
                          alt="random image"
                        />
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="h6"
                          gutterBottom
                          component="div"
                          color="black"
                        >
                          {member.Name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell key={index}>
                    <IconButton onClick={()=>props.onDelete(member.Name)}>
                      <DeleteOutlineIcon color="error"/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default MembersTable;
