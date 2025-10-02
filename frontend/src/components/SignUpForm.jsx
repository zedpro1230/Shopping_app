import React from "react";
import { useForm } from "react-hook-form";
import { IconContext } from "react-icons/lib";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backendHost from "../config/backendHost";
function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendHost}/auth/signup`, data);
      console.log("User signed up successfully:", response.data);
      alert("Sign up successful! Please log in.");
      // Optionally, redirect to login page or clear the form
    } catch (error) {
      console.error("Error signing up:", error.response.data);
    }
  };
  const navigate = useNavigate();
  const handleBackToLogin = () => {
    navigate("/login");
  };
  return (
    <div className=" bg-white/40 backdrop-blur p-6 rounded-2xl shadow-md w-[500px] flex flex-col gap-6 ">
      <h2 className="text-[32px] font-bold font-roboto text-[#2A4178] text-center">
        Sign Up
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="    flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="font-roboto text-[22px] text-[#2A4178]"
          >
            <IconContext.Provider
              value={{ className: "inline text-[24px] mr-2" }}
            >
              <FaUser />
            </IconContext.Provider>
          </label>
          <input
            className="border bg-white cursor-pointer border-gray-100 p-2 h-[40px] text-[20px] rounded-lg w-full mb-2 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter your name"
            id="name"
            {...register("name", { required: true, maxLength: 50 })}
          />
          {errors.name && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="font-roboto text-[22px] text-[#2A4178] "
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
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="font-roboto text-[22px] text-[#2A4178]"
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
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="font-roboto text-[22px] text-[#2A4178]"
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
            placeholder="Enter your password again"
            id="re-password"
            {...register("re-password", {
              required: "This field is required",
              validate: (value) => {
                const password = document.getElementById("password").value;
                return value === password || "Passwords do not match";
              },
            })}
          />
          {errors["re-password"] && (
            <span className="text-red-500">
              {errors["re-password"].message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600  text-[22px] text-white font-bold font-roboto p-2 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-[#2A4178] transition-colors"
        >
          Sign Up
        </button>
        <button
          className="flex items-center justify-center mt-4 "
          onClick={() => {
            handleBackToLogin();
          }}
        >
          <IconContext.Provider
            value={{ className: "inline text-[24px] mr-2 fill-blue-600" }}
          >
            <IoMdArrowBack />
          </IconContext.Provider>
          <p className="text-blue-600 ">Back to Login</p>
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
