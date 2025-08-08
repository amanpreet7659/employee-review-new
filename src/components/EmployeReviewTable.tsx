import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import {
  isEditMode,
  selectReviewsWithTier,
} from "../features/reviews/selectors";
import { deleteReview, isUpdate } from "../features/reviews/reviewSlice";
import type { Review } from "../types";
import { useMemo, useState } from "react";
import EmployeReviewForm from "./EmployeReviewForm";
import Swal from "sweetalert2";

export default function ReviewTable() {
  const reviews = useSelector(selectReviewsWithTier);
  const isEdit = useSelector(isEditMode);
  const dispatch = useDispatch();
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [searchText, setSearchText] = useState("");
  const conditionalRowStyles = [
    {
      when: (row: any) => row.performanceTier === "Excellent",
      style: { backgroundColor: "#d4edda", color: "#155724" },
    },
    {
      when: (row: any) => row.performanceTier === "Good",
      style: { backgroundColor: "#cce5ff", color: "#004085" },
    },
    {
      when: (row: any) => row.performanceTier === "Average",
      style: { backgroundColor: "#fff3cd", color: "#856404" },
    },
    {
      when: (row: any) => row.performanceTier === "Poor",
      style: { backgroundColor: "#f8d7da", color: "#721c24" },
    },
  ];

  const columns = [
    { name: "Name", selector: (row: any) => row.employeeName, sortable: true },
    {
      name: "Department",
      selector: (row: any) => row.department,
      sortable: true,
    },
    { name: "Rating", selector: (row: any) => row.rating, sortable: true },
    {
      name: "Tier",
      cell: (row: any) => {
        let badgeClass = "bg-secondary";
        switch (row.performanceTier) {
          case "Excellent":
            badgeClass = "bg-success";
            break;
          case "Good":
            badgeClass = "bg-primary";
            break;
          case "Average":
            badgeClass = "bg-warning text-dark";
            break;
          case "Poor":
            badgeClass = "bg-danger";
            break;
        }
        return (
          <span
            className={`badge d-flex align-items-center justify-content-center ${badgeClass}`}
            style={{ height: "20px", minWidth: "40px" }}
          >
            {row.performanceTier}
          </span>
        );
      },
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="d-flex gap-2">
          <i
            className="bi bi-pencil-square text-primary"
            role="button"
            onClick={() => {
              setEditReview(row);
              dispatch(isUpdate(true));
            }}
            title="Edit"
          ></i>
          <i
            className="bi bi-trash text-danger"
            role="button"
            onClick={() => handleDelete(row)}
            title="Delete"
          ></i>
        </div>
      ),
    },
  ];

  const handleDelete = (review: Review) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete review for ${review.employeeName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      reverseButtons:true,
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      backdrop:false,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteReview(review.id));
        Swal.fire({
          title: "Deleted!",
          text: "Review has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleUpdate = () => {
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Review updated successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
    setEditReview(null);
    dispatch(isUpdate(false));
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(
      (review) =>
        review.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
        review.department.toLowerCase().includes(searchText.toLowerCase()) ||
        review.performanceTier.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [reviews, searchText]);

  return (
    <>
      <div className="row">
        <div className={isEdit ? "col-md-6" : "col-md-0"}>
          {isEdit && editReview && (
            <EmployeReviewForm
              editableReview={editReview}
              onFinish={handleUpdate}
              onCancel={() => {
                setEditReview(null);
                dispatch(isUpdate(false));
              }}
            />
          )}
        </div>
        <div className={isEdit ? "col-md-6" : "col-md-12"}>
          <DataTable
            title="Employee Reviews"
            columns={columns}
            data={filteredReviews}
            pagination
            highlightOnHover
            selectableRows={false}
            // conditionalRowStyles={conditionalRowStyles}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search by name, department, or tier"
                className="form-control"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: "300px" }}
              />
            }
          />
        </div>
      </div>
    </>
  );
}
