import Sidebar from "../../components/Sidebar";
import Verification from "./component/Verification";

interface VerificationPageProps {
  version?: "admin" | "police";
}

const VerificationPage = ({ version }: VerificationPageProps) => {
  return (
    <section className="flex flex-row h-screen overflow-hidden">

      {/* LEFT SIDEBAR FIXED */}
      <div className="h-full w-60 fixed left-0 top-0 p-4">
        <Sidebar version={version} />
      </div>

      {/* RIGHT MAIN CONTENT */}
      <Verification version={version || "admin"}  />

    </section>
  );
};

export default VerificationPage;
