import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { type Field, type ApiResponse } from "../types/form";
import API from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function CreateForm() {
  const [title, setTitle] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const { formId } = useParams();
  const isEditMode = Boolean(formId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await API.get<ApiResponse>(`/forms/${formId}`);
        setTitle(res.data.title);
        setFields(res.data.fields);
      } catch (error: any) {
        toast.error("Failed to load form data.");
        console.error(error);
      }
    };
    if (isEditMode) {
      fetchForm();
    }
  }, [formId]);

  const addField = (type: "text" | "checkbox"): void => {
    setFields([...fields, { label: "", type, required: false }]);
    toast.info(`Added a new ${type} field.`);
  };

  const removeField = (index: number): void => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    toast.warn("Field removed.");
  };

  const handleFieldChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, checked } = event.target;
    const newFields = [...fields];
    if (name === "label") {
      newFields[index].label = value;
    } else if (name === "required") {
      newFields[index].required = checked;
    }
    setFields(newFields);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Form title is required.");
      return;
    }

    if (fields.length === 0) {
      toast.error("Please add at least one field.");
      return;
    }

    const emptyFieldLabels = fields.some((field) => !field.label.trim());
    if (emptyFieldLabels) {
      toast.error("All field labels must be provided.");
      return;
    }

    const labelSet = new Set<string>();
    const hasDuplicate = fields.some((field) => {
      const lowerLabel = field.label.trim().toLowerCase();
      if (labelSet.has(lowerLabel)) return true;
      labelSet.add(lowerLabel);
      return false;
    });

    if (hasDuplicate) {
      toast.error("Field labels must be unique.");
      return;
    }

    try {
      if (isEditMode) {
        await API.patch(`/forms/${formId}`, { title, fields });
        toast.success("Form updated successfully!");
        setTimeout(() => navigate(`/`), 150);
      } else {
        await API.post<ApiResponse>("/forms", {
          title,
          fields,
        });
        toast.success("Form created successfully!");
        setTitle("");
        setFields([]);
        setTimeout(() => navigate(`/`), 150);
      }
    } catch (error: any) {
      console.error(
        "Form submission error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center text-success mb-4 fw-bold">
        {isEditMode ? "Edit Your Form" : "Create a New Form"}
      </h2>

      <ToastContainer position="top-right" autoClose={3000} />

      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light"
      >
        <div className="mb-4">
          <label htmlFor="formTitle" className="form-label fs-5 text-dark">
            Form Title:
          </label>
          <input
            type="text"
            id="formTitle"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            required
            className="form-control form-control-lg"
            placeholder="e.g., Customer Feedback Survey"
          />
        </div>

        <h4 className="mb-3 mt-4 text-secondary text-center border-bottom pb-2">
          Form Fields ({fields.length})
        </h4>

        {fields.length === 0 && (
          <p className="text-muted text-center py-3 border rounded bg-white">
            No fields added yet. Use the buttons below to add one!
          </p>
        )}

        {fields.map((field, index) => (
          <div key={index} className="card mb-4 border shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div className="flex-grow-1">
                <label
                  htmlFor={`fieldLabel-${index}`}
                  className="form-label fw-semibold"
                >
                  Field Label
                </label>
                <input
                  type="text"
                  id={`fieldLabel-${index}`}
                  name="label"
                  value={field.label}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="form-control"
                  placeholder={`Label for ${field.type}`}
                />
              </div>

              <div className="d-flex flex-column align-items-start">
                <span className="badge bg-secondary mb-2">
                  {field.type === "text" ? "Text Input" : "Checkbox"}
                </span>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`requiredSwitch-${index}`}
                    name="required"
                    checked={field.required}
                    onChange={(e) => handleFieldChange(index, e)}
                  />
                  <label
                    className="form-check-label ms-2"
                    htmlFor={`requiredSwitch-${index}`}
                  >
                    Required
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline-danger mt-2 mt-md-0"
                onClick={() => removeField(index)}
              >
                <i className="bi bi-trash3-fill me-2"></i> Remove
              </button>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => addField("text")}
            className="btn btn-outline-primary px-4 py-2 d-flex align-items-center gap-2"
          >
            <i className="bi bi-input-cursor-text"></i> Text Input
          </button>
          <button
            type="button"
            onClick={() => addField("checkbox")}
            className="btn btn-outline-secondary px-4 py-2 d-flex align-items-center gap-2"
          >
            <i className="bi bi-check2-square"></i> Checkbox
          </button>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-success btn-lg shadow">
            <i className="bi bi-send-plus-fill me-2"></i>
            {isEditMode ? "Update Form" : "Create Form"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateForm;
