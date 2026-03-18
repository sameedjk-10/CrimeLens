import { useState, useEffect } from "react";
import LogowithText from "../assets/LogowithText.svg";
import GreenButton from "./GreenButton";
import { ICONS } from "../assets/icons";
import MeetCreatorsCard from "./MeetCreatorsCards";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  version?: "admin" | "police" | "user";
  setPath?: (path: string) => void;
  onCloseMobile?: () => void;
  isDrawer?: boolean;
}

interface MenuItem {
  label: string;
  icon: string;
  activeIcon: string;
  route: string;
}

const Sidebar = ({ version, setPath, onCloseMobile, isDrawer }: SidebarProps) => {
  const asDrawer = isDrawer ?? !!onCloseMobile;
  const [activeItem, setActiveItem] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  // Define menu sets for each version
  const allMenus: MenuItem[] = [
    {
      label: "Dashboard",
      icon: ICONS.DashboardIcon,
      activeIcon: ICONS.DashboardIcon_Active,
      route: "/dashboard",
    },
    {
      label: "Verify Agent",
      icon: ICONS.VerifyAgentIcon,
      activeIcon: ICONS.VerifyAgentIcon_Active,
      route: "/verification?type=admin",
    },
    {
      label: "Agent Records",
      icon: ICONS.AgentRecordsIcon,
      activeIcon: ICONS.AgentRecordsIcon_Active,
      route: "/all-records?type=admin",
    },
    {
      label: "Verify Report",
      icon: ICONS.VerifyReportIcon,
      activeIcon: ICONS.VerifyReportIcon_Active,
      route: "/verification?type=police",
    },
    {
      label: "Crime Records",
      icon: ICONS.CrimeRecordsIcon,
      activeIcon: ICONS.CrimeRecordsIcon_Active,
      route: "/all-records?type=police",
    },
    {
      label: "Report Crime",
      icon: ICONS.ReportCrimeIcon,
      activeIcon: ICONS.ReportCrimeIcon_Active,
      route: "/report-crime",
    },
    {
      label: "Upload Data",
      icon: ICONS.UploadDataIcon,
      activeIcon: ICONS.UploadDataIcon_Active,
      route: "/upload-crimes",
    },
    {
      label: "Give Feedback",
      icon: ICONS.GiveFeedbackIcon,
      activeIcon: ICONS.GiveFeedbackIcon_Active,
      route: "/feedback",
    },
  ];

  // Filter based on version
  let filteredMenus: MenuItem[] = allMenus;

  if (version === "admin")
    filteredMenus = allMenus.filter((m) =>
      ["Dashboard", "Verify Agent", "Agent Records", "Upload Data"].includes(
        m.label
      )
    );
  else if (version === "police")
    filteredMenus = allMenus.filter((m) =>
      [
        "Dashboard",
        "Verify Report",
        "Crime Records",
        "Upload Data",
      ].includes(m.label)
    );
  else if (version === "user")
    filteredMenus = allMenus.filter((m) =>
      ["Dashboard", "Report Crime"].includes(m.label)
    );

  // Sync activeItem with current location
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const currentMenuItem = allMenus.find(
      (menu) => menu.route === currentPath
    );
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.label);
    }
  }, [location.pathname, location.search]);

  const buttonText =
    version === "admin" || version === "police" ? "Logout" : "Back to Home";

  return (
    <div
      className={`
        flex flex-col overflow-hidden bg-[#fefefe] shadow-[0_0_5px_rgba(0,0,0,0.15)]
        ${asDrawer
          ? "h-full w-[min(320px,85vw)] max-w-full rounded-none"
          : "h-full max-h-screen w-68 min-w-[17rem] rounded-2xl py-4 px-4 static"
        }
      `}
    >
      {/* Close (X) at top right — only in drawer mode */}
      {asDrawer && onCloseMobile && (
        <div className="flex-none flex justify-end pr-3 pt-3 pb-1">
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Top Section — logo + MENU + nav (no scroll) */}
      <div className={`flex flex-col min-h-0 flex-1 ${asDrawer ? "px-4 pb-2" : ""}`}>
        {/* Logo — no extra right padding when drawer (X is in its own row) */}
        <div className={`flex items-center gap-2 shrink-0 ${asDrawer ? "px-0" : "px-2"}`}>
          <img src={LogowithText} alt="CrimeLens Logo" className={`w-auto shrink-0 ${asDrawer ? "h-8" : "h-8 lg:h-10"}`} />
        </div>

        <p className={`text-xs text-gray-400 font-outfit font-medium shrink-0 ${asDrawer ? "mt-3 mb-2 px-0" : "mb-4 px-2 mt-4"}`}>
          MENU
        </p>

        {/* Menu Items — flex shrink, never scroll */}
        <nav className={`flex flex-col min-h-0 shrink ${asDrawer ? "gap-1.5" : "gap-3"}`}>
          {filteredMenus.map((item) => (
            <button
              key={item.label}
              onClick={() => setPath?.(item.route)}
              className={`flex items-center gap-3 px-3 rounded-xl text-sm transition-all duration-200 cursor-pointer shrink-0 ${
                asDrawer ? "py-1.5" : "py-2"
              } ${
                activeItem === item.label
                  ? "bg-green-50 text-black font-medium"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <img
                src={activeItem === item.label ? item.activeIcon : item.icon}
                alt=""
                className="w-5 h-5 shrink-0"
              />
              <span className="truncate">{item.label}</span>
              {activeItem === item.label && (
                <div className="ml-auto h-5 w-1 bg-[#237E54] rounded-full shrink-0" />
              )}
            </button>
          ))}
        </nav>

        {/* Separator + Button + MeetCreators — always visible, no scroll */}
        <hr className={`border-t-2 border-[#d9d9d9] shrink-0 ${asDrawer ? "mx-0 mt-4 mb-3" : "mx-2 mt-6 mb-6"}`} />

        <div className="flex justify-center shrink-0">
          <GreenButton
            label={buttonText}
            width={220}
            onClick={() => {
              if (buttonText === "Logout") {
                localStorage.removeItem("token");
                navigate("/");
              } else {
                navigate("/");
              }
            }}
          />
        </div>
      </div>

      {/* Bottom — MeetCreatorsCard */}
      <div className="mt-auto shrink-0 pb-4">
        <MeetCreatorsCard />
      </div>
    </div>
  );
};

export default Sidebar;
