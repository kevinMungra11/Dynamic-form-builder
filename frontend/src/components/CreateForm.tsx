import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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

function CreateForm() {
  const [title, setTitle] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const navigate = useNavigate();

  const addField = (type: "text" | "checkbox"): void => {
    setFields([...fields, { label: "", type: type, required: false }]);
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
    const { name, value, type, checked } = event.target;
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

    try {
      const response = await API.post<ApiResponse>("/forms", { title, fields });
      toast.success("Form created successfully!");
      setTitle("");
      setFields([]);
      setTimeout(() => navigate(`/forms/${response.data._id}`), 1500);
    } catch (error: any) {
      console.error(
        "Error creating form:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to create form. Please try again."
      );
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-primary">Create New Form</h2>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
        <h3 className="mt-5 mb-4 text-center text-secondary border-bottom pb-2">
          Form Fields
        </h3>
        {fields.length === 0 && (
          <p className="text-muted text-center py-3 border rounded bg-white">
            No fields added yet. Click a button below to add one!
          </p>
        )}
        <div className="list-group mb-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className="list-group-item d-flex flex-column flex-md-row align-items-md-center justify-content-between p-3 mb-3 shadow-sm rounded-lg border" // Enhanced styling
            >
              <div className="flex-grow-1 me-md-3 mb-2 mb-md-0">
                <label
                  htmlFor={`fieldLabel-${index}`}
                  className="form-label text-muted"
                >
                  Field Label:
                </label>
                <input
                  type="text"
                  id={`fieldLabel-${index}`}
                  name="label"
                  value={field.label}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFieldChange(index, e)
                  }
                  placeholder={`Enter label for ${
                    field.type === "text" ? "Text Input" : "Checkbox"
                  } field`}
                  required
                  className="form-control"
                />
              </div>
              <div className="d-flex align-items-center me-md-3 mb-2 mb-md-0">
                <span className="badge bg-primary text-white me-2 py-2 px-3">
                  {field.type === "text" ? "Text Input" : "Checkbox"}
                </span>
              </div>
              <div className="form-check form-switch me-md-3 mb-2 mb-md-0 d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`requiredSwitch-${index}`}
                  name="required"
                  checked={field.required}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFieldChange(index, e)
                  }
                />
                <label
                  className="form-check-label ms-2 text-dark"
                  htmlFor={`requiredSwitch-${index}`}
                >
                  Required
                </label>
              </div>
              <button
                type="button"
                onClick={() => removeField(index)}
                className="btn btn-outline-danger btn-sm mt-2 mt-md-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => addField("text")}
            className="btn btn-info btn-lg flex-grow-1"
          >
            <i className="bi bi-input-text me-2"></i> Add Text Input
          </button>
          <button
            type="button"
            onClick={() => addField("checkbox")}
            className="btn btn-secondary btn-lg flex-grow-1"
          >
            <i className="bi bi-check-square me-2"></i> Add Checkbox
          </button>
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-success btn-lg">
            <i className="bi bi-plus-circle me-2"></i> Create Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateForm;
