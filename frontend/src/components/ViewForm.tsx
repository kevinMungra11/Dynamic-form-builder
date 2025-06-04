import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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

type Mode = "view" | "fill" | "filled";

const useQueryParams = () => {
  return new URLSearchParams(window.location.search);
};

function FormView() {
  const { formId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQueryParams();

  const [formData, setFormData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, string | boolean>>(
    {}
  );

  const mode: Mode = location.pathname.includes("/fill")
    ? "fill"
    : location.pathname.includes("/filled")
    ? "filled"
    : "view";

  const firstName = query.get("firstName") ?? "";
  const lastName = query.get("lastName") ?? "";

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

    if (formId) fetchForm();
  }, [formId]);

  const handleChange = (label: string, value: string | boolean) => {
    setResponses((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName) {
      toast.error("Missing firstName or lastName in query params.");
      return;
    }

    const missingRequired = formData?.fields.some(
      (field) =>
        field.required &&
        (responses[field.label] === undefined ||
          responses[field.label] === "" ||
          responses[field.label] === false)
    );

    if (missingRequired) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await API.post(`/submission/${formId}`, {
        formId,
        firstName,
        lastName,
        responses,
      });

      toast.success("Form submitted successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error("Submission failed.");
    }
  };

  if (loading) {
    return <div className="container text-center my-5">Loading form...</div>;
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
      <h2 className="text-center text-primary mb-4">{formData.title}</h2>

      {mode === "fill" && (
        <p className="text-center text-muted mb-4">
          Filling as{" "}
          <strong>
            {firstName} {lastName}
          </strong>
        </p>
      )}

      <form
        className="p-4 border rounded bg-light shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === "fill") handleSubmit();
        }}
      >
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
                placeholder="Enter response"
                disabled={mode !== "fill"}
                required={field.required}
                value={
                  typeof responses[field.label] === "string"
                    ? (responses[field.label] as string)
                    : ""
                }
                onChange={(e) => handleChange(field.label, e.target.value)}
              />
            ) : (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`checkbox-${index}`}
                  disabled={mode !== "fill"}
                  checked={Boolean(responses[field.label])}
                  onChange={(e) => handleChange(field.label, e.target.checked)}
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor={`checkbox-${index}`}
                >
                  {mode === "fill" ? "Tick if applicable" : "Checkbox"}
                </label>
              </div>
            )}
          </div>
        ))}

        {mode === "fill" && (
          <div className="text-center mt-5">
            <button type="submit" className="btn btn-success btn-lg">
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default FormView;
