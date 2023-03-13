import { configureStore } from '@reduxjs/toolkit';
import { name as mySliceName, reducer as mySliceReducer } from './my-slice.mjs';

export default configureStore({
  reducer: {
    [mySliceName]: mySliceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
