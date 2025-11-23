import Sidebar from "../../components/Sidebar";
import Verification from "./component/Verification";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";

interface VerificationPageProps {
  version?: "admin" | "police";
}

const VerificationPage = ({ version }: VerificationPageProps) => {
  const role = useSelector((state: RootState) => state.currentRole.role);

  return <Verification version={role || "admin"} />;
};

export default VerificationPage;
