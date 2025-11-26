import StatsCard from "../../../components/StatsCards";
import MapBackground from "../../../assets/MapBackground.png";
import GreenButton from "../../../components/GreenButton";
import ArrowButton from "../../../components/ArrowButton";
import { useNavigate } from "react-router-dom";
import MapEmbed from "../../../components/MapEmbed";

const Dashboard = () => {
  const navigate = useNavigate();

  const NavigateStatistics = () => {
    navigate("/statistics");
  };

  const NavigateMap = () => {
    navigate("/map");
  };

  return (
    <section className="flex flex-row h-screen w-full">
      {/* MAIN CONTENT */}
      <div className="flex flex-col gap-y-4 pl-76 p-4 w-full overflow-y-auto">
        {/* STATS SECTION */}
        <div className="bg-[#fefefe] p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col gap-y-4">
          <div className="flex flex-row justify-between items-start w-full">
            <div className="flex flex-col gap-y-1 ml-2">
              <div className="font-outfit font-semibold text-4xl text-black">
                Dashboard
              </div>
              <div className="font-outfit text-md text-[#A0A0A0]">
                Monitor live updates on crime density, red zones, and incident
                patterns across the city.
              </div>
            </div>

            <div className="flex items-start mt-2">
              <GreenButton
                label="View all Statistics"
                width={260}
                height={50}
                onClick={NavigateStatistics}
              />
            </div>
          </div>

          {/* STATS CARDS ROW */}
          <div className="flex gap-x-4 ml-2">
            <StatsCard
              title="Total Crimes"
              value={28}
              subText="Updated from last 30 days"
              bgColor="bg-[#ffffff]"
              gradientBg="linear-gradient(to bottom, #145332, #1C6943, #237E54)"
              width="w-[280px]"
              height="h-[170px]"
              mainTextColor="text-[#ffffff]"
              smallTextColor="text-[#D9D9D9]"
              LiveButton={1}
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
              height="h-[170px]"
              mainTextColor="text-black"
              smallTextColor="text-[#237E54]"
              LiveButton={1}
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
              height="h-[170px]"
              mainTextColor="text-black"
              smallTextColor="text-[#237E54]"
              LiveButton={1}
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
              height="h-[170px]"
              mainTextColor="text-black"
              smallTextColor="text-[#237E54]"
              LiveButton={1}
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

        {/* CRIME MAP SECTION */}
        <div
          className="p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.5)] h-110 relative"
          style={{
            backgroundImage: `url(${MapBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-row justify-between items-start w-full mb-4">
            {/* Text */}
            <div className="flex flex-col gap-y-1 ml-2">
              <div className="font-outfit font-semibold text-3xl text-white">
                City Crime Map
              </div>
              <div className="font-outfit text-md text-[#efecec]">
                Real-time visualization of crime activity across the city,
                updated directly from police databases.
              </div>
            </div>

            {/* Arrow Button */}
            <div className="flex items-start mt-2 mr-2">
              <ArrowButton
                size={48}
                bgColor="bg-white"
                iconColor="text-[#237E54]"
                hoverBgColor="hover:bg-green-100"
                hoverIconColor="group-hover:text-green-600"
                onClick={NavigateMap}
              />
            </div>
          </div>

          <div className="w-full h-[calc(100%-85px)] rounded-2xl overflow-hidden">
            <MapEmbed />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Dashboard;
