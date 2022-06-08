import React, { useState } from "react";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogActions from "@mui/material/DialogActions";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
// ICONS
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
// components
import WhiteModeButton from "../../../shared/UIElements/WhiteModeButton";

const ColleaguesDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const [searchData, setSearchData] = useState("");
  const [newMember, setNewMember] = useState({});
  console.log(newMember);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const submitHandler = () => {
    props.submitColleagues();
    props.closeDialog();
  };
  return (
    <React.Fragment>
      <Dialog open={props.open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h4" gutterBottom component="div">
            Colleagues
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid
            container
            direction="row"
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Autocomplete
                id="users-select"
                sx={{ width: 300 }}
                options={props.users}
                autoHighlight
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  setNewMember({
                    name: value.name,
                    email: value.email,
                    image: value.image,
                  })
                }
                renderOption={(props, option) => (
                  <Box
                    key={option.email}
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <Avatar
                      loading="lazy"
                      width="20"
                      src={`http://localhost:5000/${option.image}`}
                      alt={option.name}
                    />
                    {option.name} ({option.email})
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add member"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <WhiteModeButton
                icon="Add"
                onClick={() => props.addUser(newMember)}
              >
                ADD
              </WhiteModeButton>
            </Grid>
          </Grid>
          <TextField
            // variant="standard"
            // component={Paper}
            fullWidth
            type="text"
            label="Search 🔎"
            value={searchData}
            onChange={(event) => setSearchData(event.target.value)}
            sx={{ width: "100%", marginTop: 3 }}
          />
          <List sx={{ overflowY: "scroll", maxHeight: "300px", marginTop: 3 }}>
            {/* <Typography>{typof props.items}</Typography> */}
            {props.items
              .filter((item) => item.name.toLowerCase().includes(searchData))
              .map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => props.deleteItem(item.name)}
                      >
                        <DeleteOutlineIcon color="error" />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={`http://localhost:5000/${item.image}`}
                        alt={item.name}
                      />
                    </ListItemAvatar>
                    <ListItemText primary={item.name} secondary={item.email} />
                  </ListItem>
                );
              })}
            {/* <ListItemIcon onClick={() => props.deleteItem(item.name)}>
                    <DeleteOutlineIcon />
                  </ListItemIcon> */}
          </List>
        </DialogContent>
        <DialogActions>
          <WhiteModeButton onClick={props.closeDialog}>Close</WhiteModeButton>
          <WhiteModeButton onClick={submitHandler}>Done</WhiteModeButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default ColleaguesDialog;
