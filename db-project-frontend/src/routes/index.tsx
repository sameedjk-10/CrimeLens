import { Upload } from "lucide-react";
import AddPolicePage from "pages/AddPolicePage";
import AllRecordsPage from "pages/AllRecordsPage";
import DashboardPage from "pages/DashboardPage";
import HomePage from "pages/HomePage";
import LoginAdminPage from "pages/LoginAdminPage";
import LoginPage from "pages/LoginPage";
import LoginPolicePage from "pages/LoginPolicePage";
import Statistics from "pages/StatisticsPage/component/Statistics";
import VerificationPage from "pages/VerificationPage";
import MapViewPage from "pages/MapViewPage";
import { stringify } from "querystring";
import MeetCreatorsCard from "components/MeetCreatorsCards";

type TRoute = {
  path: string;
  element: React.ReactNode;
};

export const PublicRoutes = () => {
  const routes: TRoute[] = [
    {
      path: "/",
      element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/login-admin",
        element: <LoginAdminPage/>
    },
    {
        path: "/login-police",
        element: <LoginPolicePage/>
    },
    {
        path: "/request-agent",
        element: <AddPolicePage/>
    },
    {
        path: "/dashboard",
        element: <DashboardPage/>
    },
    {
        path: "/statistics",
        element: <Statistics/>
    },
    {
        path: "/mapview",
        element: <MapViewPage/>
    },
    {
        path: "/meet-developers",
        element: <MeetCreatorsCard/>
    },

  ];

  return routes;
};

export const ProtectedRoutes = () => {
    const routes: TRoute[] = [
      {
        path: "/AllRecords",
        element: <AllRecordsPage/>,
      },
      {
          path: "/Verification",
          element: <VerificationPage/>
      },
      {
        path: "/Upload",
        element: <Upload/>
      }
  
    ];
  
    return routes;
  };
