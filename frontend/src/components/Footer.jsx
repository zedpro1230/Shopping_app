import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { IconContext } from "react-icons/lib";

function Footer() {
  return (
    <footer className="bg-[#424242]">
      <div className="flex flex-col gap-2   p-2 w-[85%] mx-auto justify-center items-center mt-10">
        <div className="flex justify-between w-full ">
          <div className="flex flex-col mt-[20px]  px-5">
            <h2 className=" font-bold mb-2 font-roboto text-3xl text-white">
              LUSHOP
            </h2>
            <ul className="flex gap-6">
              <li className="cursor-pointer">
                <IconContext.Provider
                  value={{ color: "#3b5998", size: "30px" }}
                >
                  <FaFacebook />
                </IconContext.Provider>
              </li>
              <li className="cursor-pointer">
                <IconContext.Provider
                  value={{ color: "#E1306C", size: "30px" }}
                >
                  <FaInstagram />
                </IconContext.Provider>
              </li>
              <li className="cursor-pointer">
                <IconContext.Provider
                  value={{ color: "#FF0000", size: "30px" }}
                >
                  <FaYoutube />
                </IconContext.Provider>
              </li>
              <li className="cursor-pointer">
                <IconContext.Provider
                  value={{ color: "#1DA1F2", size: "30px" }}
                >
                  <FaTwitter />
                </IconContext.Provider>
              </li>
            </ul>
          </div>
          <div className="flex flex-col mt-[20px]  px-5 ">
            <h2 className=" font-bold mb-2 font-roboto text-3xl text-white">
              Hỗ trợ khách hàng
            </h2>
            <ul className="flex flex-col gap-4">
              <li className="text-white hover:text-white cursor-pointer">
                Trung tâm trợ giúp
              </li>
              <li className="text-white hover:text-white cursor-pointer">
                Chính sách đổi trả
              </li>
              <li className="text-white hover:text-white cursor-pointer">
                Hướng dẫn mua hàng
              </li>
              <li className="text-white hover:text-white cursor-pointer">
                Liên hệ hỗ trợ
              </li>
            </ul>
          </div>
          <div className="flex flex-col mt-[20px]  px-5 ">
            <h2 className=" font-bold mb-2 font-roboto text-3xl text-white">
              Thông tin shop
            </h2>
            <ul className="flex flex-col gap-4">
              <li className="text-white hover:text-white cursor-pointer">
                Giới thiệu về LUSHOP
              </li>
              <li className="text-white hover:text-white cursor-pointer">
                Tuyển dụng
              </li>
            </ul>
          </div>
          <div className="flex flex-col mt-[20px]  px-5 ">
            <h2 className=" font-bold mb-2 font-roboto text-3xl text-white">
              Chính sách
            </h2>
            <ul className="flex flex-col gap-4">
              <li className="text-white hover:text-white cursor-pointer">
                Điiều khoản sử dụng
              </li>
              <li className="text-white hover:text-white cursor-pointer">
                Chính sách bảo mật
              </li>
              <li className="text-white hover:text-white cursor-pointer">
                Chính sách vận chuyển
              </li>
            </ul>
          </div>
        </div>

        <div className="w-[98%] h-[1px] bg-white mt-3"></div>
        <div className="text-center mt-4 mb-2 text-white font-roboto">
          <p>&copy; 2024 LUSHOP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
