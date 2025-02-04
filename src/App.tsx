import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewRecord from "./pages/NewRecord";
import ViewRecord from "./pages/ViewRecord";
import EditRecord from "./pages/EditRecord";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AuthGuard from "./components/AuthGuard";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Index />
            </AuthGuard>
          }
        />
        <Route
          path="/new"
          element={
            <AuthGuard>
              <NewRecord />
            </AuthGuard>
          }
        />
        <Route
          path="/record/:id"
          element={
            <AuthGuard>
              <ViewRecord />
            </AuthGuard>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <AuthGuard>
              <EditRecord />
            </AuthGuard>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;