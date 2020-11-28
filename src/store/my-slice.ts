import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'myslice',
  initialState: {
    myvalue: '',
    image: {
      buf: null,
      type: null
    },
  },
  reducers: {
    mychange: (state, action: PayloadAction<{ newVal: string }>) => {
      state.myvalue = action.payload.newVal;
    },

    loadimg: (state, action: PayloadAction<{ buf: ArrayBuffer, type: string}>) => {
      state.image = action.payload;
    },
  },
});

const selectMySlice = state => state[slice.name];

export const name = slice.name;

export const reducer = slice.reducer;

export const { mychange, loadimg } = slice.actions;

export const selectMyValue = createSelector([selectMySlice], slice => slice.myvalue);

export const selectImageUrl = createSelector([selectMySlice], slice => {
  if (!slice.image.buf) return;

  const { buf, type } = slice.image;
  const blob = new Blob( [ buf ], { type } );

  return URL.createObjectURL( blob );
});
