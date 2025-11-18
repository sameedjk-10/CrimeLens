import Sidebar from "../../components/Sidebar";
import ReportCrime from "./component/ReportCrime";


const ReportCrimePage = () => {
  return (
    <section className="flex flex-row h-screen overflow-hidden">

      {/* LEFT SIDEBAR FIXED */}
      <div className="h-full w-60 fixed left-0 top-0 p-4">
        <Sidebar version="admin"/>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <ReportCrime />

    </section>
  );
};

export default ReportCrimePage;
