import { useState, useEffect } from "react";
import LogowithText from "../assets/LogowithText.svg";
import GreenButton from "./GreenButton";
import { ICONS } from "../assets/icons";
import MeetCreatorsCard from "./MeetCreatorsCards";

interface SidebarProps {
  version?: "admin" | "police" | "user";
  onNavigate?: (route: string) => void;
}

interface MenuItem {
  label: string;
  icon: string;
  activeIcon: string;
  route: string;
}

const Sidebar = ({ version, onNavigate }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState<string>("Dashboard");

  // Reset active item to Dashboard when version changes
  useEffect(() => {
    setActiveItem("Dashboard");
  }, [version]);

  // Define menu sets for each version
  const allMenus: MenuItem[] = [
    { label: "Dashboard", icon: ICONS.DashboardIcon, activeIcon: ICONS.DashboardIcon_Active, route: "/dashboard" },
    { label: "Verify Agent", icon: ICONS.VerifyAgentIcon, activeIcon: ICONS.VerifyAgentIcon_Active, route: "/verify-agent" },
    { label: "Agent Records", icon: ICONS.AgentRecordsIcon, activeIcon: ICONS.AgentRecordsIcon_Active, route: "/agent-records" },
    { label: "Verify Report", icon: ICONS.VerifyReportIcon, activeIcon: ICONS.VerifyReportIcon_Active, route: "/verify-report" },
    { label: "Crime Records", icon: ICONS.CrimeRecordsIcon, activeIcon: ICONS.CrimeRecordsIcon_Active, route: "/crime-records" },
    { label: "Report Crime", icon: ICONS.ReportCrimeIcon, activeIcon: ICONS.ReportCrimeIcon_Active, route: "/report-crime" },
    { label: "Give Feedback", icon: ICONS.GiveFeedbackIcon, activeIcon: ICONS.GiveFeedbackIcon_Active, route: "/feedback" },
  ];

  // Filter based on version
  let filteredMenus: MenuItem[] = allMenus;

  if (version === "admin")
    filteredMenus = allMenus.filter((m) =>
      ["Dashboard", "Verify Agent", "Agent Records"].includes(m.label)
    );
  else if (version === "police")
    filteredMenus = allMenus.filter((m) =>
      ["Dashboard", "Verify Report", "Crime Records", "Give Feedback"].includes(m.label)
    );
  else if (version === "user")
    filteredMenus = allMenus.filter((m) =>
      ["Dashboard", "Report Crime", "Give Feedback"].includes(m.label)
    );

  const buttonText =
    version === "admin" || version === "police" ? "Logout" : "Back to Home";

  return (
    <div className="flex flex-col justify-between h-180 w-68 bg-[#fefefe] rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] py-6 px-4">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <img src={LogowithText} alt="CrimeLens Logo" className="h-10" />
        </div>

        <p className="text-xs text-gray-400 mb-4 px-2 font-outfit font-medium">MENU</p>

        {/* Menu Items */}
        <nav className="flex flex-col gap-3">
          {filteredMenus.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveItem(item.label);
                onNavigate?.(item.route);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                activeItem === item.label
                  ? "bg-green-50 text-black font-medium"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <img
                src={activeItem === item.label ? item.activeIcon : item.icon}
                alt={item.label}
                className="w-5 h-5"
              />
              {item.label}
              {activeItem === item.label && (
                <div className="ml-auto h-5 w-1 bg-[#237E54] rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Separator Line */}
        <hr className="border-t-2 border-[#d9d9d9] mx-2 mt-6 mb-6" />

        {/* Green Button */}
        <div className="flex justify-center">
          <GreenButton label={buttonText} width={220} />
        </div>

        <div className="mt-34">
          <MeetCreatorsCard />
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
