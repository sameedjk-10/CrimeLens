import { useNavigate } from "react-router-dom";
import AddpoliceAgent from "../components/AddPolice";

const AddpoliceAgentPage = () => {
  const navigate = useNavigate();

  // ✅ define what happens on button clicks

  const handleSubmit = () => {
    navigate("/"); // this path must exist in your routes
  };

  return (
    <AddpoliceAgent
      OnSubmit={handleSubmit}
    />
  );
};

export default AddpoliceAgentPage;
