import {
  FaHome,
  FaTasks,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

function Sidebar() {

  const navigate =
    useNavigate();

  const linkStyle =
    "w-full flex items-center gap-4 p-4 rounded-2xl font-medium transition-all";

  // LOGOUT
  const handleLogout = () => {

    // CLEAR STORAGE
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    // REDIRECT
    navigate("/login");

    // FORCE REFRESH
    window.location.reload();

  };

  return (
    <div className="w-72 min-h-screen bg-[#020617] border-r border-white/10 p-6 flex flex-col justify-between">

      <div>

        {/* LOGO */}
        <div className="flex items-center gap-4 mb-14">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-2xl font-bold">

            F

          </div>

          <div>

            <h1 className="text-3xl font-bold text-white">

              FlowSync

            </h1>

            <p className="text-gray-400 text-sm">

              Team Workspace

            </p>

          </div>

        </div>

        {/* NAV LINKS */}
        <div className="space-y-3">

          {/* DASHBOARD */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-white/5 text-gray-300"
              }`
            }
          >

            <FaHome />

            Dashboard

          </NavLink>

          {/* TASKS */}
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-white/5 text-gray-300"
              }`
            }
          >

            <FaTasks />

            Tasks

          </NavLink>

          {/* TEAMS */}
          <div className="relative">

            <NavLink
              to="/teams"
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/5 text-gray-300"
                }`
              }
            >

              <FaUsers />

              Teams

            </NavLink>

            {/* GLOBAL NOTIFICATION DOT */}
            {localStorage.getItem(
              "global_team_notification"
            ) && (

              <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />

            )}

          </div>

        </div>

      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 hover:bg-red-500/10 transition-all text-red-400 p-4 rounded-2xl font-medium"
      >

        <FaSignOutAlt />

        Logout

      </button>

    </div>
  );
}

export default Sidebar;