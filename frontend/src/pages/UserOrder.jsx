import React from "react";
import UserNavBar from "../components/UserNavBar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";
import backendHost from "../config/backendHost";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
function UserOrder() {
  const userId = useSelector((state) => state.cart.userInfo.id);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendHost}/orders/${userId}`);
        setOrders(response.data.data);
      } catch (error) {
        toast.error("Lỗi khi tải đơn hàng của bạn");
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className=" bg-[#f4f2ee]  flex flex-col gap-10 min-h-screen">
      <UserNavBar />
      <ToastContainer />
      <div className="mt-[100px]  font-semibold w-[85%] mx-auto bg-white p-10 rounded-lg shadow-md max-md:w-[95%] max-md:p-2">
        <h1 className="text-2xl mb-[20px]">Đơn hàng </h1>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-4">
          {orders.length === 0 ? (
            <p className="text-xl mt-4">Bạn chưa có đơn hàng nào.</p>
          ) : (
            orders.map((order) => (
              <li
                key={order._id}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 border border-gray-200"
              >
                <div className="flex items-center gap-2 justify-between w-full max-md:flex-col max-md:items-start">
                  <p className="text-lg text-[#424242] font-roboto font-bold">
                    Mã đơn hàng:{" "}
                  </p>
                  <p className="text-lg text-[#424242] font-roboto font-medium">
                    {order._id}
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-between ">
                  <p className="font-roboto text-[#424242] text-xl font-bold ">
                    📅
                  </p>
                  <p className="font-roboto text-[#424242] text-lg font-medium">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-between ">
                  <p className="font-roboto text-[#424242] text-lg font-bold ">
                    👤
                  </p>
                  <p className="font-roboto text-[#424242] text-lg font-medium">
                    {order.userName}
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-between ">
                  <p className="font-roboto text-[#424242] text-lg font-bold ">
                    ☎️
                  </p>
                  <p className="font-roboto text-[#424242] text-lg font-medium">
                    {order.phoneNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2 ">
                  <p className="font-roboto text-[#424242] text-lg font-bold ">
                    Ghi chú:{" "}
                  </p>
                  <p className="font-roboto text-[#424242] text-lg font-medium">
                    {order.note}
                  </p>
                </div>
                <div className="flex items-center gap-2 ">
                  <p className="font-roboto text-[#424242] text-lg font-bold ">
                    Trạng thái đơn:{" "}
                  </p>
                  <p
                    className={`font-roboto  text-lg font-medium p-2 rounded-lg
                  text-center
                  ${
                    order.status === "Đang chờ"
                      ? "bg-[#ffeb99] text-[#b8860b] border border-[#b8860b]"
                      : ""
                  }
                  ${
                    order.status === "Đang xử lý"
                      ? "bg-[#FFF3E0] text-[#FFB74D] border border-[#FFB74D]"
                      : ""
                  }
                  ${
                    order.status === "Đã hoàn thành"
                      ? "bg-[#E8F5E9] text-[#66BB6A] border border-[#66BB6A]"
                      : ""
                  }
                  
                  `}
                  >
                    {order.status}
                  </p>
                </div>

                <div className="flex  flex-col gap-2 ">
                  <p className="font-roboto text-[#424242] text-lg font-bold ">
                    Địa chỉ:{" "}
                  </p>
                  <p className="font-roboto text-[#424242] text-lg font-medium">
                    {order.address}
                  </p>
                </div>
                <ul className="flex flex-col gap-2 overflow-y-scroll max-h-[150px] bg-amber-50 p-4 rounded-lg border border-amber-200">
                  {order.items.map((item) => (
                    <li
                      key={item._id}
                      className="font-roboto text-[#424242] flex gap-5 "
                    >
                      <img
                        src={item.image[0].url}
                        alt={item.title}
                        className="w-[100px] h-[100px] object-cover rounded-lg"
                      />
                      <div className="flex flex-col gap-2">
                        <p className="font-roboto text-[#424242] text-lg">
                          {item.title}
                        </p>
                        <p className="font-roboto text-[#424242] text-lg">
                          x {item.quantity}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-roboto text-[#FF6F00] text-lg">
                            {(
                              item.price -
                              (item.price * item.discount) / 100
                            ).toLocaleString("vi-VN")}{" "}
                            đ
                          </p>
                          <p className="font-roboto text-white bg-[#FF6F00]/70 px-2 py-1 rounded-lg text-lg w-fit">
                            -{item.discount ? `${item.discount}%` : "Không có"}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 justify-between ">
                  <p className="font-roboto text-[#424242] text-lg font-bold ">
                    Tổng tiền:{" "}
                  </p>
                  <p className="font-roboto text-[#FF6F00] text-2xl font-bold">
                    {order.totalAmount.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <Footer className="place-content-end" />
    </div>
  );
}

export default UserOrder;
