import { useSelector, useDispatch } from "react-redux";
import UserNavBar from "../components/UserNavBar";
import { useForm } from "react-hook-form";
import { Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  storeItem,
  totalQuantity,
  totalAmount,
} from "../features/counters/cartSlice";
import { useNavigate } from "react-router-dom";
import backendHost from "../config/backendHost";
import axios from "axios";
function OrderForm() {
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: { city: "" },
  });
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const userInfo = useSelector((state) => state.cart.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const orderDetails = {
      ...data,
      cartItems,
      totalAmount: cartTotalAmount,
      userId: userInfo?._id || userInfo?.id,
    };

    try {
      const response = await axios.post(`${backendHost}/orders`, orderDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 900,
        });
        // Clear cart after successful order
        dispatch(storeItem([]));
        dispatch(totalAmount(0));
        dispatch(totalQuantity(0));
        reset({
          userName: "",
          phoneNumber: "",
          city: "",
          address: "",
          note: "",
        });
        // Redirect to home or order confirmation page after a short delay
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error;
      toast.error(errorMessage, {
        position: "top-right",
      });
    }
  };
  const [city, setCity] = useState([]);
  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(
          "https://open.oapi.vn/location/provinces?page=0&size=63&query="
        );
        setCity(response.data.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCity();
  }, []);

  return (
    <div className="min-h-screen mt-[80px] bg-[#f4f2ee] flex flex-col p-8">
      <UserNavBar />
      <ToastContainer />
      <div className="w-[60%] mx-auto bg-white p-8 rounded-lg shadow-md text-[#424242]">
        <h1 className="text-3xl font-bold mb-5 max-md:text-2xl">
          Điền thông tin đặt hàng
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-2 h-full "
        >
          <div className="flex flex-row gap-3 max-lg:flex-col">
            <label className="flex flex-col flex-1 font-roboto text-[#2A4178]">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-[#424242] max-md:text-lg">
                  Tên người đặt
                </span>
                <span className="text-xl text-red-500">*</span>
              </div>
              <input
                type="text"
                className="border cursor-pointer border-gray-300 p-2 h-[50px] text-lg rounded-lg w-full mb-4 text-[#424242] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                {...register("userName", {
                  required: "Yêu cầu nhập tên người dùng",
                  maxLength: {
                    value: 50,
                    message: "Tên người dùng giới hạn trong 50 ký tự",
                  },
                })}
              />
              {errors.userName && (
                <span className="text-red-500">{errors.userName.message}</span>
              )}
            </label>
            <label className="flex flex-col flex-1 font-roboto text-[#424242]">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-[#424242] max-md:text-lg">
                  Số điện thoại
                </span>
                <span className="text-xl text-red-500">*</span>
              </div>
              <input
                type="text"
                className="border cursor-pointer border-gray-300 p-2 h-[50px] text-lg rounded-lg w-full mb-4 text-[#424242] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                {...register("phoneNumber", {
                  required: "Yêu cầu nhập số điện thoại",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Vui lòng nhập số điện thoại hợp lệ",
                  },
                })}
              />
              {errors.phoneNumber && (
                <span className="text-red-500">
                  {errors.phoneNumber.message}
                </span>
              )}
            </label>
          </div>
          <div className="flex gap-3 max-lg:flex-col-reverse">
            <label className="flex flex-col flex-1/4 font-roboto text-[#424242]">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-[#424242] max-md:text-lg">
                  Thành phố
                </span>
                <span className="text-xl text-red-500">*</span>
              </div>

              <Select
                inputProps={{ "aria-hidden": false }}
                className="border cursor-pointer border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                {...register("city", {
                  required: "Vui lòng chọn thành phố",
                })}
                defaultValue=""
              >
                {city.map((ct) => (
                  <MenuItem
                    className="rounded-lg hover:bg-blue-400"
                    key={ct.id}
                    value={ct.name}
                  >
                    {ct.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.city && (
                <span className="text-red-500">{errors.city.message}</span>
              )}
            </label>
            <label className="flex flex-col flex-3/4 font-roboto text-[#424242]">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-[#424242] max-md:text-lg">
                  Địa chỉ
                </span>
                <span className="text-xl text-red-500">*</span>
              </div>
              <input
                type="text"
                className="border cursor-pointer border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                {...register("address", {
                  required: "Vui lòng nhập địa chỉ",
                  maxLength: {
                    value: 200,
                    message: "Địa chỉ không được vượt quá 200 ký tự",
                  },
                })}
              />
              {errors.address && (
                <span className="text-red-500">{errors.address.message}</span>
              )}
            </label>
          </div>
          <label className="flex flex-col font-roboto text-[#424242]">
            <span className="text-xl font-bold">Ghi chú</span>
            <textarea
              placeholder="Nhập ghi chú của bạn ở đây nếu có..."
              className="border cursor-pointer border-gray-300 p-2 h-[200px] resize-none text-lg rounded-lg w-full mb-4 text-[#424242] focus:outline-none  focus:ring-2 focus:ring-blue-500"
              {...register("note")}
            />
          </label>
          <button
            type="submit"
            className="bg-[#FF6F00] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#FF8F00] cursor-pointer transition-colors duration-300 mt-4 self-start"
          >
            Đặt hàng
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;
