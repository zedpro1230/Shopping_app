import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Rating from "@mui/material/Rating";
import Modal from "@mui/material/Modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import backendHost from "../config/backendHost";
function ProductViewModal({ open, onClose, productId }) {
  const [product, setProduct] = useState(null);
  const [comment, setComment] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  useEffect(() => {
    if (!productId || !open) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${backendHost}/products/${productId}`
        );
        console.log("Product response:", response.data);
        setProduct(response.data.data); // Access the data property
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${backendHost}/comments/${productId}`
        );
        console.log("Comments response:", response.data);
        setComment(response.data.data || response.data); // Handle both response formats
      } catch (error) {
        console.error("Error fetching product comments:", error);
        setComment([]);
      }
    };

    fetchProduct();
    fetchComments();
  }, [productId, open]);

  if (!open) return null;

  // Create settings only when product data is available
  const getSliderSettings = () => {
    if (!product || !product.image || product.image.length === 0) {
      return {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        arrows: false,
        slidesToScroll: 1,
      };
    }

    return {
      customPaging: function (i) {
        // Add safety checks
        if (!product?.image?.[i]?.url) {
          return (
            <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
              <span>No Image</span>
            </div>
          );
        }
        return (
          <img
            src={product.image[i].url}
            alt={product.title || "Product"}
            className="w-[100px] h-[100px] object-cover rounded-lg cursor-pointer"
          />
        );
      },
      dots: true,
      dotsClass: "slick-dots slick-thumb",
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      arrows: false,
      slidesToScroll: 1,
    };
  };
  return (
    <div className="w-full flex justify-center  items-center ">
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="bg-white w-[90%] h-[90%] overflow-y-scroll rounded-2xl flex flex-col items-center justify-start p-6
        "
        >
          {product && (
            <div className="flex gap-4 p-4 w-full max-xl:flex-col max-xl:items-center max-xl:justify-center">
              <div>
                <Slider
                  {...getSliderSettings()}
                  className="w-[500px] rounded-lg max-xl:w-[300px] "
                >
                  {product?.image &&
                  Array.isArray(product.image) &&
                  product.image.length > 0 ? (
                    product.image.map((img, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center"
                      >
                        <img
                          src={img?.url || "https://via.placeholder.com/500"}
                          alt={product.title || "Product Image"}
                          className="w-full h-[500px] object-cover rounded-lg max-xl:h-[300px]"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center">
                      <img
                        src="https://via.placeholder.com/500"
                        alt="Placeholder"
                        className="w-full h-[500px] object-cover rounded-lg"
                      />
                    </div>
                  )}
                </Slider>
              </div>

              <div className="w-full flex flex-col gap-4 max-xl:gap-1">
                <h2 className="text-2xl font-roboto font-bold break-all text-[#424242] max-md:text-xl">
                  {product.title}
                </h2>
                <Rating
                  name="read-only"
                  precision={0.5}
                  value={4.5}
                  readOnly
                  size="large"
                />
                <div className="flex gap-5 items-center  py-4 pr-4 rounded-lg h-[100px] max-md:flex-wrap ">
                  <p className="text-[28px] font-roboto font-semibold text-[#FF6100] max-md:text-xl">
                    {Math.round(
                      product.price - (product.price * product.discount) / 100
                    ).toLocaleString("de-VN")}
                    đ
                  </p>
                  <p className="text-xl font-roboto font-bold line-through text-black/50 max-md:text-xl">
                    {product.price.toLocaleString("de-VN")}đ
                  </p>
                  <p className="text-xl font-roboto font-bold bg-[#FF6100] text-white  px-2 py-1 rounded-md max-md:text-xl">
                    -{product.discount}%
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-xl text-[#424242] font-roboto font-bold max-md:text-lg">
                    Trạng thái:
                  </span>
                  {product.stock > 0 ? (
                    <span className="text-[18px] font-roboto font-bold bg-green-600/80 text-white px-2 py-1 rounded-md max-md:text-[16px] ">
                      Còn hàng
                    </span>
                  ) : (
                    <span className="text-[18px] font-roboto font-bold bg-red-600/80 text-white px-2 py-1 rounded-md max-md:text-[16px] ">
                      Hết hàng
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className=" w-full  ">
            <Tabs
              value={tabIndex}
              centered
              onChange={handleTabChange}
              sx={{
                width: "100%",

                borderRadius: "8px",

                marginTop: "20px",
                "& .MuiTabs-indicator": {
                  backgroundColor: "#FF6F00",
                  height: "4px",
                  borderRadius: "2px",
                },
              }}
            >
              <Tab
                label="Mô tả"
                sx={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  fontFamily: "roboto",
                  "&.Mui-selected": {
                    color: "#FF6F00", // active tab color
                  },
                }}
              />
              <Tab
                label="Đánh giá"
                sx={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  fontFamily: "roboto",
                  "&.Mui-selected": {
                    color: "#FF6F00", // active tab color
                  },
                }}
              />
            </Tabs>
            {tabIndex === 0 ? (
              <div className="mt-8 bg-white rounded-lg w-full flex flex-col border-solid border-1 border-[#e5e5e5]">
                <h2 className="text-[24px] font-roboto font-bold p-4 max-md:text-xl text-[#424242]">
                  Mô tả sản phẩm
                </h2>
                <div className="text-[18px] font-roboto font-normal p-4 text-justify break-all">
                  {product && (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-10 mb-2 justify-between w-[300px] max-xl:flex-col max-xl:gap-1">
                          <span className="text-gray-500 font-roboto font-bold max-md:text-[16px]">
                            Danh mục
                          </span>
                          <span className="font-roboto font-bold text-[#424242] max-md:text-[14px]">
                            {product.category.categoryTitle}
                          </span>
                        </div>

                        <div className="flex gap-10 mb-2 justify-between w-[300px] max-xl:flex-col max-xl:gap-1">
                          <span className="text-gray-500 font-roboto font-bold max-md:text-[16px]">
                            Nơi bán
                          </span>
                          <span className="font-roboto font-bold text-[#424242] max-md:text-[14px]">
                            {product.city}
                          </span>
                        </div>
                      </div>
                      <p className="break-all text-[#424242] max-md:text-[16px]">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8 bg-white rounded-lg w-full flex flex-col border-solid border-1 border-[#e5e5e5]">
                <h2 className="text-2xl text-[#424242] font-roboto font-bold p-4 max-md:text-xl">
                  Bình luận
                </h2>
                <div className="p-4 flex flex-col gap-4">
                  {/* Example comment */}
                  {comment !== null &&
                    comment.map((cmt, index) => (
                      <div
                        key={cmt._id}
                        className="bg-[#FAF7F3] shadow-xs rounded-lg p-4 flex justify-between items-start gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <img
                              src={cmt.userId.avatar}
                              alt="User Avatar"
                              className="w-[50px] h-[50px] rounded-full max-md:w-[35px] max-md:h-[35px]"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex flex-col">
                              <span className="font-roboto font-bold text-[18px] max-md:text-[16px] text-[#424242]">
                                {cmt.userId.name}
                              </span>
                              <Rating
                                name="read-only"
                                value={cmt.rating}
                                precision={0.5}
                                readOnly
                                size="small"
                              />
                              <span className="text-[14px] text-[#00000099]">
                                {cmt.createdAt.split("T")[0]}
                              </span>
                            </div>
                          </div>
                          <p className="font-roboto font-normal text-lg break-all text-[#424242] max-md:text-[16px]">
                            {cmt.commentText}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductViewModal;
