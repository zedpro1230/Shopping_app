import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { GrView } from "react-icons/gr";
import { IconContext } from "react-icons/lib";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import backendHost from "../config/backendHost";
function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [orderDetails, setOrderDetails] = useState({
    id: "",
    item: [],
    totalAmount: 0,
    orderDate: "",
  });
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${backendHost}/orders`);
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error retrieving orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const handleModel = (order) => {
    setOrderDetails({
      id: order._id,
      item: order.items,
      totalAmount: order.totalAmount,
      orderDate: order.createdAt,
    });
    handleOpen();
  };
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${backendHost}/orders/${orderId}/status`,
        { status: newStatus }
      );
      if (response.status === 200) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  return (
    <div className="flex   mt-[85px] justify-start font-roboto ">
      <NavBar />
      <SideBar />
      <section className=" w-full flex-1 p-2">
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center font-roboto">
          <h1 className="text-2xl font-bold font-roboto text-[#424242]">
            Quản lý đơn hàng
          </h1>
          <div className="flex gap-5">
            <div className="flex items-center gap-2 text-[#424242]">
              <span className="bg-gray-200 px-5 py-1 rounded-[25px] font-semibold font-roboto">
                Trang chủ
              </span>
              <span className="font-roboto"> / </span>
              <span className="bg-gray-200 px-5 py-1 rounded-[25px] font-semibold font-roboto">
                Đơn hàng
              </span>
            </div>
          </div>
        </div>
        <div className="w-full bg-white rounded-lg  pb-4 mt-4 border border-gray-200 shadow-md overflow-x-scroll">
          {orders.length > 0 ? (
            <table className=" w-full min-w-[1200px] bg-white  rounded-[16px] shadow-xs table-fixed">
              <thead className="p-2 bg-[#FFFFF0] text-[#424242] ">
                <tr>
                  <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                    STT
                  </th>
                  <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                    Trạng thái
                  </th>
                  <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                    Tên người đặt
                  </th>
                  <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                    Email
                  </th>
                  <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                    Số điện thoại
                  </th>
                  <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                    Thành phố
                  </th>
                  <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                    Địa chỉ
                  </th>
                  <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                    Chi tiết đơn hàng
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    className={`odd:bg-[#F6F1E9] even:bg-[#F9F5F0] ${
                      index === 0 ? "first:rounded-t-[16px]" : ""
                    } ${
                      index === orders.length - 1 ? "last:rounded-b-[16px]" : ""
                    }`}
                    key={order._id}
                  >
                    <td className=" h-[100px] p-4 ">
                      <p>{index + 1}</p>
                    </td>
                    <td className=" h-[100px] p-4 ">
                      <Select
                        value={order.status}
                        onChange={(e) => {
                          handleUpdateOrderStatus(order._id, e.target.value);
                        }}
                        sx={{
                          height: "40px",
                          width: "180px",
                          fontSize: "20px",
                          fontFamily: "Roboto",
                          fontWeight: "bold",
                          backgroundColor:
                            order.status === "Đang chờ"
                              ? "#FFF8E1"
                              : order.status === "Đang xử lý"
                              ? "#FFF3E0"
                              : "#E8F5E9",
                          color: "#424242",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              order.status === "Đang chờ"
                                ? "#FFD95F"
                                : order.status === "Đang xử lý"
                                ? "#FF6F00"
                                : "#16C47F",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              order.status === "Đang chờ"
                                ? "#FFD95F"
                                : order.status === "Đang xử lý"
                                ? "#FF6F00"
                                : "#16C47F",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              order.status === "Đang chờ"
                                ? "#FFD95F"
                                : order.status === "Đang xử lý"
                                ? "#FF6F00"
                                : "#16C47F",
                            borderWidth: "2px",
                          },
                          "& .MuiSelect-select": {
                            color:
                              order.status === "Đang chờ"
                                ? "#FFD95F"
                                : order.status === "Đang xử lý"
                                ? "#FF6F00"
                                : "#16C47F",
                          },
                        }}
                      >
                        <MenuItem value="Đang chờ">Đang chờ</MenuItem>
                        <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                        <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
                      </Select>
                    </td>
                    <td className=" h-[100px] p-4 font-roboto text-[#424242] text-xl">
                      <p>{order.userName}</p>
                    </td>
                    <td className=" h-[100px] p-4 font-roboto text-[#424242] text-xl">
                      <p>{order.userId?.email}</p>
                    </td>
                    <td className=" h-[100px] p-4 font-roboto text-[#424242] text-xl">
                      <p>{order.phoneNumber}</p>
                    </td>
                    <td className=" h-[100px] p-4 font-roboto text-[#424242] text-xl">
                      <p>{order.city}</p>
                    </td>
                    <td className="  p-4 font-roboto text-[#424242] text-xl ">
                      <p className="w-[200px]  text-wrap text-ellipsis line-clamp-2">
                        {order.address}
                        hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
                      </p>
                    </td>
                    <td className=" h-[100px] p-4 font-roboto text-[#424242] text-xl ">
                      <button
                        className="cursor-pointer bg-blue-500/30 p-4 text-blue-500 rounded-lg flex items-center gap-2 font-roboto font-semibold
                         hover:bg-blue-500/50 transition-colors"
                        onClick={() => {
                          handleModel(order);
                        }}
                      >
                        Chi tiết
                        <IconContext.Provider
                          value={{ className: "size-[20px] fill-blue" }}
                        >
                          <GrView />
                        </IconContext.Provider>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-10">
              Chưa có đơn hàng nào
            </p>
          )}
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg  w-[30%] flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-roboto mb-4 text-[#424242]">
              Chi tiết đơn hàng
            </h2>

            <div className="mb-2 ">
              <h3 className="text-xl font-roboto font-bold text-[#424242]">
                Sản phẩm:
              </h3>
              <ul className="flex flex-col gap-4">
                {orderDetails.item.map((item, index) => (
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
                        Số lượng: {item.quantity}
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
            </div>
            <div className="flex items-center gap-2 justify-between w-full">
              <p className="text-lg text-[#424242] font-roboto font-bold">
                Mã đơn hàng:{" "}
              </p>
              <p className="text-lg text-[#424242] font-roboto font-medium">
                {orderDetails.id}
              </p>
            </div>
            <div className="flex items-center gap-2 justify-between ">
              <p className="font-roboto text-[#424242] text-lg font-bold ">
                Ngày đặt:{" "}
              </p>
              <p className="font-roboto text-[#424242] text-lg font-medium">
                {new Date(orderDetails.orderDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="flex items-center gap-2 justify-between ">
              <p className="font-roboto text-[#424242] text-lg font-bold ">
                Tổng tiền:{" "}
              </p>
              <p className="font-roboto text-[#FF6F00] text-xl font-medium">
                {orderDetails.totalAmount.toLocaleString("vi-VN")} đ
              </p>
            </div>

            <button
              className="bg-[#FF3333] text-white px-4 py-2 rounded-lg hover:bg-[#FF3333]/80 mt-4  font-roboto font-semibold cursor-pointer"
              onClick={handleClose}
            >
              Đóng
            </button>
          </div>
        </Modal>
      </section>
    </div>
  );
}

export default AdminOrder;
