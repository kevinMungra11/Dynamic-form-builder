import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
interface FormItem {
  _id: string;
  title: string;
  createdAt: string;
  data: any[];
}

interface FormsApiResponse {
  data: FormItem[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

const FormList: React.FC = () => {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [formToDelete, setFormToDelete] = useState<FormItem | null>(null);
  const [showFillModal, setShowFillModal] = useState<boolean>(false);
  const [formToFill, setFormToFill] = useState<FormItem | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const navigate = useNavigate();

  const fetchForms = async (currentPage = page) => {
    setLoading(true);
    try {
      const response = await API.get<FormsApiResponse>(
        `/forms?page=${currentPage}`
      );
      setForms(response.data.data);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch {
      setError("Failed to fetch forms. Backend might be down.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [page]);

  const handleDeleteClick = (form: FormItem) => {
    setFormToDelete(form);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (formToDelete) {
      try {
        await API.delete(`/forms/${formToDelete._id}`);
        setShowDeleteModal(false);
        setFormToDelete(null);
        const nextPage = forms.length === 1 && page > 1 ? page - 1 : page;
        setPage(nextPage);
        fetchForms();
      } catch {
        setError("Failed to delete form. Please try again.");
      }
    }
  };

  const handleFillClick = (form: FormItem) => {
    setFormToFill(form);
    setShowFillModal(true);
    setFirstName("");
    setLastName("");
  };

  const handleFillSubmit = () => {
    if (formToFill && firstName && lastName) {
      navigate(
        `/forms/fill/${formToFill._id}?firstName=${firstName}&lastName=${lastName}`
      );
      setShowFillModal(false);
      setFormToFill(null);
    }
  };

  const handleViewClick = (formId: string) => {
    navigate(`/forms/view/${formId}`);
  };

  const handleEditClick = (formId: string) => {
    navigate(`/forms/${formId}/edit`);
  };

  const renderPagination = () => {
    return (
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <li
              key={num}
              className={`page-item ${num === page ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(num)}>
                {num}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading forms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">All Created Forms</h2>
      {forms.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          No forms created yet. Go to "Create New Form" to get started!
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {forms.map((form) => (
              <div key={form._id} className="col">
                <div className="card h-100 shadow-sm rounded border-dark">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title text-dark">{form.title}</h5>
                      <p className="card-text">
                        <small className="text-muted">
                          Created on:{" "}
                          {new Date(form.createdAt).toLocaleDateString()}
                        </small>
                      </p>
                    </div>
                    <div className="d-flex flex-wrap justify-content-end gap-2 mt-3">
                      <button
                        onClick={() => handleViewClick(form._id)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleFillClick(form)}
                        className="btn btn-outline-success btn-sm"
                      >
                        Fill
                      </button>
                      <button
                        onClick={() => handleEditClick(form._id)}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(form)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}
      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete the form{" "}
                <strong>{formToDelete?.title}</strong>?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showFillModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Fill Form: {formToFill?.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowFillModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name:
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowFillModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleFillSubmit}
                >
                  Proceed to Fill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormList;
