import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FormList from "./components/FormList";
import CreateForm from "./components/CreateForm";
import ViewForm from "./components/ViewForm";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Dynamic Form Builder
            </Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/create">
                    Create New Form
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/forms">
                    View All Forms
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/forms/submitted">
                    View All Filled Forms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1 container mt-4 mb-5">
          <Routes>
            <Route path="/create" element={<CreateForm />} />
            <Route path="/forms/:formId/edit" element={<CreateForm />} />
            <Route path="/forms/:formId/view" element={<ViewForm />} />
            <Route path="/forms/fill/:formId" element={<ViewForm />} />
            <Route
              path="/forms/submission/:submissionId"
              element={<ViewForm />}
            />
            <Route path="/forms" element={<FormList />} />
            <Route
              path="/forms/submitted"
              element={<FormList mode="submitted" />}
            />
            <Route path="*" element={<FormList />} />
          </Routes>
        </main>

        <footer className="bg-dark text-light py-3 mt-auto">
          <div className="container text-center">
            <small>© {new Date().getFullYear()} Dynamic Form Builder 🚀</small>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
