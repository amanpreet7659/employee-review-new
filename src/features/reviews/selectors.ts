import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const selectAllReviews = (state: RootState) => state.reviews.data;

export const selectReviewsWithTier = createSelector(
  selectAllReviews,
  (reviews) =>
    reviews.map((rev) => ({
      ...rev,
      performanceTier:
        rev.rating <= 3
          ? "Poor"
          : rev.rating <= 6
          ? "Average"
          : rev.rating <= 8
          ? "Good"
          : "Excellent",
    }))
);

export const isEditMode = (state: RootState) => state.reviews.isEditing;
