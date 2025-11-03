import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMinus } from "react-icons/fa";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { IconContext } from "react-icons/lib";
import UserNavBar from "../components/UserNavBar";
import { useState, useEffect, use } from "react";
import Rating from "@mui/material/Rating";
import { MdOutlineAdd } from "react-icons/md";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdDeleteSweep } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import backendHost from "../config/backendHost";
import { useDispatch, useSelector } from "react-redux";
import {
  storeItem,
  totalAmount,
  totalQuantity,
} from "../features/counters/cartSlice";
function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState([]);
  const [rating, setRating] = useState(3);
  const [inputComment, setInputComment] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const isLoggedIn = useSelector((state) => state.cart.isLogin);
  const userInfo = useSelector((state) => state.cart.userInfo);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${backendHost}/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  const fetchcomment = async () => {
    try {
      const response = await axios.get(`${backendHost}/comments/${id}`);
      setComment(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  useEffect(() => {
    fetchProduct();
    fetchcomment();
  }, [id]);

  const handlesubmit = async () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để bình luận!", {
        position: "top-right",
        autoClose: 500,
      });
      return;
    }
    if (inputComment === "") {
      toast.error("Vui lòng nhập bình luận!", {
        position: "top-right",
        autoClose: 500,
      });
      return;
    }
    try {
      const response = await axios.post(`${backendHost}/comments/`, {
        commentText: inputComment,
        productId: id,
        userId: userInfo.id,
        rating: rating,
      });
      toast.success("Bình luận thành công!", {
        position: "top-right",
        autoClose: 500,
      });
      fetchcomment();
      setInputComment("");
      setRating(3);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${backendHost}/comments/${commentId}`);
      toast.success("Xoá bình luận thành công!", {
        position: "top-right",
        autoClose: 500,
      });
      fetchcomment();
    } catch (error) {
      toast.error("Xoá bình luận thất bại!", {
        position: "top-right",
        autoClose: 500,
      });
    }
  };
  const settings = {
    customPaging: function (i) {
      return (
        <img
          src={`${product.image[i].url}`}
          alt={product.title}
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
  const minus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const plus = () => {
    setQuantity(quantity + 1);
  };
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const handleAddToCart = (product, quantity) => {
    // check login
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        position: "top-right",
        autoClose: 500,
      });
      return;
    }
    const existingItem = cartItems.find((item) => item._id === product._id);
    if (!existingItem) {
      const newItem = { ...product, quantity: quantity };
      dispatch(storeItem([...cartItems, newItem]));
      dispatch(totalQuantity());
      dispatch(totalAmount());
    } else {
      const updatedItems = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      dispatch(storeItem(updatedItems));
      dispatch(totalQuantity());
      dispatch(totalAmount());
    }
  };

  return (
    <div className="w-[85%] mx-auto bg-[#f4f2ee]">
      <UserNavBar />
      <ToastContainer />
      <div className="bg-white rounded-lg border-solid border-1 border-[#e5e5e5] mt-[80px] w-full max-lg:mt-[250px]">
        {product && (
          <div className="flex gap-4 p-4 w-full max-lg:flex-col">
            <div>
              <Slider
                {...settings}
                className="w-[500px] rounded-lg max-lg:w-full "
              >
                {product.image.map((img, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <img
                      src={img.url}
                      alt={product.title}
                      className="w-full h-[500px] object-cover rounded-lg max-md:h-[300px]"
                    />
                  </div>
                ))}
              </Slider>
            </div>

            <div className="w-full flex flex-col gap-4">
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
              <div className="flex gap-5 items-center  p-4 rounded-lg h-[100px] flex-wrap ">
                <p className="text-[28px] font-roboto font-semibold text-[#FF6100] max-md:text-[24px]">
                  {Math.round(
                    product.price - (product.price * product.discount) / 100
                  ).toLocaleString("de-VN")}
                  đ
                </p>
                <p className="text-xl font-roboto font-bold line-through text-black/50 max-md:text-lg">
                  {product.price.toLocaleString("de-VN")}đ
                </p>
                <p className="text-xl font-roboto font-bold bg-[#FF6100] text-white  px-2 py-1 rounded-md max-md:text-lg">
                  -{product.discount}%
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-xl text-[#424242] font-roboto font-bold max-md:text-lg">
                  Trạng thái:
                </span>
                {product.stock > 0 ? (
                  <span className="text-[18px] font-roboto font-bold bg-green-600/80 text-white px-2 py-1 rounded-md max-md:text-[16px]">
                    Còn hàng
                  </span>
                ) : (
                  <span className="text-[18px] font-roboto font-bold bg-red-600/80 text-white px-2 py-1 rounded-md max-md:text-[16px]">
                    Hết hàng
                  </span>
                )}
              </div>
              <div className="flex gap-2 justify-center items-center bg-white border border-solid border-[#e5e5e5] rounded-lg p-2 w-[200px]">
                <button
                  className={`p-1 w-[50px] h-[50px]  flex items-center justify-center cursor-pointer group    
                  `}
                  onClick={minus}
                >
                  <IconContext.Provider
                    value={{
                      className: `text-[#2A4178]  `,
                    }}
                  >
                    <FaMinus size={20} />
                  </IconContext.Provider>
                </button>
                <span className="text-[20px] text-[#2A4178] font-roboto font-bold mx-4">
                  {quantity}
                </span>
                <button
                  className={`p-1 w-[50px] h-[50px] flex items-center justify-center cursor-pointer group 
                  `}
                  onClick={plus}
                >
                  <IconContext.Provider
                    value={{
                      className: "text-[#2A4178]",
                    }}
                  >
                    <MdOutlineAdd size={25} />
                  </IconContext.Provider>
                </button>
              </div>
              <button
                className="bg-[#FF6100] gap-2 border-solid border-1 border-[#e5e5e5] flex justify-center 
              items-center text-white text-[20px] font-roboto font-bold rounded-lg p-4 w-[300px]
               hover:bg-white hover:text-[#FF6100] transition-colors duration-200 cursor-pointer
               max-md:w-full max-md:text-lg max-md:p-3"
                onClick={() => {
                  handleAddToCart(product, quantity);
                }}
              >
                Thêm vào giỏ hàng
                <IconContext.Provider
                  value={{ className: "inline-block ml-2", size: "20px" }}
                >
                  <FaCartPlus />
                </IconContext.Provider>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="">
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
            <h2 className="text-[24px] font-roboto font-bold p-4">
              Mô tả sản phẩm
            </h2>
            <div className="text-[18px] font-roboto font-normal p-4 text-justify break-all">
              {product && (
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex gap-10 mb-2 justify-between w-[300px] max-md:flex-col max-md:gap-4">
                      <span className="text-gray-500 font-roboto font-bold">
                        Danh mục
                      </span>
                      <span className="font-roboto font-bold text-[#424242]">
                        {product.category.categoryTitle}
                      </span>
                    </div>

                    <div className="flex gap-10 mb-2 justify-between w-[300px] max-md:flex-col max-md:gap-4">
                      <span className="text-gray-500 font-roboto font-bold">
                        Nơi bán
                      </span>
                      <span className="font-roboto font-bold text-[#424242]">
                        {product.city}
                      </span>
                    </div>
                  </div>
                  <p className="break-all text-[#424242]">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-lg w-full flex flex-col border-solid border-1 border-[#e5e5e5]">
            <h2 className="text-2xl text-[#424242] font-roboto font-bold p-4">
              Bình luận
            </h2>
            <div className="bg-[#F5F5F5]/80 rounded-lg m-4 p-4">
              <textarea
                className="w-full h-[100px] text-[#424242] border border-[#0000001A] bg-white rounded-lg p-2 resize-none
            focus:outline-none focus:ring-1 focus:ring-[#FF6F00]  font-roboto font-normal text-xl"
                placeholder="Để lại bình luận..."
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
              ></textarea>
              <Rating
                name="half-rating"
                value={rating}
                precision={0.5}
                size="large"
                onChange={(e) => setRating(e.target.value)}
                sx={{
                  fontSize: "40px",
                }}
              />
              <button
                className="w-[100px] h-[50px] flex items-center gap-2 justify-center bg-white rounded-lg 
          border border-[#FF6F00] text-[#FF6F00] font-roboto font-bold mt-4 border-solid

            transition-colors duration-200 cursor-pointer"
                onClick={() => {
                  handlesubmit();
                }}
              >
                Gửi
                <IconContext.Provider
                  value={{
                    className: "inline-block fill-[#FF6F00] ",
                  }}
                >
                  <IoMdSend size={25} />
                </IconContext.Provider>
              </button>
            </div>
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
                          className="w-[50px] h-[50px] rounded-full"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col">
                          <span className="font-roboto font-bold text-[18px] ">
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
                      <p className="font-roboto font-normal text-lg break-all text-[#424242]">
                        {cmt.commentText}
                      </p>
                    </div>
                    {userInfo ? (
                      <div>
                        {userInfo.id === cmt.userId._id && (
                          <button
                            className="bg-[#FF3333]/30  px-4 py-2 rounded-[4px] cursor-pointer hover:bg-[#FF3333]/50 transition-colors duration-300"
                            onClick={() => {
                              handleDeleteComment(cmt._id);
                            }}
                          >
                            <IconContext.Provider
                              value={{
                                size: "1.5em",
                                className: "fill-[#FF3333]",
                              }}
                            >
                              <MdDeleteSweep />
                            </IconContext.Provider>
                          </button>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
