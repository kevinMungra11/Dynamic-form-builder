import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import API from "../api/axiosConfig";

interface Field {
  label: string;
  type: "text" | "checkbox";
  required: boolean;
}

interface ApiResponse {
  _id: string;
  title: string;
  fields: Field[];
  createdAt: string;
}

function ViewForm() {
  const { formId } = useParams();
  const [formData, setFormData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await API.get<ApiResponse>(`/forms/${formId}`);
        setFormData(res.data);
      } catch (error: any) {
        toast.error("Failed to load form.");
        console.error("Fetch form error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId]);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <h3>Loading form...</h3>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="container text-center my-5">
        <h3>Form not found 🚫</h3>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-center text-primary mb-5">{formData.title}</h2>

      <form className="p-4 border rounded bg-light shadow-sm">
        {formData.fields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="form-label fw-bold">
              {field.label}
              {field.required && <span className="text-danger ms-1">*</span>}
            </label>

            {field.type === "text" ? (
              <input
                type="text"
                className="form-control"
                placeholder="User response"
                disabled
              />
            ) : (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`checkbox-${index}`}
                  disabled
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor={`checkbox-${index}`}
                >
                  Check to agree
                </label>
              </div>
            )}
          </div>
        ))}

        <div className="text-center mt-5">
          <button type="button" className="btn btn-secondary" disabled>
            Submit (Disabled)
          </button>
        </div>
      </form>
    </div>
  );
}

export default ViewForm;
