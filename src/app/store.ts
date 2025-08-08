import { configureStore } from '@reduxjs/toolkit';
import reviewReducer from '../features/reviews/reviewSlice';

export const store = configureStore({
  reducer: {
    reviews: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
