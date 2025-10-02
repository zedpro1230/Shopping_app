import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconContext } from "react-icons/lib";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { setLogin, storeUserInfo } from "../features/counters/cartSlice";
function NavBar() {
  const userInfo = useSelector((state) => state.cart.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear Redux store
    dispatch(setLogin(false));
    dispatch(storeUserInfo(null));

    // Navigate to login
    navigate("/login");
  };
  return (
    <div>
      <nav className="bg-[#FFFFFF] shadow-md fixed z-10 top-0 left-0 right-0 h-[80px] flex p-2 justify-between items-center px-8 py-2">
        <h1 className="text-3xl font-bold font-roboto text-[#FF6F00] cursor-pointer">
          LUSHOP
        </h1>
        <div>
          <div className="flex items-center gap-3">
            <img
              src={
                userInfo?.avatar ||
                "https://static.vecteezy.com/system/resources/thumbnails/011/490/381/small_2x/happy-smiling-young-man-avatar-3d-portrait-of-a-man-cartoon-character-people-illustration-isolated-on-white-background-vector.jpg"
              }
              alt="Logo"
              className="h-[50px] w-[50px] rounded-full object-cover border border-[#FF6F00]"
            />
            <div className=" flex flex-col items-start justify-center">
              <p className="text-lg font-roboto text-[#424242]">
                {userInfo?.name || "User Name"}
              </p>
              <p className="text-sm font-roboto text-[#424242]">
                {userInfo?.email || "Email"}
              </p>
            </div>
            <button className="cursor-pointer" onClick={handleLogout}>
              <IconContext.Provider
                value={{
                  className:
                    "size-[30px] fill-[#424242] hover:fill-[#FF6F00] transition-colors duration-200",
                }}
              >
                <IoMdLogOut />
              </IconContext.Provider>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
