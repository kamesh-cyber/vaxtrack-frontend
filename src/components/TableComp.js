import React from "react";
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';

const TableComp = ({ columns, rows, actions }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', }}>
        <TableContainer>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id} align={column.align} sx={{fontWeight: "bold", backgroundColor: "#254a73", color: "white"}}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        return (
                        <TableRow hover tabIndex={-1} key={row.id}>
                            {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                column.id === "action" ? 
                                <TableCell key={column.id+'-action'} align={column.align}>
                                    {actions.map((action, index) => (
                                        <IconButton key={'action'+index} sx={{color: action.color}} disabled={row?.active === false} onClick={() => action.onClick(row)}>
                                            {action.icon}
                                        </IconButton>
                                    ))}
                                </TableCell>
                                :
                                <TableCell key={column.id+'-'+row.id} align={column.align}>
                                {column.format && (typeof value === 'boolean'  || typeof value === 'object' || column?.type === 'date')
                                    ? column.format(value)
                                    : value || column?.default || "Not Available"}
                                </TableCell>
                            );
                            })}
                        </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Paper>
  );
}
export default TableComp;