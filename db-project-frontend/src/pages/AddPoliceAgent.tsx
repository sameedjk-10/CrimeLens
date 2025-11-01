import { useNavigate } from "react-router-dom";
import AddpoliceAgent from "../components/LoginCreate";

const AddpoliceAgentPage = () => {
  const navigate = useNavigate();

  // ✅ define what happens on button clicks
  const handlePublicAccess = () => {
    navigate("/public"); // this path must exist in your routes
  };

  const handleLogin = () => {
    navigate("/login"); // this path must exist in your routes
  };

  return (
    <AddpoliceAgent
      onPublicAccess={handlePublicAccess}
      onLogin={handleLogin}
    />
  );
};

export default AddpoliceAgentPage;
