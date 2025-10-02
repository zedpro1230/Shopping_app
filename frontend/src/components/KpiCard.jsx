import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineDollar } from "react-icons/ai";
import { FaListUl } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
function KpiCard() {
  const kpiData = [
    {
      name: "TotalUsers",
      number: 1000,
      color1: "#6BAAFC",
      color2: "#305FEC",
      icon: <FaRegUserCircle />,
    },
    {
      name: "TotalProducts",
      number: 500,
      color1: "#EF5E7A",
      color2: "#D35385",
      icon: <FiShoppingCart />,
    },
    {
      name: "TotalSales",
      number: 1500,
      color1: "#D623FE",
      color2: "#A530F2",
      icon: <AiOutlineDollar />,
    },
    {
      name: "TotalOrders",
      number: 2000,
      color1: "#A530F2",
      color2: "#EF5E7A",
      icon: <FaListUl />,
    },
  ];
  return (
    <div className="flex gap-2 justify-center items-center  flex-wrap">
      {kpiData.map((kpi) => (
        <div
          key={kpi.name}
          style={{
            background: `linear-gradient(45deg, ${kpi.color1},${kpi.color2})`,
          }}
          className={`flex flex-col border-1 relative border-gray-300 p-4 rounded-[16px] min-w-[300px] flex-1 h-[150px] shadow-md  items-center
           text-white `}
        >
          <div className="flex  w-full justify-between h-full">
            <h3 className="text-[24px]  font-bold">{kpi.name}</h3>
            <p className="text-[80px] font-bold place-content-end leading-[80px]">
              {kpi.number}
            </p>
          </div>
          <IconContext.Provider
            value={{
              className:
                "text-[50px] size-[60px] text-white absolute bottom-2 left-2 opacity-50 rotate-[-45deg]",
            }}
          >
            {kpi.icon}
          </IconContext.Provider>
        </div>
      ))}
    </div>
  );
}

export default KpiCard;
