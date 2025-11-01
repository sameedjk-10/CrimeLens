import { useNavigate } from "react-router-dom";
import Home from "../components/Home";

const HomePage = () => {
  const navigate = useNavigate();

  // ✅ define what happens on button clicks
  const handlePublicAccess = () => {
    navigate("/public"); // this path must exist in your routes
  };

  const handleLogin = () => {
    navigate("/login"); // this path must exist in your routes
  };

  return (
    <Home
      onPublicAccess={handlePublicAccess}
      onLogin={handleLogin}
    />
  );
};

export default HomePage;
