import {createSelector, createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

const SLICE_NAME = 'myslice';

export const loadimg = createAsyncThunk(`${SLICE_NAME}/loadimg`, async (img: File, thunkAPI) => {
  const state = thunkAPI.getState();
  const kernel = state[slice.name].kernel;
  const url = await thework(img, kernel);

  return url;
});

export const loadkernel = createAsyncThunk(`${SLICE_NAME}/loadkernel`, async (kernel: unknown, thunkAPI) => {
  const state = thunkAPI.getState();
  const img = state[slice.name].image;

  if (!img) return;

  const url = await thework(img, kernel);

  return url;
});

const thework = async (img: File, kernel: unknown) => {
  const bmp = await createImageBitmap(img);
  const osc = new OffscreenCanvas(bmp.width, bmp.height);
  const ctx = osc.getContext('2d');

  ctx.drawImage(bmp, 0, 0);

  const dataOrig = ctx.getImageData(0, 0, bmp.width, bmp.height);
  const dataDest = new ImageData(dataOrig.data, dataOrig.width, dataOrig.height);

  ctx.putImageData(dataDest, 0 , 0);
  bmp.close();

  const blob = await osc.convertToBlob({ type: img.type });
  const url = URL.createObjectURL(blob);

  return url;
};

// --

const slice = createSlice({
  name: SLICE_NAME,
  initialState: {
    myvalue: '',
    kernel: [],
    image: null,
    url: null,
  },
  reducers: {
    mychange: (state, action: PayloadAction<{ newVal: string }>) => {
      state.myvalue = action.payload.newVal;
    },
  },
  extraReducers: {
    [loadimg.pending as any]: (state, action) => {
      state.image = action.meta.arg;
    },
    [loadimg.fulfilled as any]: (state, action) => {
      if (state.url) URL.revokeObjectURL(state.url);

      state.url = action.payload;
    },
    // [loadimg.rejected]: (state, action) => {},

    // [loadkernel.pending]: (state, action) => {},
    [loadkernel.fulfilled as any]: (state, action) => {
      if (!action.payload) return;
      if (state.url) URL.revokeObjectURL(state.url);

      state.url = action.payload;
    },
    // [loadkernel.rejected]: (state, action) => {},
  },
});

export const name = slice.name;

export const reducer = slice.reducer;

export const { mychange } = slice.actions;

// --

const selectMySlice = state => state[slice.name];

export const selectMyValue = createSelector([selectMySlice], slice => slice.myvalue);

export const selectImageUrl = createSelector([selectMySlice], slice => slice.url);
