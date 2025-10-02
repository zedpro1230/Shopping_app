import React from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons/lib";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { storeUserInfo, setLogin } from "../features/counters/cartSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import backendHost from "../config/backendHost";
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendHost}/auth/signin`, data);
      console.log("Login successful:", response.data);
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));

        // Update Redux store
        dispatch(storeUserInfo(response.data.data));
        dispatch(setLogin(true));

        if (response.data.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      // Handle login error (e.g., show error message)
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      window.location.href = `${backendHost}/auth/google`;
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    }
  };

  return (
    <div className=" bg-white/40 backdrop-blur p-6 rounded-2xl shadow-md w-[500px] flex flex-col gap-6 ">
      <h2 className="text-[32px] font-bold font-roboto text-[#424242] text-center">
        Đăng Nhập
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="    flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="font-roboto text-[22px] text-[#424242]"
          >
            <IconContext.Provider
              value={{ className: "inline text-[24px] mr-2" }}
            >
              <MdEmail />
            </IconContext.Provider>
          </label>
          <input
            className="border bg-white cursor-pointer border-gray-100 p-2 h-[40px] text-[20px] rounded-lg w-full mb-2 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
            type="email"
            id="email"
            placeholder="Enter your email ex:123@gmail.com"
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
          />
          {errors.email && (
            <span className="text-red-500">Email không hợp lệ</span>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="font-roboto text-[22px] text-[#424242]"
          >
            <IconContext.Provider
              value={{ className: "inline text-[24px] mr-2" }}
            >
              <RiLockPasswordFill />
            </IconContext.Provider>
          </label>
          <input
            className="border bg-white cursor-pointer border-gray-100 p-2 h-[40px] text-[20px] rounded-lg w-full mb-2 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Enter your password"
            id="password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span className="text-red-500">Mật khẩu không hợp lệ</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-[#FF6F00] text-2xl shadow-xs text-white font-bold font-roboto p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#FF6F00] transition-colors"
        >
          Đăng Nhập
        </button>
      </form>
      <div className="flex items-center justify-center gap-1">
        <div className="flex-1 h-[1px] bg-gray-800"></div>
        <p className="  font-roboto font-bold text-[#2A4178]">Hoặc</p>
        <div className="flex-1 h-[1px] bg-gray-800"></div>
      </div>
      <button
        className="bg-white text-white p-2 rounded-lg shadow-xs cursor-pointer"
        onClick={() => {
          handleGoogleSignIn();
        }}
      >
        <div className="flex items-center justify-center gap-2 ">
          <p className="text-[20px] text-[#FF6F00] font-bold font-roboto">
            Đăng Nhập với Google
          </p>
          <IconContext.Provider value={{ className: "" }}>
            <FcGoogle size={24} />
          </IconContext.Provider>
        </div>
      </button>
    </div>
  );
}

export default LoginForm;
