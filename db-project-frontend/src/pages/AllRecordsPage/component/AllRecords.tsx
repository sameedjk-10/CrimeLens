import RecordsTable from "./RecordsTable";
import GreenButton from "../../../components/GreenButton";
import BackButton from "../../../components/BackButton";

interface AllRecordsProps {
  version: "admin" | "police";
}

export default function AllRecords({ version }: AllRecordsProps) {
  return (
    <section className="flex flex-row h-screen w-full">

      <div className="flex flex-col gap-y-4 pl-76 p-4 w-full overflow-y-auto">
        {/* Top section with title and button */}
        <div className="bg-[#fefefe] p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col gap-y-4 h-screen">
          <div className="flex flex-row justify-between items-start w-full">
            {/* Left Text Section */}
            <div className="flex flex-col gap-y-2">
              {version === "admin" ? (
                <>
                  <div className="flex items-start ">
                    <BackButton textSize="text-sm" iconSize={16} />
                  </div>
                  <div className="font-outfit font-semibold text-4xl text-black">
                    All Agents Records
                  </div>
                  <div className="font-outfit text-md text-[#A0A0A0]">
                    A complete list of all agents and their credentials stored
                    in the system database.
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start ">
                    <BackButton textSize="text-sm" iconSize={16} />
                  </div>
                  <div className="font-outfit font-semibold text-4xl text-black">
                    All Crime Records
                  </div>
                  <div className="font-outfit text-md text-[#A0A0A0]">
                    A complete list of all crime reports stored in the system
                    database.
                  </div>
                </>
              )}
            </div>

            {/* Right Button Section */}
            <div className="mt-1">
              <GreenButton
                label="Download CSV"
                width={200}
                height={40}
                rounded="xl"
              />
            </div>
          </div>

          {/* Records Table */}
          <div className="">
            <RecordsTable version={version} />
          </div>
        </div>
      </div>
    </section>
  );
}
