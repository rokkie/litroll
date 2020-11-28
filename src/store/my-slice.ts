import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'myslice',
  initialState: {
    myvalue: '',
  },
  reducers: {
    mychange: (state, action: PayloadAction<{ newVal: string }>) => {
      state.myvalue = action.payload.newVal;
    },
  },
});

const selectMySlice = state => state[slice.name];

export const name = slice.name;

export const reducer = slice.reducer;

export const { mychange } = slice.actions;

export const selectMyValue = createSelector([selectMySlice], slice => slice.myvalue);
