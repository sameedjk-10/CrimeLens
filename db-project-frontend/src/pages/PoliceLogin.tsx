import { useNavigate } from "react-router-dom";
import PoliceLogin from "../components/LoginPolice";

const PoliceLoginPage = () => {
  const navigate = useNavigate();

  // ✅ define what happens on button clicks
  const handlePublicAccess = () => {
    navigate("/public"); // this path must exist in your routes
  };

  const handleLogin = () => {
    navigate("/login"); // this path must exist in your routes
  };

  return (
    <PoliceLogin
      onPublicAccess={handlePublicAccess}
      onLogin={handleLogin}
    />
  );
};

export default PoliceLoginPage;
