import { useState, useEffect, FC, MouseEvent, ChangeEvent, Fragment } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
} from '@mui/material';

import { observer } from 'mobx-react-lite';

import { ProductTableHead, ProductTableRow, ProductTableToolbar } from './tableItems';
import { getComparator, stableSort } from '../../../../../utils';

interface Data {
  id: string;
  name: string;
}

interface PropsType {
  rows: Data[];
};

type Order = 'asc' | 'desc';

const ProductTable: FC<PropsType> = ({ rows }) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('id');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        mb: 2,
        bgcolor: '#0F0F0F',
        color: 'aliceblue'
      }}>
        <ProductTableToolbar numSelected={selected.length} selectedItems={selected} />
        <Box sx={{ flex: 1 }}>
          {rows.length ? (
            <TableContainer>
              <Table
                sx={{ minWidth: 750, height: '100%' }}
                aria-labelledby='tableTitle'
                size='medium'
              >
                <ProductTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <Fragment key={row.id}>
                        <ProductTableRow row={row} handleClick={handleClick} isSelected={isSelected} />
                      </Fragment>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (53) * emptyRows
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div>No Content</div>
          )}

        </Box>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: 'aliceblue'
          }}
        />
      </Paper>
    </Box>
  );
};


export default observer(ProductTable);
