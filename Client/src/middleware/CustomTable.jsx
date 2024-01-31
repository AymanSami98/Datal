import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const CustomTable = ({ title, data, columns }) => {
  
  return (
    <>
      <Typography component={'span'} variant="h6" style={{ marginBottom: "1rem" }}>{title} </Typography>
      <TableContainer component={Paper}  style={{ marginBottom: "20px" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={columnIndex}>
                    {column.render ? column.render(row) : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomTable;

CustomTable.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};
