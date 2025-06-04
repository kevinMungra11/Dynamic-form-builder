import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import API from "../api/axiosConfig";
import type { FormSchema, Mode, SubmissionData } from "../types/form";

const useQueryParams = () => new URLSearchParams(window.location.search);

function FormView() {
  const { formId, submissionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQueryParams();

  const [formData, setFormData] = useState<FormSchema | null>(null);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, string | boolean>>(
    {}
  );

  const mode: Mode = location.pathname.includes("/fill")
    ? "fill"
    : location.pathname.includes("/submission")
    ? "filled"
    : "view";

  const firstName = query.get("firstName") || "";
  const lastName = query.get("lastName") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (mode === "fill" || mode === "view") {
          // For fill and view, just get the form schema
          const res = await API.get<FormSchema>(`/forms/${formId}`);
          setFormData(res.data);
          // Clear any responses (fill mode will input them, view mode is read-only)
          setResponses({});
        } else if (mode === "filled") {
          // For filled mode, fetch submission + form schema
          const submissionRes = await API.get<SubmissionData>(
            `/submission/${submissionId}`
          );
          setSubmissionData(submissionRes.data);

          const formRes = await API.get<FormSchema>(
            `/forms/${submissionRes.data.formId}`
          );
          setFormData(formRes.data);
          setResponses(submissionRes.data.responses);
        }
      } catch (err) {
        toast.error("Failed to load form data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formId, submissionId, mode]);

  const handleChange = (label: string, value: string | boolean) => {
    setResponses((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName) {
      toast.error("Missing firstName or lastName in query params.");
      return;
    }

    if (!formData) {
      toast.error("Form data not loaded.");
      return;
    }

    const missingRequired = formData.fields.some(
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
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Submission failed.");
    }
  };

  if (loading)
    return <div className="container text-center my-5">Loading...</div>;
  if (!formData)
    return <div className="container text-center my-5">Form not found 🚫</div>;

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center text-primary mb-4">{formData.title}</h2>

      {(mode === "fill" || mode === "filled") && (
        <p className="text-center text-muted mb-4">
          {mode === "fill" ? (
            <>
              Filling as{" "}
              <strong>
                {firstName} {lastName}
              </strong>
            </>
          ) : (
            <>
              Filled by{" "}
              <strong>
                {submissionData?.firstName} {submissionData?.lastName}
              </strong>
            </>
          )}
        </p>
      )}

      <form
        className="p-4 border rounded bg-light shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === "fill") handleSubmit();
        }}
      >
        {formData.fields.map((field, idx) => {
          const value = responses[field.label];

          if (field.type === "text") {
            return (
              <div key={idx} className="mb-4">
                <label className="form-label fw-bold">
                  {field.label}{" "}
                  {field.required && <span className="text-danger">*</span>}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter response"
                  disabled={mode !== "fill"}
                  required={field.required}
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              </div>
            );
          } else if (field.type === "checkbox") {
            return (
              <div key={idx} className="mb-4 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`checkbox-${idx}`}
                  disabled={mode !== "fill"}
                  checked={Boolean(value)}
                  onChange={(e) => handleChange(field.label, e.target.checked)}
                />
                <label className="form-check-label" htmlFor={`checkbox-${idx}`}>
                  {mode === "fill" ? "Tick if applicable" : "Checkbox"}
                </label>
              </div>
            );
          }
          return null;
        })}

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
