import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type Props = {
  filter: string,
  setFilter: (id: string) => void,
  handleFilterChange: (event: SelectChangeEvent) => void,
};

const Filter: React.FC<Props> = ({ filter, handleFilterChange }) => {
  const FilterValues = [...Array(101).keys()];

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">AlbumId</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filter}
          label="AlbumId"
          onChange={handleFilterChange}
        >
          {FilterValues.map(v => (
            <MenuItem key={v} value={v}>{v}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filter;
