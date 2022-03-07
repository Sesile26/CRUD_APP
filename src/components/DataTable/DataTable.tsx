import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';

import { SelectChangeEvent } from '@mui/material/Select';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Button from '@mui/material/Button';
import ModalWindow from '../Modal/ModalWindow';
import Filter from '../Filter/Filter';
import { getData } from '../../api/api';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const {
    count,
    page,
    rowsPerPage,
    onPageChange,
  } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function createData(thumbnailUrl: string, title: string, id: number, albumId: number, url: string) {
  return {
    thumbnailUrl,
    title,
    id,
    albumId,
    url,
  };
}

export const DataTable: React.FC = () => {
  const [data, setData] = useState<Data[] | []>([]);
  const [tableData, setTableData] = useState<Data[] | []>([]);
  const [filter, setFilter] = React.useState('0');

  const filteredData = (row: Data | null, value: string | null) => {
    if (row !== null) {
      const newMainDate = [...data].filter(item => item.id !== row.id);

      setData(newMainDate);

      if (Number(value)) {
        const newData = [...newMainDate].filter(item => item.albumId === Number(filter));

        setTableData(newData);
      }

      if (!Number(value)) {
        const newData = [...newMainDate];

        setTableData(newData);
      }
    }

    if (row === null) {
      if (value) {
        const newData = [...data].filter(item => item.albumId === Number(value));

        setTableData(newData);
      }

      if (!value) {
        const newData = [...data];

        setTableData(newData);
      }
    }
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);

    const selectValue = event.target.value;

    filteredData(null, selectValue);
  };

  const getAll = async () => {
    const dataFromApi = await getData();

    setData(dataFromApi);
    setTableData(dataFromApi);
  };

  const handleDelate = (row: Data) => {
    filteredData(row, filter);
  };

  useEffect(() => {
    getAll();
  }, []);

  const [modalData, setModalData] = React.useState<Data | null>(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = (row: Data) => {
    setModalData(row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const rows = tableData.map((v: Data) => createData(
    v.thumbnailUrl,
    v.title,
    v.id,
    v.albumId,
    v.url,
  ));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Filter filter={filter} setFilter={setFilter} handleFilterChange={handleFilterChange} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 160 }} align="right">
                  <button type="button" onClick={() => handleOpen(row)}>
                    <img src={row.thumbnailUrl} alt="" />
                  </button>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.id}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.albumId}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  <Button variant="contained" color="error" onClick={() => handleDelate(row)}>
                    Delate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <ModalWindow open={open} handleClose={handleClose} modalData={modalData} />
    </>
  );
};

export default DataTable;
