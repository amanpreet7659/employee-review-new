import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { addReview, editReview } from "../features/reviews/reviewSlice";
import { useEffect } from "react";
import type { Review } from "../types";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";

const departments = ["HR", "Logistic", "Development", "Admin", "IT Support"];

interface Props {
  editableReview?: Review;
  onFinish?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  editableReview,
  onFinish,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<Review>({
    mode: "onChange",
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (editableReview) {
      reset({
        ...editableReview,
        reviewPeriod: {
          from: new Date(editableReview.reviewPeriod.from),
          to: new Date(editableReview.reviewPeriod.to),
        },
      });
    }
  }, [editableReview, reset]);

  const onSubmit = (data: Review) => {
    data = { ...data, employeeName: data.employeeName.trim() };
    const review: Review = {
      ...data,
      id: editableReview?.id || uuidv4(),
      reviewPeriod: {
        from: (data.reviewPeriod.from as unknown as Date)?.toISOString(),
        to: (data.reviewPeriod.to as unknown as Date)?.toISOString(),
      },
      comments: data.comments,
    };

    if (editableReview) {
      dispatch(editReview(review));
    } else {
      dispatch(addReview(review));
    }

    reset();
    onFinish?.();
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: editableReview
        ? "Review updated successfully"
        : "Review added successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <form
      onSubmit={(e)=>{handleSubmit(onSubmit)(e)}}
      className="container p-4 border rounded bg-light mb-4"
    >
      <div className="mb-3">
        <label className="form-label">Employee Name</label>
        <input
          {...register("employeeName", {
            required: "Employee Name is required",
          })}
          className={`form-control ${errors.employeeName ? "is-invalid" : ""}`}
          placeholder="Enter name"
        />
        {errors.employeeName && (
          <div className="invalid-feedback">{errors.employeeName.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Department</label>
        <select
          {...register("department", { required: "Department is required" })}
          className={`form-select ${errors.department ? "is-invalid" : ""}`}
        >
          <option value="">Select department</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
        {errors.department && (
          <div className="invalid-feedback">{errors.department.message}</div>
        )}
      </div>

      <div className="row mb-3">
        <div className="col d-flex flex-column">
          <label className="form-label">From Date</label>
          <Controller
            name="reviewPeriod.from"
            control={control}
            rules={{ required: "From Date is required" }}
            render={({ field }) => (
              <DatePicker
                selected={field.value as unknown as Date}
                onChange={field.onChange}
                className={`form-control ${
                  errors.reviewPeriod?.from ? "is-invalid" : ""
                }`}
                placeholderText="From"
                maxDate={new Date()}
              />
            )}
          />
          {errors.reviewPeriod?.from && (
            <div className="invalid-feedback d-block">
              {errors.reviewPeriod?.from.message}
            </div>
          )}
        </div>

        <div className="col d-flex flex-column">
          <label className="form-label">To Date</label>
          <Controller
            name="reviewPeriod.to"
            control={control}
            rules={{ required: "To Date is required" }}
            render={({ field }) => (
              <DatePicker
                selected={field.value as unknown as Date}
                onChange={field.onChange}
                className={`form-control ${
                  errors.reviewPeriod?.to ? "is-invalid" : ""
                }`}
                placeholderText="To"
                maxDate={new Date()}
                minDate={new Date(watch("reviewPeriod.from"))}
              />
            )}
          />
          {errors.reviewPeriod?.to && (
            <div className="invalid-feedback d-block">
              {errors.reviewPeriod?.to.message}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Performance Rating: {watch("rating") || 5}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          {...register("rating", { required: "Rating is required" })}
          className={`form-range ${errors.rating ? "is-invalid" : ""}`}
        />
        {errors.rating && (
          <div className="invalid-feedback">{errors.rating.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Reviewer Comments</label>
        <Controller
          name="comments"
          control={control}
          rules={{
            required: "Comments are required",
            validate: (value) =>
              value.trim() !== "" || "Comments cannot be empty",
          }}
          render={({ field }) => (
            <ReactQuill
              theme="snow"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.comments && (
          <div className="text-danger mt-1">{errors.comments.message}</div>
        )}
      </div>
      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            onCancel?.();
          }}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {editableReview ? "Update" : "Submit"} Review
        </button>
      </div>
    </form>
  );
}
