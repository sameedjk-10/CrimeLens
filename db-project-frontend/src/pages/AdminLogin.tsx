import { useNavigate } from "react-router-dom";
import AdminLogin from "../components/LoginAdmin";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  // ✅ define what happens on button clicks
  const handlePublicAccess = () => {
    navigate("/public"); // this path must exist in your routes
  };

  const handleLogin = () => {
    navigate("/login"); // this path must exist in your routes
  };

  return (
    <AdminLogin
      onPublicAccess={handlePublicAccess}
      onLogin={handleLogin}
    />
  );
};

export default AdminLoginPage;
