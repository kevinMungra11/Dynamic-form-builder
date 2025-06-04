import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";

interface FormType {
  _id: string;
  title: string;
  createdAt: string;
  data: [];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

const FormList: React.FC = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await API.get<FormType[]>("/forms");
        console.log(response);
        setForms(response.data.data);
        setLoading(false);
      } catch (err: any) {
        console.error(
          "Error fetching forms:",
          err.response?.data || err.message
        );
        setError(
          "Failed to fetch forms. Please ensure the backend server is running and accessible."
        );
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

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
        <ul className="list-group">
          {forms.map((form) => (
            <li
              key={form._id}
              className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2 shadow-sm rounded"
            >
              <div className="text-center text-md-start mb-2 mb-md-0">
                <h5 className="mb-1">{form.title}</h5>
                <small className="text-muted">
                  Created on: {new Date(form.createdAt).toLocaleDateString()}
                </small>
              </div>
              <Link to={`/forms/${form._id}`}>
                <button className="btn btn-primary btn-sm w-100 w-md-auto">
                  View/Fill Form
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormList;
