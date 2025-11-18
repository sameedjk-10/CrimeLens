import Sidebar from "../../components/Sidebar";
import Statistics from "./component/Statistics";

interface StatisticsPageProps {
  version: "admin" | "police" | "user";
}

const StatisticsPage = ({ version }: StatisticsPageProps) => {
  return (
    <section className="flex flex-row h-screen overflow-hidden">

      {/* LEFT SIDEBAR FIXED */}
      <div className="h-full w-60 fixed left-0 top-0 p-4">
        <Sidebar version={version} />
      </div>

      {/* RIGHT MAIN CONTENT */}
      <Statistics />

    </section>
  );
};

export default StatisticsPage;
