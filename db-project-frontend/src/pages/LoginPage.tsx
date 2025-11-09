import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleNewPolice = () => {
        navigate("/add-police-agent"); // this path must exist in your routes
    };
    const handleAdminLogin = () => {
        navigate("/admin-login"); // this path must exist in your routes
    };
    const handlePoliceLogin = () => {
        navigate("/police-login"); // this path must exist in your routes
    };
    const handleBackButton = () => {
        navigate("/"); // this path must exist in your routes
    };

    return (
        <Login
            onNewAgent={handleNewPolice}
            onAdminLogin={handleAdminLogin}
            onPoliceLogin={handlePoliceLogin}
            onBackButton={handleBackButton}
        />
    );
};

export default LoginPage;
