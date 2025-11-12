import Dashboard from "./components/Dashboard";
import AllRecords from "./components/AllRecords";
import Verification from "./components/Verification";
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
