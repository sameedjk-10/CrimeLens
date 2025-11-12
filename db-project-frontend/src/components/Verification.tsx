import Sidebar from "./Sidebar";
import GreenButton from "./GreenButton";
import RecordsTable from "./RecordsTable";
import VerificationCard from "./VerificationCard";

interface AllRecordsProps {
  version: "admin" | "police";
}

export default function AllRecords({ version }: AllRecordsProps) {
  return (
    <section className="flex flex-row h-screen w-full">
      {/* Sidebar */}
      <div className="w-[260px] fixed left-0 top-0 h-full p-4">
        <Sidebar version={version} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-y-4 pl-76 p-4 w-full overflow-y-auto">
        {/* Top section with title and button */}
        <div className="bg-[#fefefe] p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col gap-y-4">
          <div className="flex flex-row justify-between items-start w-full">
            {/* Left Text Section */}
            <div className="flex flex-col gap-y-2">
              {version === "admin" ? (
                <>
                  <div className="font-outfit font-semibold text-4xl text-black">
                    Verify New Agent
                  </div>
                  <div className="font-outfit text-md text-[#A0A0A0]">
                    Review and authorize a new agent registration requests
                    submitted by police branches.
                  </div>
                </>
              ) : (
                <>
                  <div className="font-outfit font-semibold text-4xl text-black">
                    Verify Report
                  </div>
                  <div className="font-outfit text-md text-[#A0A0A0]">
                    Review newly submitted crime reports and verify their
                    authenticity before approval.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CRIME MAP SECTION */}
        <div className="p-6 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)]  flex justify-stretch ">
          {/* Cards Table */}
          {version === "admin" ? (
            <>
              <div className="flex flex-col w-full h-fit gap-y-6">
                <VerificationCard
                  version="admin"
                  branchId="PK-901823"
                  branchContact="021-82191281"
                  username="ACP_Pradyuman"
                  password="pradyuman_1234"
                  requestDate="25-7-2025"
                />
                <VerificationCard
                  version="admin"
                  branchId="PK-901823"
                  branchContact="021-82191281"
                  username="ACP_Pradyuman"
                  password="pradyuman_1234"
                  requestDate="25-7-2025"
                />
                <VerificationCard
                  version="admin"
                  branchId="PK-901823"
                  branchContact="021-82191281"
                  username="ACP_Pradyuman"
                  password="pradyuman_1234"
                  requestDate="25-7-2025"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col w-full h-fit gap-y-6">
                <VerificationCard
                  version="police"
                  fullName="Muhammad Sameed Jamal Khan"
                  contact="0329-3019690"
                  cnic="42201-1231241-9"
                  crimeType="Street Snatching"
                  description="Two men on a bike snatched my phone near Saddar Market."
                  date="25-7-2025"
                  zone={24}
                />
                <VerificationCard
                  version="police"
                  fullName="Muhammad Sameed Jamal Khan"
                  contact="0329-3019690"
                  cnic="42201-1231241-9"
                  crimeType="Street Snatching"
                  description="Two men on a bike snatched my phone near Saddar Market."
                  date="25-7-2025"
                  zone={24}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
