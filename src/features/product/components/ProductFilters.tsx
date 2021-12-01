import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { ChangeEvent } from 'hoist-non-react-statics/node_modules/@types/react';
import {  ListParams } from 'models';
import React, { useRef } from 'react';

export interface ProductFiltersProps {
  filter: ListParams;
  onChange?: (newFilter: ListParams) => void;
  onSearchChange?: (newFilter: ListParams) => void;
}

export default function ProductFilters({
  filter,
  onChange,
  onSearchChange,
}: ProductFiltersProps) {
  const searchRef = useRef<HTMLInputElement>();
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onSearchChange) return;
    const newFilter: ListParams = {
      ...filter,
      name: e.target.value,
      _page: 1,
    };
    onSearchChange(newFilter);
  };
  const handleCityChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    if (!onChange) return;

    const newFilter: ListParams = {
      ...filter,
      _page: 1,
      city: e.target.value || undefined,
    };
    onChange(newFilter);
  };
  const handleSortChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    if (!onChange) return;
    const value = e.target.value;
    const [_sort, _order] = (value as string).split('.');
    const newFilter: ListParams = {
      ...filter,
      _sort: _sort || undefined,
      _order: (_order as 'asc' | 'desc') || undefined,
    };
    onChange(newFilter);
  };
  const handleClearFilter = () => {
    if (!onChange) return;
    const newFilter: ListParams = {
      ...filter,
      _page: 1,
      _sort: undefined,
      _order: undefined,
      city: undefined,
      name_like: undefined,
    };
    onChange(newFilter);
    if (searchRef.current) {
      searchRef.current.value = '';
    }
  };
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel htmlFor="searchByName">Tìm theo tên</InputLabel>
            <OutlinedInput
              id="searchByName"
              label="Tìm theo tên"
              endAdornment={<Search />}
              defaultValue={filter.name_like}
              onChange={handleSearchChange}
              inputRef={searchRef}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={2}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="filterByCity">Tìm theo danh mục</InputLabel>
            <Select
              labelId="filterByCity"
              label="Tìm theo danh mục"
              value={filter.city || ''}
              onChange={handleCityChange}
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              {/* {cityList.map((city, index) => (
                <MenuItem key={index} value={city.code}>
                  {city.name}
                </MenuItem>
              ))} */}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={2}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="sort">Sắp xếp</InputLabel>
            <Select
              labelId="sort"
              label="Sắp xếp"
              value={filter._sort ? `${filter._sort}.${filter._order}` : ''}
              onChange={handleSortChange}
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              <MenuItem value="name.acs">Tên tăng dần</MenuItem>
              <MenuItem value="name.desc">Tên giảm</MenuItem>
              <MenuItem value="price.asc">Giá cao </MenuItem>
              <MenuItem value="price.desc">Giá giảm</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            fullWidth
            onClick={handleClearFilter}
          >
            Xóa bộ lọc
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
