import { FaRegUserCircle } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineDollar } from "react-icons/ai";
import { FaListUl } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import axios from "axios";
import { useState, useEffect, useMemo, useRef } from "react";
import backendHost from "../config/backendHost";
import { Bar } from "react-chartjs-2";
import "../index.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function KpiCard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState(0);
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const mothlyData = [
    { month: "T1", sales: 0 },
    { month: "T2", sales: 0 },
    { month: "T3", sales: 0 },
    { month: "T4", sales: 0 },
    { month: "T5", sales: 0 },
    { month: "T6", sales: 0 },
    { month: "T7", sales: 0 },
    { month: "T8", sales: 0 },
    { month: "T9", sales: 0 },
    { month: "T10", sales: 0 },
    { month: "T11", sales: 0 },
    { month: "T12", sales: 0 },
  ];
  const monthlySales = useMemo(() => {
    if (!orders.data || orders.data.length === 0) {
      return Array(12).fill(0);
    }
    const currentYear = new Date().getFullYear();
    const salesByMonth = Array(12).fill(0);
    orders.data.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getFullYear() === currentYear) {
        const monthIndex = orderDate.getMonth(); // 0-11
        salesByMonth[monthIndex] += order.totalAmount;
      }
    });
    return salesByMonth;
  }, [orders, mothlyData]);
  const data = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Sales 2025 (VND)",
        data: monthlySales,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderRadius: 8,
      },
    ],
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          axios.get(`${backendHost}/products`),
          axios.get(`${backendHost}/users`),
          axios.get(`${backendHost}/orders`),
        ]);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllData();
  }, []);
  useEffect(() => {
    if (orders.data) {
      const totalSale = orders.data.reduce(
        (acc, order) => acc + order.totalAmount,
        0
      );
      setSales(totalSale);
    }
  }, [orders]);

  const kpiData = useMemo(() => {
    return [
      {
        name: "TotalUsers",
        number: users?.users?.length || 0,
        color1: "#6BAAFC",
        color2: "#305FEC",
        icon: <FaRegUserCircle />,
      },
      {
        name: "TotalProducts",
        number: products?.data?.totalProducts || 0,
        color1: "#EF5E7A",
        color2: "#D35385",
        icon: <FiShoppingCart />,
      },

      {
        name: "TotalOrders",
        number: orders?.data?.length || 0,
        color1: "#A530F2",
        color2: "#EF5E7A",
        icon: <FaListUl />,
      },
      {
        name: "TotalSales",
        number: sales || 0,
        color1: "#D623FE",
        color2: "#A530F2",
        icon: <AiOutlineDollar />,
      },
    ];
  }, [products, users, orders, sales]);

  return (
    <div className="flex flex-col w-full ">
      <div className="flex gap-2 justify-start items-start flex-wrap ">
        {products.data &&
          users.users &&
          orders.data &&
          kpiData.map((kpi, i) => (
            <div
              key={kpi.name}
              style={{
                background: `linear-gradient(45deg, ${kpi.color1},${kpi.color2})`,
              }}
              className={`relative flex flex-col justify-between rounded-2xl p-4 min-w-[280px] h-[120px] text-white shadow-lg transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-xl ${
                i === 3 ? "w-[800px] " : "flex-1"
              } `}
            >
              <div className=" flex justify-between items-start ">
                <h3 className="text-xl font-semibold  font-roboto">
                  {kpi.name}
                </h3>
                <p className="text-4xl font-bold mt-2 place-content-end leading-[80px] ">
                  {i !== 3
                    ? kpi.number
                    : kpi.number.toLocaleString("en-vn") + "Đ"}
                </p>
              </div>
              <IconContext.Provider
                value={{
                  className:
                    "text-[36px] opacity-30 text-white absolute bottom-2 left-2  rotate-[-45deg]",
                }}
              >
                {kpi.icon}
              </IconContext.Provider>
            </div>
          ))}
      </div>
      <div className="w-full mt-8 bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-gray-700 font-semibold text-lg mb-4">
          Monthly Sales 2025
        </h2>
        <div className="relative w-full ">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  labels: { color: "#6B7280" }, // gray-500
                },
              },
              scales: {
                x: {
                  grid: { color: "rgba(0,0,0,0.05)" },
                  ticks: { color: "#6B7280" },
                },
                y: {
                  grid: { color: "rgba(0,0,0,0.05)" },
                  ticks: { color: "#6B7280" },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default KpiCard;
