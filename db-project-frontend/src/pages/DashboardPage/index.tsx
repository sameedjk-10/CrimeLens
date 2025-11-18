import Sidebar from "../../components/Sidebar";
import Dashboard from "./component/Dashboard";

interface DashboardPageProps {
  version?: "admin" | "police" | "user";
}

const DashboardPage = ({ version }: DashboardPageProps) => {
  return (
    <section className="flex flex-row h-screen overflow-hidden">

      {/* LEFT SIDEBAR FIXED */}
      <div className="h-full w-60 fixed left-0 top-0 p-4">
        <Sidebar version={version} />
      </div>

      {/* RIGHT MAIN CONTENT */}
      <Dashboard />

    </section>
  );
};

export default DashboardPage;
