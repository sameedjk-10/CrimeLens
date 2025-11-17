import Sidebar from "../components/Sidebar";
import AllRecords from "../components/AllRecords";

interface AllRecordsProps {
  version: "admin" | "police";
}

const AllRecordsPage = ({ version }: AllRecordsProps) => {
  return (
    <section className="flex flex-row h-screen overflow-hidden">

      {/* LEFT SIDEBAR FIXED */}
      <div className="h-full w-60 fixed left-0 top-0 p-4">
        <Sidebar version={version} />
      </div>

      {/* RIGHT MAIN CONTENT */}
      <AllRecords version={version}  />

    </section>
  );
};

export default AllRecordsPage;
