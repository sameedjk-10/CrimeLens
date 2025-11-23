import StatsCard from "../../../components/StatsCards";
import MapBackground from "../../../assets/MapBackground.png";
import BackButton from "../../../components/BackButton";
import StatsCharts from "../../../components/StatsCharts";
import { useNavigate } from "react-router-dom";


const Statistics = () => {

  const navigate = useNavigate();

  const NavigateDashboard = () => {
    navigate('/dashboard');
  }

  return (
    <section className="flex flex-row items-start p-4 h-180 overflow-y-auto">
      <div className="flex flex-col gap-y-4 ml-68 pb-3">
        {/* STATS CARDS AND STUFF */}
        <div className="ml-4 bg-[#fefefe] p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col gap-y-2">
          <div className="flex items-start ml-2" onClick={NavigateDashboard}>
            <BackButton textSize="text-sm" iconSize={16} />
          </div>
          <div className="flex flex-row justify-between items-start w-full">
            {/* Left Text Section */}
            <div className="flex flex-col gap-y-2 ml-2">
              <div className="font-outfit font-semibold text-4xl text-black flex items-start">
                Statistics
              </div>
              <div className="font-outfit text-md text-[#A0A0A0] flex items-start mb">
                A detailed overview of crime trends, reports, and key metrics
                derived from live police data.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="flex gap-x-4">
              <StatsCard
                title="Total Zones"
                value={32}
                subText="City regions divided into blocks"
                bgColor="bg-[#ffffff]"
                width="w-[280px]"
                height="h-[180px]"
                mainTextColor="text-black"
                smallTextColor="text-[#237E54]"
              />

              <StatsCard
                title="Green Zones"
                value={20}
                subText="Zones marked as ‘Safe’"
                bgColor="bg-[#ffffff]"
                width="w-[280px]"
                height="h-[180px]"
                mainTextColor="text-black"
                smallTextColor="text-[#237E54]"
                sphereProps={{ diameter: 12, bgColor: "bg-green-500" }}
              />

              <StatsCard
                title="Yellow Zones"
                value="07"
                subText="Zones marked as ‘Caution’"
                bgColor="bg-[#ffffff]"
                width="w-[280px]"
                height="h-[180px]"
                mainTextColor="text-black"
                smallTextColor="text-[#237E54]"
                sphereProps={{ diameter: 12, bgColor: "bg-yellow-500" }}
              />

              <StatsCard
                title="Yellow Zones"
                value="05"
                subText="Zones marked as ‘High-Risk’"
                bgColor="bg-[#ffffff]"
                width="w-[280px]"
                height="h-[180px]"
                mainTextColor="text-black"
                smallTextColor="text-[#237E54]"
                sphereProps={{ diameter: 12, bgColor: "bg-red-500" }}
              />
            </div>

            <div className="flex gap-x-4">
              <StatsCard
                title="Total Zones"
                value={32}
                subText="City regions divided into blocks"
                bgColor="bg-[#ffffff]"
                width="w-[280px]"
                height="h-[180px]"
                mainTextColor="text-black"
                smallTextColor="text-[#237E54]"
              />

              <StatsCard
                title="Green Zones"
                value={20}
                subText="Zones marked as ‘Safe’"
                bgColor="bg-[#ffffff]"
                width="w-[280px]"
                height="h-[180px]"
                mainTextColor="text-black"
                smallTextColor="text-[#237E54]"
                sphereProps={{ diameter: 12, bgColor: "bg-green-500" }}
              />

              <StatsCard
                title="Yellow Zones"
                value="07"
                subText="Zones marked as ‘Caution’"
                bgColor="bg-[#ffffff]"
                width="w-[280px]"
                height="h-[180px]"
                mainTextColor="text-black"
                smallTextColor="text-[#237E54]"
                sphereProps={{ diameter: 12, bgColor: "bg-yellow-500" }}
              />

              <StatsCard
                title="Yellow Zones"
                value="05"
                subText="Zones marked as ‘High-Risk’"
                bgColor="bg-[#ffffff]"
                width="w-[280px]"
                height="h-[180px]"
                mainTextColor="text-black"
                smallTextColor="text-[#237E54]"
                sphereProps={{ diameter: 12, bgColor: "bg-red-500" }}
              />
            </div>
          </div>
        </div>

        {/* THE CRIME MAP AND STUFF */}
        <div className="ml-4 bg-[#fefefe] p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)]"
        style={{
            backgroundImage: `url(${MapBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
          <div className="flex flex-row justify-between items-start w-full">
            {/* Left Text Section */}
            <div className="flex flex-col gap-y-2 ml-2">
              <div className="font-outfit font-semibold text-3xl text-white flex items-start">
                Graphical Statistics
              </div>
              <div className="font-outfit font-normal text-md text-[#efecec] flex items-start mb-2">
                Dynamic charts showcasing accurate, real-time crime data across
                the city.
              </div>
              <div>
                <StatsCharts />
              </div>
            </div>

            {/* Right Arrow Button Section */}
            <div className="flex items-start mt-2 mr-2">
            
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
