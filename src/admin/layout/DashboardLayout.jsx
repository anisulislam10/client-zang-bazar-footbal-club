import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdDashboard, MdEmail, MdExpandMore, MdExpandLess } from "react-icons/md";
import { FaUserPlus, FaUsers, FaNewspaper, FaServer } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isHomepageOpen, setIsHomepageOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); 
    navigate("/admin"); 
  };
  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5 flex flex-col fixed top-0 left-0 bottom-0 overflow-y-auto mt-20">
        <div>
          <h2 className="text-lg font-bold underline-offse shadow-5xl">Admin <span className="bg-blue-500 rounded-md">db</span>Pannel</h2>
          <nav className="mt-5 space-y-2">
            <div>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <IoMdInformationCircle /> Dashboard
            </NavLink>

              
              <button
                onClick={() => setIsHomepageOpen(!isHomepageOpen)}
                className="flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-700 w-full"
              >
                <span className="flex items-center gap-2">
                  <MdDashboard /> Homepage
                </span>
                {isHomepageOpen ? <MdExpandLess /> : <MdExpandMore />}
              </button>
              
              {isHomepageOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  <NavLink
                    to="/dashboard/homepage/slider"
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-2 rounded text-sm ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                    }
                  >
                    Slider
                  </NavLink>
                  <NavLink
                    to="/dashboard/homepage/next-match"
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-2 rounded text-sm ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                    }
                  >
                    Next Match
                  </NavLink>
                  <NavLink
                    to="/dashboard/homepage/last-match"
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-2 rounded text-sm ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                    }
                  >
                    Last Match
                  </NavLink>

                  <NavLink
                    to="/dashboard/homepage/honors"
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-2 rounded text-sm ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                    }
                  >
                    Achievements
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/dashboard/add-player"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <FaUserPlus /> Add Player
            </NavLink>
            <NavLink
              to="/dashboard/add-member"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <FaUsers /> Add Member
            </NavLink>
            <NavLink
              to="/dashboard/blogs"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <FaNewspaper /> Blogs
            </NavLink>
            <NavLink
              to="/dashboard/about"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <IoMdInformationCircle /> About
            </NavLink>




            <NavLink
              to="/dashboard/contact"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <FaNewspaper /> Contact
            </NavLink>



            <NavLink
              to="/dashboard/gallery"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <FaNewspaper /> Gallery
            </NavLink>


            <NavLink
              to="/dashboard/received-emails"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <MdEmail /> Received Emails
            </NavLink>
            {/* <NavLink
              to="/dashboard/smtp-setup"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <FaServer /> SMTP Setup
            </NavLink> */}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-5 flex items-center gap-2 p-2 bg-red-600 hover:bg-red-700 rounded text-white w-full"
        >
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="flex-1 p-5 ml-64 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;