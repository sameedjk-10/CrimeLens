import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminLogin from "./pages/AdminLogin";
import PoliceLogin from "./pages/PoliceLogin";
import AddPoliceAgent from "./pages/AddPoliceAgent";
import Dashboard from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";

function App() {
  return (
    <Routes>
      {/* Default route → show HomePage */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/police-login" element={<PoliceLogin />} />
      <Route path="/add-police-agent" element={<AddPoliceAgent />} />
      <Route path="/upload-crimes" element={<UploadPage version="admin" />} />
      <Route path="/upload-crimes-police" element={<UploadPage version="police" />} />

    </Routes>
  );
}

export default App;
