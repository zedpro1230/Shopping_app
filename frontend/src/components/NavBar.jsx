import React from "react";
import { useSelector } from "react-redux";
function NavBar() {
  const userInfo = useSelector((state) => state.cart.userInfo);
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
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
