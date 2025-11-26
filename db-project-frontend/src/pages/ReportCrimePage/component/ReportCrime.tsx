import BackButton from "../../../components/BackButton";
import ReportCrimeCard from "./ReportCrimeCard";
import { useNavigate } from "react-router-dom";


export default function ReportCrime() {

  const navigate = useNavigate();

  return (
    <section className="flex flex-row h-screen w-full bg-red-100">

      <div className="flex flex-col gap-y-4 pl-76 p-4 w-full overflow-y-auto">
        {/* Top section with title and button */}
        <div className="bg-[#fefefe] p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col gap-y-4">
          <div className="flex flex-row justify-between items-start w-full">
            {/* Left Text Section */}
            <div className="flex flex-col gap-y-2">
              <div className="font-outfit font-semibold text-4xl text-black">
                Report Crime
              </div>
              <div className="font-outfit text-md text-[#A0A0A0]">
                Submit details of a crime incident directly to the police
                station corresponding to the zone of crime for verification.
              </div>
            </div>
          </div>
        </div>

        {/* Submit Crime Report Section */}
        <div className="p-6 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] flex justify-stretch ">
          <ReportCrimeCard />
        </div>
      </div>
    </section>
  );
}
