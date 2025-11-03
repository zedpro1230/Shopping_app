import React, { useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { IconContext } from "react-icons/lib";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin, storeUserInfo } from "../features/counters/cartSlice";
import { FaUserAlt } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import axios from "axios";
import backendHost from "../config/backendHost";
function UserNavBar() {
  const isLoggedIn = useSelector((state) => state.cart.isLogin);
  const userInfo = useSelector((state) => state.cart.userInfo);
  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
  // tìm kiếm sản phẩm
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${backendHost}/products/search/${searchQuery}?page=1&limit=5`
      );
      console.log(response.data);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [searchQuery]);
  return (
    <div className=" ">
      <div
        className="bg-[#FFFFFF] shadow-md fixed z-10 top-0  left-0 right-0 gap-4 flex px-8 py-2 justify-between items-center 
      max-md:flex-col max-md:items-start max-md:px-4 max-md:py-4 "
      >
        <h1
          className="text-3xl text-[#FF6F00] font-bold font-roboto cursor-pointer max-md:text-2xl"
          onClick={() => navigate("/home")}
        >
          LUSHOP
        </h1>
        <div className="relative w-[40%] max-md:w-full">
          <input
            type="text"
            placeholder="Tiềm kiếm sản phẩm..."
            className="border-2 border-gray-300 rounded-[25px] p-3 w-full focus:outline-none focus:none focus:border-[#FF6F00]
          text-xl font-roboto  text-[#424242] max-md:text-lg"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim() !== "") {
                navigate(`/search?query=${searchQuery}`, {
                  state: {
                    query: searchQuery,
                    // results: searchResults,
                  },
                });
                setSearchResults([]);
                setSearchQuery("");
              }
            }}
          />
          {searchResults.length > 0 && (
            <div
              className="w-full bg-white rounded-lg flex flex-col justify-start  absolute top-[80px] border border-gray-300 
            left-0 right-0 h-[500px] overflow-y-scroll shadow-lg max-md:top-[60px]"
            >
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border-b border-gray-200 flex justify-start hover:bg-gray-100 cursor-pointer
                  max-md:flex-col max-md:items-start"
                  onClick={() => {
                    navigate(`/product/${result._id}`);
                    setSearchResults([]);
                    setSearchQuery("");
                  }}
                >
                  <img
                    src={result.image[0].url}
                    alt={result.title}
                    className="w-[150px] h-[150px] object-cover rounded-md mb-2 max-md:w-[100px] max-md:h-[100px]"
                  />
                  <div className="flex flex-col justify-start ml-4">
                    <h3 className="text-lg font-semibold max-md:text-[16px]">
                      {result.title}
                    </h3>
                    <div className="flex gap-2  items-center">
                      <p className="text-xl font-roboto font-semibold text-[#FF6100] max-dm:text-lg">
                        {Math.round(
                          result.price - (result.price * result.discount) / 100
                        ).toLocaleString("de-DE")}{" "}
                        đ
                      </p>
                      <p className="text-lg font-roboto font-bold line-through text-[#00000066] max-md:text-[16px]">
                        {result.price.toLocaleString("de-DE")}
                      </p>
                      <p
                        className="text-xl w-fit font-roboto font-bold bg-[#FF6100]/80 text-white rounded-[4px] px-2 py-1 ml-2 2
                      max-md:text-lg"
                      >
                        -{result.discount}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isLoggedIn ? (
          <div className="flex gap-2 items-center justify-center max-md:self-end">
            <button
              className=" rounded-lg bg-[#FF6F00] p-2 border border-[#FF6F00] text-white text-xl  font-medium font-roboto  
              transition-colors cursor-pointer max-md:text-lg"
              onClick={() => {
                navigate("/login");
              }}
            >
              Đăng Nhập
            </button>

            <button
              className="text-[#FF6F00] rounded-lg bg-white p-2 border text-xl border-[#FF6F00] font-medium font-roboto  
            transition-colors cursor-pointer max-md:text-lg"
            >
              Đăng Ký
            </button>
          </div>
        ) : (
          <div className="flex max-md:self-end">
            <div className="flex items-center gap-4 justify-center relative">
              <div
                onMouseEnter={() => handleMouseEnter()}
                onMouseLeave={() => handleMouseOut()}
              >
                <img
                  src={userInfo?.avatar}
                  alt="User Avatar"
                  referrerPolicy="no-referrer"
                  className="h-[40px] w-[40px] rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#FF6F00] transition-all duration-200"
                />
              </div>

              {toggle && (
                <div
                  className="absolute top-[50px] right-[15px] bg-white border border-gray-300 shadow-lg rounded-md
                 p-4 w-[250px] flex flex-col gap-3 z-50"
                  onMouseEnter={() => handleMouseEnter()}
                  onMouseLeave={() => handleMouseOut()}
                >
                  <div
                    className=" flex   justify-start items-center  py-3 px-4 rounded-lg w-full gap-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/user_profile")}
                  >
                    <IconContext.Provider
                      value={{ className: "fill-[#424242] " }}
                    >
                      <FaUserAlt size={20} />
                    </IconContext.Provider>
                    <p className="text-[#424242] text-[16px] font-roboto">
                      Thông tin người dùng
                    </p>
                  </div>
                  <div
                    className=" flex   justify-start items-center  py-3 px-4 rounded-lg w-full gap-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/user_orders")}
                  >
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
      </div>
    </div>
  );
}

export default UserNavBar;
