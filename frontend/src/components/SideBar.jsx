import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { TbCategoryFilled } from "react-icons/tb";
import { RiProductHuntFill } from "react-icons/ri";
import { MdPayment } from "react-icons/md";
import { IconContext } from "react-icons/lib";
import { FaArrowLeft } from "react-icons/fa";
import { useItemsContext } from "../context/Itemscontext";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
function SideBar() {
  const items = [
    {
      name: "Dashboard",
      icon: <MdDashboard />,
    },
    {
      name: "Banner",
      icon: <FaImage />,
    },
    {
      name: "Category",
      icon: <TbCategoryFilled />,
    },
    {
      name: "Products",
      icon: <RiProductHuntFill />,
    },
    {
      name: "Orders",
      icon: <MdPayment />,
    },
  ];
  const { activeItem, setActiveItem, miniSideBar, setMiniSideBar } =
    useItemsContext();
  const navigate = useNavigate();
  const handleItemClick = (item) => {
    setActiveItem(item);

    navigate(`/admin/${item.toLowerCase()}`);
  };
  return (
    <section
      className={` p-2 bg-[#FFFFFF] flex flex-col h-[100dvh] relative transition-all duration-300 ${
        miniSideBar ? "w-[120px]" : "w-[250px] "
      }`}
    >
      <div
        className={`fixed p-2 top-[80px] bg-[#FFFFFF] h-full transition-all duration-300 left-0 ${
          miniSideBar
            ? "w-[120px] flex justify-start flex-col items-center"
            : "w-[250px] "
        }`}
      >
        <button
          className={`text-[24px] font-bold w-[50px] h-[50px] rounded-[50%] bg-[#F8FAFF] border-2 border-[#B2B0E8] shadow-md
      flex justify-center items-center cursor-pointer mb-3 transition-transform duration-300 mt-[10px] ${
        miniSideBar ? "rotate-180" : ""
      }`}
          onClick={() => {
            setMiniSideBar(!miniSideBar);
          }}
        >
          <IconContext.Provider
            value={{ className: "inline-block fill-[#2A4178]" }}
          >
            <FaArrowLeft />
          </IconContext.Provider>
        </button>
        <ul className={`flex flex-col list-none p-0 gap-2 `}>
          {items.map((item, index) => (
            <li
              key={index}
              className={`p-2 hover:bg-[#F8FAFF] hover:rounded-[8px] h-[80px] 
              cursor-pointer flex items-center text-[#A7B7DD] text-[20px] font-semibold font-roboto
            gap-2 
              ${
                activeItem === item.name
                  ? "bg-[#F8FAFF] rounded-[8px] shadow-sm"
                  : ""
              }
              ${
                miniSideBar ? " justify-center p-0 w-[100px]" : "justify-start "
              }`}
              onClick={() => handleItemClick(item.name)}
            >
              <IconContext.Provider
                value={{
                  className: `text-[24px] size-[35px] ${
                    activeItem === item.name
                      ? "fill-[#2A4178]"
                      : "fill-[#A7B7DD]"
                  }`,
                }}
              >
                {item.icon}
              </IconContext.Provider>
              {!miniSideBar && (
                <span
                  className={`text-[20px] font-montserrat ${
                    activeItem === item.name ? "text-[#2A4178]" : ""
                  }`}
                >
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SideBar;
