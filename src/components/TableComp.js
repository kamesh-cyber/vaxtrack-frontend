import React from "react";
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';

const TableComp = ({ 
    title, 
    columns, 
    rows, 
    actions, 
    pagination = false,
    totalCount = 35,
    page = 0,
    rowsPerPage = 10,
    onPageChange = () => {},
    onRowsPerPageChange = () => {} 
}) => {
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
                    {rows.map((row) => {
                        return (
                        <TableRow hover tabIndex={-1} key={row._id || row.id}>
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
                                <TableCell key={column.id+'-'+(row._id || row.id)} align={column.align}>
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
            {pagination && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCount || rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            )}
        </TableContainer>
    </Paper>
  );
}
export default TableComp;