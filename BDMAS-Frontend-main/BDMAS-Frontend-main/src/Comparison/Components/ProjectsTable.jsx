import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
// Components
import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "client",
    headerName: "Client",
    width: 150,
    editable: true,
  },
  {
    field: "projectTitle",
    headerName: "Project Title",
    width: 150,
    editable: true,
  },
  {
    field: "address",
    headerName: "Address",
    type: "text",
    width: 110,
    editable: true,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    type: "text",
    width: 110,
    editable: true,
  },
  {
    field: "endDate",
    headerName: "End Date",
    type: "text",
    width: 110,
    editable: true,
  },
  {
    field: "moderator",
    headerName: "Moderator",
    type: "text",
    width: 110,
    editable: true,
  },
];
const ProjectsTable = (props) => {
  const [arrIds, setArrIds] = useState([]);

  const selectHandler = () => {
    const filtredData = props.data.filter((item, index) => {
      return arrIds.includes(item.id);
    });
    props.forwardData(filtredData);
  };
  const projectsRow = props.data.map((project, index) => {
    return {
      id: project.id,
      client: "null",
      projectTitle: project.title,
      address: project.address,
      startDate: project.startDate.stringDate,
      endDate: project.endDate.stringDate,
      moderator: project.creatorData.userName,
    };
  });

  return (
    <React.Fragment>
      <WhiteModeButton onClick={selectHandler}>Click me</WhiteModeButton>
      <Paper style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={projectsRow}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          componentsProps={{
            columnMenu: { background: "red", counter: projectsRow.length },
          }}
          onSelectionModelChange={(ids) => {
            setArrIds(ids);
          }}
        />
      </Paper>
    </React.Fragment>
  );
};
export default ProjectsTable;
