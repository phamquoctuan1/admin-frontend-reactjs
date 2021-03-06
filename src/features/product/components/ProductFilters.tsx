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
import categoryApi from 'api/categoryApi';
import { ChangeEvent } from 'hoist-non-react-statics/node_modules/@types/react';
import {  Category, ListParams } from 'models';
import React, { useRef, useEffect, useState } from 'react';

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
  const [category, setCategory] = useState<Category[]>();
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onSearchChange) return;
    const newFilter: ListParams = {
      ...filter,
      name: e.target.value,
      _page: 1,
    };
    onSearchChange(newFilter);
  };
   useEffect(() => {
     const getCategory = async () => {
       try {
         const response = await categoryApi.getWithoutParent();
         setCategory(response.data);
       } catch (error) {
         console.log(error);
       }
     };
     getCategory();
   }, []);
  const handleSelectChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    if (!onChange) return;

    const newFilter: ListParams = {
      ...filter,
      _page: 1,
      categoryId: e.target.value || undefined,
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
      name: undefined,
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
            <InputLabel htmlFor="searchByName">T??m theo t??n</InputLabel>
            <OutlinedInput
              id="searchByName"
              label="T??m theo t??n"
              endAdornment={<Search />}
              defaultValue={filter.name}
              onChange={handleSearchChange}
              inputRef={searchRef}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={2}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="filterByCity">T??m theo danh m???c</InputLabel>
            <Select
              labelId="Category"
              label="Danh m???c"
              value={filter.categoryId && filter?.categoryId[0]}
              onChange={handleSelectChange}
              defaultValue
              displayEmpty
            >
              <MenuItem >
                 <em>T???t c???</em>
              </MenuItem>
              {category?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={2}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="sort">S???p x???p</InputLabel>
            <Select
              labelId="sort"
              label="S???p x???p"
              value={filter._sort ? `${filter._sort}.${filter._order}` : ''}
              onChange={handleSortChange}
            >
              <MenuItem value="">
                <em>T???t c???</em>
              </MenuItem>
              <MenuItem value="name.acs">T??n t??ng d???n</MenuItem>
              <MenuItem value="name.desc">T??n gi???m</MenuItem>
              <MenuItem value="price.asc">Gi?? cao </MenuItem>
              <MenuItem value="price.desc">Gi?? gi???m</MenuItem>
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
            X??a b??? l???c
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
