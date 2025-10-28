import Sidebar from "./Sidebar";
import StatsCard from "./StatsCards";
import MapBackground from "../assets/MapBackground.png";
import GreenButton from "./GreenButton";
import ArrowButton from "./ArrowButton";

interface DashboardProps {
  version: "admin" | "police" | "user";
}

const Dashboard = ({ version }: DashboardProps) => {
  return (
    <section className="flex flex-row items-start p-4">
      <div>
        <Sidebar version={version} />
      </div>

      <div className="flex flex-col gap-y-4">
        {/* STATS CARDS AND STUFF */}
        <div className="ml-4 bg-[#fefefe] p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col gap-y-2">
          <div className="flex flex-row justify-between items-start w-full">
            {/* Left Text Section */}
            <div className="flex flex-col gap-y-2 ml-2">
              <div className="font-outfit font-semibold text-4xl text-black flex items-start">
                Dashboard
              </div>
              <div className="font-outfit text-md text-[#A0A0A0] flex items-start mb-2">
                Monitor live updates on crime density, red zones, and incident
                patterns across the city.
              </div>
            </div>

            {/* Right Button Section */}
            <div className="flex items-start mt-2">
              <GreenButton
                label="View all Statistics"
                width={280}
                height={50}
              />
            </div>
          </div>

          <div className="flex gap-x-4">
            <StatsCard
              title="Total Crimes"
              value={28}
              subText="Updated from last 30 days"
              bgColor="bg-[#ffffff]"
              gradientBg="linear-gradient(to bottom, #145332, #1C6943, #237E54)"
              width="w-[280px]"
              height="h-[180px]"
              mainTextColor="text-[#ffffff]"
              smallTextColor="text-[#D9D9D9]"
              arrowProps={{
                size: 36,
                bgColor: "bg-[#ffffff]",
                iconColor: "text-[#237E54]",
                hoverBgColor: "hover:bg-green-100",
                hoverIconColor: "group-hover:text-green-600",
              }}
            />

            <StatsCard
              title="Total Crimes"
              value={28}
              subText="Updated from last 30 days"
              bgColor="bg-[#ffffff]"
              width="w-[280px]"
              height="h-[180px]"
              mainTextColor="text-black"
              smallTextColor="text-[#237E54]"
              arrowProps={{
                size: 36,
                bgColor: "bg-transparent",
                iconColor: "text-black",
                hoverBgColor: "hover:bg-green-100",
                hoverIconColor: "group-hover:text-green-600",
              }}
            />

            <StatsCard
              title="Total Crimes"
              value={28}
              subText="Updated from last 30 days"
              bgColor="bg-[#ffffff]"
              width="w-[280px]"
              height="h-[180px]"
              mainTextColor="text-black"
              smallTextColor="text-[#237E54]"
              arrowProps={{
                size: 36,
                bgColor: "bg-transparent",
                iconColor: "text-black",
                hoverBgColor: "hover:bg-green-100",
                hoverIconColor: "group-hover:text-green-600",
              }}
            />

            <StatsCard
              title="Total Crimes"
              value={28}
              subText="Updated from last 30 days"
              bgColor="bg-[#ffffff]"
              width="w-[280px]"
              height="h-[180px]"
              mainTextColor="text-black"
              smallTextColor="text-[#237E54]"
              arrowProps={{
                size: 36,
                bgColor: "bg-transparent",
                iconColor: "text-black",
                hoverBgColor: "hover:bg-green-100",
                hoverIconColor: "group-hover:text-green-600",
              }}
            />
          </div>
        </div>

        {/* THE CRIME MAP AND STUFF */}
        <div
          className="ml-4 p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.5)] h-[405px]"
          style={{
            backgroundImage: `url(${MapBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-row justify-between items-start w-full">
            {/* Left Text Section */}
            <div className="flex flex-col gap-y-2 ml-2">
              <div className="font-outfit font-semibold text-3xl text-[#FFFFFF] flex items-start">
                City Crime Map
              </div>
              <div className="font-outfit font-normal text-md text-[#d3d1d1] flex items-start mb-2">
                Real-time visualization of crime activity across the city,
                updated directly from police databases.
              </div>
            </div>

            {/* Right Arrow Button Section */}
            <div className="flex items-start mt-2 mr-2">
              <ArrowButton
                size={48}
                bgColor="bg-[#ffffff]"
                iconColor="text-[#237E54]"
                hoverBgColor="hover:bg-green-100"
                hoverIconColor="group-hover:text-green-600"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
