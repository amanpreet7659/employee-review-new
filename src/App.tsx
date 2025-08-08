import EmployeReviewForm from "./components/EmployeReviewForm";
import EmployeReviewTable from "./components/EmployeReviewTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSelector } from "react-redux";
import { isEditMode } from "./features/reviews/selectors";

function App() {
  const isEdit = useSelector(isEditMode);
  return (
    <div className="container mt-4 borderS">
      <h2 className="mb-4 text-center">Employee Performance Reviews</h2>
      <div className="row">
        <div className={isEdit ? "col-md-0" : "col-md-6"}>
          {!isEdit && <EmployeReviewForm />}
        </div>
        <div className={isEdit ? "col-md-12" : "col-md-6"}>
          <EmployeReviewTable />
        </div>
      </div>
    </div>
  );
}

export default App;
