// import Dashboard from "./components/Dashboard";
// import AllRecords from "./components/AllRecords";
// import UploadPage from "./pages/UploadPage";
import { Routes, Route } from "react-router-dom";
// import StatisticsPage from "./pages/StatisticsPage";
// import ReportCrimePage from "./pages/ReportCrimePage";
// import VerificationPage from "./pages/VerificationPage";
// import AllRecordsPage from "./pages/AllRecordsPage";
// import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MapContainer from "./pages/MapViewPage"



function App() {
  return (
    <MapContainer/>
    // <Routes>
    //   {/* Default route → show HomePage */}
    //   {/* <Route path="/" element={<HomePage />} /> */}
    //   {/* <AllRecordsPage version="admin" /> */}


    //   {/*Default route → show HomePage  */}
    //   <Route path="/" element={<HomePage />} />

    //   {/* <Route path="/login" element={<LoginPage />} />
    //   <Route path="/dashboard" element={<Dashboard/>} />
    //   <Route path="/admin-login" element={<AdminLogin />} />
    //   <Route path="/police-login" element={<PoliceLogin />} />
    //   <Route path="/add-police-agent" element={<AddPoliceAgent />} />
    //   <Route path="/upload-crimes" element={<UploadPage version="admin" />} />
    //   <Route path="/upload-crimes-police" element={<UploadPage version="police" />} />
    //   <Route path="/verification" element={<VerificationPage version="police"/>} />
    //   <Route path="/statistics" element={<StatisticsPage version="police"/>} />
    //   <Route path="/report-crime" element={<ReportCrimePage />} />
    //   <Route path="/all-records" element={<AllRecords version="admin"/>} /> */}
      

    // </Routes>

  );
}

export default App;
