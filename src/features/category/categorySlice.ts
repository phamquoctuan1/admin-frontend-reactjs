import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Category, ListParams, ListResponse } from 'models';

export interface CategoryState {
  loading: boolean;
  list: Category[];
  filter: ListParams;
}

const initialState: CategoryState = {
  loading: false,
  list: [],
  filter: {
   name:''
  },

};
const categorySlice = createSlice({
  name: 'category',
  initialState: initialState,
  reducers: {
    fetchCategoryList(state) {
      state.loading = true;
    },
    fetchCategoryListSuccess(state, action: PayloadAction<ListResponse<Category>>) {
      state.list = action.payload.data;
      state.loading = false;
    },
    fetchCategoryListFailed(state) {
      state.loading = false;
    },

    setFilter(state, action: PayloadAction<ListParams>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<ListParams>) {},
  },
});

//Actions
export const categoryActions = categorySlice.actions;
//Selector
export const selectCategoryList = (state: RootState) => state.category.list;
export const selectCategoryLoading = (state: RootState) => state.category.loading;
export const selectCategoryFilter = (state: RootState) => state.category.filter;
//Reducer
const categoryReducer = categorySlice.reducer;
export default categoryReducer;
