import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import chunk from '../util/array-chunk';

const SLICE_NAME = 'my-slice';

/**
 * Async action creator for loading an image
 *
 * @param img Image to load
 */
export const loadImage = createAsyncThunk(`${SLICE_NAME}/load-image`, async (img: File, thunkAPI) => {
  const state = thunkAPI.getState();
  const kernel = state[slice.name].kernel;

  return await filterImage(img, kernel);
});

/**
 * Async action creator for loading a new kernel
 *
 * @param kernel The new kernel to load
 */
export const loadKernel = createAsyncThunk(`${SLICE_NAME}/load-kernel`, async (kernel: number[][], thunkAPI) => {
  const state = thunkAPI.getState();
  const img = state[slice.name].image;

  if (!img) return;

  return await filterImage(img, kernel);
});

/**
 * Async action creator for scaling the current kernel
 *
 * @param size The size to scale the kernel to
 */
export const scaleKernel = createAsyncThunk(`${SLICE_NAME}/scale-kernel`, async (size: number, thunkAPI) => {
  const state = thunkAPI.getState();
  const prev = state[slice.name].kernel;
  const next = chunk(size, new Array(size ** 2).fill(1));
  const offset = Math.abs((prev.length - size) / 2);

  if (prev.length > size) {
    // kernel got smaller, offset coordinates from previous kernel
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        next[row][col] = prev[row + offset][col + offset];
      }
    }
  } else {
    // kernel got bigger, offset coordinates in next kernel
    for (let row = 0; row < prev.length; row++) {
      for (let col = 0; col < prev.length; col++) {
        next[row + offset][col + offset] = prev[row][col];
      }
    }
  }

  // create action to load the next kernel
  const action = loadKernel(next);

  // dispatch the action with the next kernel
  thunkAPI.dispatch(action);
});

/**
 * Filter an image using a kernel
 *
 * Applies a kernel convolution to an image file
 *
 * @param img The image to filter
 * @param kernel The kernel to apply
 */
const filterImage = async (img: File, kernel: number[][]) => {
  // create 2d drawing context of the same size as the image file
  const bmp = await createImageBitmap(img);
  const osc = new OffscreenCanvas(bmp.width, bmp.height);
  const ctx = osc.getContext('2d');

  // draw the image onto the canvas
  ctx.drawImage(bmp, 0, 0);

  // obtain raw pixel data from the context so we can apply the kernel
  const orig = ctx.getImageData(0, 0, bmp.width, bmp.height);
  const dest = applyKernel(orig, kernel);

  // draw the new pixels onto the canvas and close to original bitmap (because memory)
  ctx.putImageData(dest, 0, 0);
  bmp.close();

  // convert canvas to a blob of the same type as the original image
  const blob = await osc.convertToBlob({ type: img.type });

  // create object url from the blob
  return URL.createObjectURL(blob);
};

/**
 * Apply a kernel to an image
 *
 * Performs a kernel convolution.
 *
 * @param orig Image to apply to kernel on
 * @param kernel The kernel to apply
 */
const applyKernel = (orig: ImageData, kernel: number[][]) => {
  const dest = new ImageData(orig.width, orig.height);
  const half = Math.floor(kernel.length / 2);

  // loop over each pixel of the original image
  for (let i = 0; i < orig.data.length; i += 4) {
    // compute coordinate of the original image based on linear index
    const i1d  = Math.floor(i / 4);
    const irow = Math.floor(i1d / orig.width);
    const icol = i1d % orig.width;

    // initialize sum values for red, green and blue
    let sr = 0;
    let sg = 0;
    let sb = 0;

    // keep track of the number of kernel values since only part of the kernel is used around the edges
    let count = 0;

    // loop over the kernel values
    for (let krow = 0; krow < kernel.length; krow++) {
      for (let kcol = 0; kcol < kernel.length; kcol++) {
        const kv = kernel[krow][kcol];

        // compute relative position from the center of the kernel
        const relX = kcol - half;
        const relY = krow - half;

        // translate relative position to original coordinates
        const posX = icol + relX;
        const posY = irow + relY;

        // check if we are still within the bounds of the original image
        if (posX < 0 || posX >= orig.width || posY < 0 || posY >= orig.height) continue;

        // compute array index for the current kernel value
        const rowShift = relY * (orig.width * 4);
        const colShift = relX * 4;
        const idx = i + rowShift + colShift;

        // find corresponding pixel values in the original image
        const pvr = orig.data[idx + 0];
        const pvg = orig.data[idx + 1];
        const pvb = orig.data[idx + 2];

        // multiply the original RGB values with the kernel value and add them to the respective sum values
        sr += pvr * kv;
        sg += pvg * kv;
        sb += pvb * kv;

        // add one to the number of used kernel values
        count++;
      }
    }

    // normalize sum values and write the result to the destination image
    dest.data[i + 0] = Math.round(sr / count);
    dest.data[i + 1] = Math.round(sg / count);
    dest.data[i + 2] = Math.round(sb / count);
    dest.data[i + 3] = orig.data[i + 3]; // leave alpha as it is
  }

  return dest;
};

/**
 * Create a message to load a new image
 *
 * @param img The image to load
 */
export const createLoadImgMsg = (img: File) => ({ type: loadImage.typePrefix, img });

/**
 * Create a message to load a new kernel
 *
 * @param kernel The kernel to load
 */
export const createLoadKernelMsg = (kernel: number[][]) => ({ type: loadKernel.typePrefix, kernel });

/**
 * Create a message to scale the kernel
 *
 * @param size The size of the kernel
 */
export const createScaleKernelMsg = (size: number) => ({ type: scaleKernel.typePrefix, size });

// --

const slice = createSlice({
  name: SLICE_NAME,
  initialState: {
    isBusy: false,
    image: null,
    urlOrig: null,
    urlDest: null,
    kernel: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ], // mean blur
  },
  reducers: {},
  extraReducers: {
    [loadImage.pending as any]: (state, action) => {
      if (state.urlOrig) URL.revokeObjectURL(state.urlOrig);

      state.image = action.meta.arg;
      state.urlOrig = URL.createObjectURL(action.meta.arg);
      state.isBusy = true;
    },
    [loadImage.fulfilled as any]: (state, action) => {
      if (state.urlDest) URL.revokeObjectURL(state.urlDest);

      state.urlDest = action.payload;
      state.isBusy = false;
    },
    [loadImage.rejected as any]: (state, action) => {
      state.isBusy = false;
    },

    [loadKernel.pending as any]: (state, action) => {
      state.kernel = action.meta.arg;
      state.isBusy = true;
    },
    [loadKernel.fulfilled as any]: (state, action) => {
      if (!action.payload) return;
      if (state.urlDest) URL.revokeObjectURL(state.urlDest);

      state.urlDest = action.payload;
      state.isBusy = false;
    },
    [loadKernel.rejected as any]: (state, action) => {
      state.isBusy = false;
    },

    // [scaleKernel.pending as any]: (state, action) => {},
    // [scaleKernel.fulfilled as any]: (state, action) => {},
    // [scaleKernel.rejected as any]: (state, action) => {},
  },
});

export const name = slice.name;

export const reducer = slice.reducer;

export const {} = slice.actions;

// --

const selectMySlice = state => state[slice.name];

export const selectIsBusy = createSelector([selectMySlice], slice => slice.isBusy);

export const selectUrlOrig = createSelector([selectMySlice], slice => slice.urlOrig);

export const selectUrlDest = createSelector([selectMySlice], slice => slice.urlDest);

export const selectKernel = createSelector([selectMySlice], slice => slice.kernel);
