import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { IconContext } from "react-icons/lib";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin, storeUserInfo } from "../features/counters/cartSlice";
import { FaUserAlt } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
function UserNavBar() {
  const isLoggedIn = useSelector((state) => state.cart.isLogin);
  const userInfo = useSelector((state) => state.cart.userInfo);
  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const timeOutRef = useRef(null);
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
  const handleMouseEnter = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
      timeOutRef.current = null;
    }
    setToggle(true);
  };
  const handleMouseOut = () => {
    timeOutRef.current = setTimeout(() => {
      setToggle(false);
    }, 200);
  };
  return (
    <div>
      <nav className="bg-[#FFFFFF] shadow-md fixed z-10 top-0 left-0 right-0 h-[80px] flex px-8 py-2 justify-between items-center">
        <h1
          className="text-3xl text-[#FF6F00] font-bold font-roboto cursor-pointer"
          onClick={() => navigate("/home")}
        >
          LUSHOP
        </h1>
        <input
          type="text"
          placeholder="Tiềm kiếm sản phẩm..."
          className="border-2 border-gray-300 rounded-[25px] p-3 w-[30%] focus:outline-none focus:none focus:border-[#FF6F00]
          text-xl font-roboto  text-[#424242]"
        />

        {!isLoggedIn ? (
          <div className="flex gap-2 items-center justify-center">
            <button
              className=" rounded-lg bg-[#FF6F00] p-2 border border-[#FF6F00] text-white text-xl font-medium font-roboto  transition-colors cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              Đăng Nhập
            </button>

            <button className="text-[#FF6F00] rounded-lg bg-white p-2 border text-xl border-[#FF6F00] font-medium font-roboto  transition-colors cursor-pointer">
              Đăng Ký
            </button>
          </div>
        ) : (
          <div className="flex">
            <div
              className="flex items-center gap-4 justify-center relative group"
              onMouseEnter={() => handleMouseEnter()}
              onMouseLeave={() => handleMouseOut()}
            >
              <img
                src={userInfo?.avatar}
                alt="User Avatar"
                referrerPolicy="no-referrer"
                className="h-[40px] w-[40px] rounded-full object-cover"
              />
              {toggle && (
                <div
                  className="absolute top-[50px] right-[150px] bg-white border border-gray-300 shadow-lg rounded-md
                 p-4 w-[250px] flex flex-col gap-3 "
                >
                  <div className=" flex   justify-start items-center  p-2 rounded-lg w-full gap-2 hover:bg-gray-100 cursor-pointer">
                    <IconContext.Provider
                      value={{ className: "fill-[#424242] " }}
                    >
                      <FaUserAlt size={20} />
                    </IconContext.Provider>
                    <p className="text-[#424242] text-[16px] font-roboto">
                      Thông tin người dùng
                    </p>
                  </div>
                  <div className=" flex   justify-start items-center  p-2 rounded-lg w-full gap-2 hover:bg-gray-100 cursor-pointer">
                    <IconContext.Provider
                      value={{ className: "fill-[#424242]  " }}
                    >
                      <CiViewList size={25} />
                    </IconContext.Provider>
                    <p className="text-[#424242] text-[16px] font-roboto">
                      Lịch sử đơn hàng
                    </p>
                  </div>
                </div>
              )}
              <div className=" flex  items-start justify-center">
                <p className="font-roboto text-xl text-[#424242]">
                  {userInfo.name || "User"}
                </p>
              </div>
              <button
                className=" relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <IconContext.Provider
                  value={{
                    className:
                      "size-[30px] fill-[#333333] hover:fill-[#FF6F00] transition-colors duration-200",
                  }}
                >
                  <FaShoppingCart />
                </IconContext.Provider>
                <span
                  className="absolute top-[-10px] p-1 border-1 border-[#424242] right-[-10px] bg-red-500 text-white 
              font-medium font-roboto text-[12px] w-[25px] h-[25px] rounded-full flex items-center justify-center "
                >
                  {cartQuantity}
                </span>
              </button>
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
        )}
      </nav>
    </div>
  );
}

export default UserNavBar;
