import Sidebar from "../../components/Sidebar";
import Dashboard from "./component/Dashboard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";

const DashboardPage = () => {

  return (
      <Dashboard/>
  );
};

export default DashboardPage;
