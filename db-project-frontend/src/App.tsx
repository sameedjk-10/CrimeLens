import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage/";
import StatisticsPage from "./pages/StatisticsPage";
import ReportCrimePage from "./pages/ReportCrimePage";
import VerificationPage from "./pages/VerificationPage";
import AllRecordsPage from "./pages/AllRecordsPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";



function App() {
  return (
    
    <HomePage/>

    /*<Routes>
       {/*Default route → show HomePage 
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/police-login" element={<PoliceLogin />} />
      <Route path="/add-police-agent" element={<AddPoliceAgent />} />
      <Route path="/upload-crimes" element={<UploadPage version="admin" />} />
      <Route path="/upload-crimes-police" element={<UploadPage version="police" />} />

  </Routes> */

  );
}

export default App;
