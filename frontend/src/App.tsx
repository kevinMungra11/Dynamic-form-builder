import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FormList from "./components/FormList";
import CreateForm from "./components/CreateForm";
import ViewForm from "./components/ViewForm";

function App() {
  return (
    <Router>
      <div className="App">
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
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/create" element={<CreateForm />} />
            <Route path="/forms/:formId/edit" element={<CreateForm />} />
            <Route path="/forms/:formId/view" element={<ViewForm />} />
            <Route path="/forms/fill/:formId" element={<ViewForm />} />
            <Route path="/forms" element={<FormList />} />
            <Route path="/" element={<FormList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
