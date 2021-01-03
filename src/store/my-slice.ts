import {createSelector, createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

const SLICE_NAME = 'myslice';

export const loadimg = createAsyncThunk(`${SLICE_NAME}/loadimg`, async (img: File, thunkAPI) => {
  const state = thunkAPI.getState();
  const kernel = state[slice.name].kernel;
  const url = await thework(img, kernel);

  return url;
});

export const loadkernel = createAsyncThunk(`${SLICE_NAME}/loadkernel`, async (kernel: number[][], thunkAPI) => {
  const state = thunkAPI.getState();
  const img = state[slice.name].image;

  if (!img) return;

  const url = await thework(img, kernel);

  return url;
});

const thework = async (img: File, kernel: number[][]) => {
  const bmp = await createImageBitmap(img);
  const osc = new OffscreenCanvas(bmp.width, bmp.height);
  const ctx = osc.getContext('2d');

  ctx.drawImage(bmp, 0, 0);

  const orig = ctx.getImageData(0, 0, bmp.width, bmp.height);
  const dest = applykernel(orig, kernel);

  ctx.putImageData(dest, 0 , 0);
  bmp.close();

  const blob = await osc.convertToBlob({ type: img.type });
  const url = URL.createObjectURL(blob);

  return url;
};

const applykernel = (orig: ImageData, kernel: number[][]): ImageData => {
  const dest = new ImageData(orig.width, orig.height);
  const half = Math.floor(kernel.length / 2);
  const size = kernel.length ** 2;

  // loop over each pixel of the original image
  for (let i = 0; i < orig.data.length; i += 4) {
    // initialize sum values for red, green and blue
    let sr = 0;
    let sg = 0;
    let sb = 0;

    // loop over the kernel values
    for (let row = 0; row < kernel.length; row++) {
      for (let col = 0; col < kernel.length; col++) {
        const kv = kernel[row][col];

        // compute array index for the current kernel value
        const rowShift = (row - half) * (orig.width * 4);
        const colShift = (col - half) * 4;
        const idx = i + rowShift + colShift;

        // TODO: improve edge correction
        if (idx < 0 || idx > orig.data.length - 3) continue;

        // find corresponding pixel values in the original image
        const pvr = orig.data[idx + 0];
        const pvg = orig.data[idx + 1];
        const pvb = orig.data[idx + 2];

        // multiply the original RGB values with the kernel value and add them to the respective sum values
        sr += pvr * kv;
        sg += pvg * kv;
        sb += pvb * kv;
      }
    }

    // TODO: correct size for edges
    dest.data[i + 0] = Math.round(sr / size);
    dest.data[i + 1] = Math.round(sg / size);
    dest.data[i + 2] = Math.round(sb / size);
    dest.data[i + 3] = orig.data[i + 3]; // leave alpha as it is
  }

  return dest;
};

// --

const slice = createSlice({
  name: SLICE_NAME,
  initialState: {
    isBusy: false,
    kernel: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ], // mean blur
    image: null,
    urlOrig: null,
    urlDest: null,
  },
  reducers: {
  },
  extraReducers: {
    [loadimg.pending as any]: (state, action) => {
      if (state.urlOrig) URL.revokeObjectURL(state.urlOrig);

      state.image = action.meta.arg;
      state.urlOrig = URL.createObjectURL(action.meta.arg);
      state.isBusy = true;
    },
    [loadimg.fulfilled as any]: (state, action) => {
      if (state.urlDest) URL.revokeObjectURL(state.urlDest);

      state.urlDest = action.payload;
      state.isBusy = false;
    },
    [loadimg.rejected as any]: (state, action) => {
      state.isBusy = false;
    },

    [loadkernel.pending as any]: (state, action) => {
      state.kernel = action.meta.arg;
      state.isBusy = true;
    },
    [loadkernel.fulfilled as any]: (state, action) => {
      if (!action.payload) return;
      if (state.urlDest) URL.revokeObjectURL(state.urlDest);

      state.urlDest = action.payload;
      state.isBusy = false;
    },
    [loadkernel.rejected as any]: (state, action) => {
      state.isBusy = false;
    },
  },
});

export const name = slice.name;

export const reducer = slice.reducer;

export const { } = slice.actions;

// --

const selectMySlice = state => state[slice.name];

export const selectIsBusy = createSelector([selectMySlice], slice => slice.isBusy);

export const selectUrlOrig = createSelector([selectMySlice], slice => slice.urlOrig);

export const selectUrlDest = createSelector([selectMySlice], slice => slice.urlDest);

export const selectKernel = createSelector([selectMySlice], slice => slice.kernel);
