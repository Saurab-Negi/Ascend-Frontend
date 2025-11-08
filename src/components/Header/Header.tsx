import { useEffect, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import Button from "../Button/Button";
import HeadLogo from "../../assets/icons/new.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Api from "../../services/Auth/Auth";
import type { UserInfo } from "../../types/user";
import useFetch from "../../hooks/useFetch";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "../../lib/Firebase";

function Header() {
  const [user, setUser] = useState<UserInfo>({} as UserInfo);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);

  const location = useLocation();
 const isActive =(path: string)=>{ return location.pathname === path}; 


  const isAuthenticated = localStorage.getItem("token") ? true : false;
  const queryClient = useQueryClient();

  const { data } = useFetch("user", Api.GetUser());


  useEffect(() => {
    if (data) {
      setUser(data.data.userInfo);
    }
  }, [data]);

  const LogOutUser = async () => {
    localStorage.removeItem("token");
    await auth.signOut();
    queryClient.clear();
    navigate("/");
  };

  const navigate = useNavigate();
  return (
    <div className="fixed top-0 z-50 w-full bg-white shadow-lg">
  <div className="py-[1.2rem] px-[1rem] md:px-[3rem] lg:px-[6rem] flex justify-between items-center py-5 px-4 md:px-8 sm:px-4">
    {/* Left: Logo */}
    <div className="flex  pt-1 items-center cursor-pointer" onClick={() => navigate("/")}>
      <img 
  src={HeadLogo} 
  alt="Ascend Logo" 
  className="h-[3rem] w-auto md:h-[3.5rem]" 
/>

    </div>

    {/* Center: Navigation Links */}
    {isAuthenticated &&  ( <div className="hidden md:flex space-x-6 font-medium text-sm md:text-base">
      <Link to="/soulprint" className={isActive("/soulprint") ? "text-[#004236]" : ""}>SoulPrint</Link>
      <Link to="/microshift" className={isActive("/microshift") ? "text-[#004236]" : ""}>MicroShifts</Link>
      <Link to="/souLlog" className={isActive("/souLlog") ? "text-[#004236]" : ""}>SoulLog</Link>
      <Link to="/temple" className={isActive("/temple") ? "text-[#004236]" : ""}>Temple</Link>
      <Link to="/coach" className={isActive("/coach") ? "text-[#004236]" : ""}>Insights</Link>
    </div>)}

    {/* Right: Auth/User */}
    <div>
      {!isAuthenticated ? (
        <div className="flex gap-3">
          <Button name="Login" onClick={() => navigate("/login")} />
          <Button
            className="text-[#004236] text-[0.7rem] lg:text-[1rem] border border-[#004236] py-1 px-2 sm:py-[0.4rem] sm:px-[1rem] lg:py-[0.3rem] lg:px-[0.5rem] md:py-[0.4rem] md:px-[1rem] rounded-md font-semibold"
            onClick={() => navigate("/signup")}
            name="Sign Up"
          />
        </div>
      ) : (
        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
          >
            <button className="w-10 h-10 bg-[#004236] text-white rounded-full flex items-center justify-center font-semibold text-base">
              {user?.profileImg ? 
              <img
                src={user?.profileImg}
                alt="Profile"
                className="w-full h-full object-cover  rounded-full"
              /> : user?.firstName?.charAt(0).toUpperCase() || "A"}
            
            </button>
            {isUserDropdownOpen ? (
              <HiChevronUp className="w-5 h-5 ml-1" />
            ) : (
              <HiChevronDown className="w-5 h-5 ml-1" />
            )}
          </div>

          {/* Dropdown */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-sm z-50">
              <div className="px-4 py-3">
                <span className="block text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="block text-sm text-gray-500 truncate">
                  {user.email}
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <Link
                    to="/soulprint"
                    className="flex md:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    SoulPrint
                  </Link>
                </li>
                <li>
                  <Link
                    to="/microshift"
                    className="flex md:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    MicroShifts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/souLlog"
                    className="flex md:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    SoulLog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/temple"
                    className="flex md:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Temple
                  </Link>
                </li>
                <li>
                  <Link
                    to="/coach"
                    className="flex md:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Insights
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/subscription"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Subscription Plan
                  </Link>
                </li>
                <li>
                  <a
                    onClick={() => LogOutUser()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</div>

  );
}

export default Header;
