import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Review } from '../../types';

interface ReviewsState {
  data: Review[];
  loading: boolean;
  isEditing: boolean
}

const initialState: ReviewsState = {
  data: [],
  loading: false,
  isEditing:false
};

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (review: Review) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return review;
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    deleteReview: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((rev) => rev.id !== action.payload);
    },
    editReview: (state, action: PayloadAction<Review>) => {
      const index = state.data.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) state.data[index] = action.payload;
    },
    isUpdate:(state,action: PayloadAction<boolean>)=>{
      state.isEditing = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addReview.fulfilled, (state, action) => {
      state.data.push(action.payload);
    });
  },
});

export const { deleteReview, editReview, isUpdate } = reviewSlice.actions;
export default reviewSlice.reducer;
