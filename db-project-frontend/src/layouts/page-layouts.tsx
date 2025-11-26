// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import { useSelector } from "react-redux";

// const PageLayout = () => {
//   const location = useLocation();
//   const { role, roleLoaded } = useSelector((state: any) => state.currentRole);
//   const navigate = useNavigate();

//   const handleNavigation = (path: string) => {
//     console.log(path);
//     navigate(path);
//   };

//   const hideOnRoutes = ["/", "/login", "/login-admin", "/map", "/request-agent"];

//   const hideSidebar = hideOnRoutes.includes(location.pathname);

//   return (
//     <div className="flex w-full">
//         <div className="py-4 pl-4">

//       {!hideSidebar && roleLoaded && (
//         <Sidebar version={role} setPath={handleNavigation} />
//       )}
//         </div>

//       <div className="flex-1 -ml-4">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default PageLayout;

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setRole } from "../store/features/current_role"; // Adjust path to your redux slice

const PageLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { role, roleLoaded } = useSelector((state: any) => state.currentRole);
  const navigate = useNavigate();

  // Initialize role from localStorage on component mount
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole && (storedRole === "admin" || storedRole === "police" || storedRole === "user")) {
      if (!roleLoaded) {
        dispatch(setRole(storedRole));
      }
    }
  }, [dispatch, roleLoaded]);

  const handleNavigation = (path: string) => {
    console.log(path);
    navigate(path);
  };

  const hideOnRoutes = ["/", "/login", "/login-admin", "/map", "/request-agent"];

  const hideSidebar = hideOnRoutes.includes(location.pathname);

  return (
    <div className="flex w-full">
      <div className="py-4 pl-4 z-index-10">
        {!hideSidebar && roleLoaded && (
          <Sidebar version={role} setPath={handleNavigation} />
        )}
      </div>

      <div className="flex-1 -ml-4">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;