import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#5f9ea0",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const ModuleTable = ({ file, showTitle }) => {
  const { name, files } = file;
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      {showTitle && <h3>{name}</h3>}
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell>File Name</StyledTableCell>
            <StyledTableCell>Date Filed</StyledTableCell>
            <StyledTableCell>Error</StyledTableCell>
            <StyledTableCell>State</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => {
            let StateIcon;
            let iconColor;
            if (file.errors) {
              StateIcon = ErrorIcon;
              iconColor = "red";
            } else if (file.state === 1) {
              StateIcon = DoneIcon;
              iconColor = "green";
            }
            return (
              <TableRow key={file.filename}>
                <TableCell component="th" scope="row">
                  {file.filename}
                </TableCell>
                <TableCell>{file.dtfiled}</TableCell>
                <TableCell>{file.errors}</TableCell>
                <TableCell>
                  {StateIcon && <StateIcon style={{ color: iconColor }} />}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const FileTable = ({ files }) => {
  return (
    <div style={{ paddingTop: 10 }}>
      {files.map((file) => (
        <ModuleTable key={file.name} file={file} showTitle={files.length > 1}/>
      ))}
    </div>
  );
};

export default FileTable;
