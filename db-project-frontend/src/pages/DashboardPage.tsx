import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";

const DashboardPage = () => {
  const navigate = useNavigate();

  // ✅ define what happens on button clicks
  const handlePublicAccess = () => {
    navigate("/dashboard"); // this path must exist in your routes
  };



  return (
    <Dashboard version="user"
      // onPublicAccess={handlePublicAccess}
    />
  );
};

export default DashboardPage;
