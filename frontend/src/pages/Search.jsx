import UserNavBar from "../components/UserNavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { BsCart2 } from "react-icons/bs";
import { IconContext } from "react-icons/lib";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  storeItem,
  totalQuantity,
  totalAmount,
} from "../features/counters/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import backendHost from "../config/backendHost";
function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  // Phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10; // Số sản phẩm trên mỗi trang
  const [results, setResults] = useState([]);
  // Lấy dữ liệu truyền từ UserNavBar qua state
  const { query } = location.state || {
    query: "",
  };
  // Lấy kết quả tìm kiếm từ backend
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `${backendHost}/products/search/${query}?page=${page}&limit=${limit}`
        );
        setResults(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSearchResults();
  }, [query, page]);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const isLoggedIn = useSelector((state) => state.cart.isLogin);
  const handleAddToCart = (product) => {
    // neu chua dang nhap
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        position: "top-right",
        autoClose: 500,
      });
      return;
    }

    // kiem tra sp da co trong gio hang chua
    const exisTingItem = cartItems.find((item) => item._id === product._id);
    if (!exisTingItem) {
      // neu chua co thi them sp vao gio hang
      dispatch(storeItem([...cartItems, { ...product, quantity: 1 }]));
      dispatch(totalQuantity());
      dispatch(totalAmount());
    } else {
      // neu co roi thi tang so luong len 1
      const updatedProductQuantity = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      dispatch(storeItem(updatedProductQuantity));
      dispatch(totalQuantity());
      dispatch(totalAmount());
    }
  };
  return (
    <div className="bg-[#f4f2ee] flex flex-col gap-10 h-full min-h-screen">
      <UserNavBar />
      <section className="w-[85%] mx-auto px-4 py-8 mt-[100px] bg-white rounded-lg shadow-md max-md:mt-[200px]">
        <h2 className="text-2xl font-bold mb-4">
          Kết quả tìm kiếm cho "{query}"
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-10">
          {results.length > 0 &&
            results.map((product) => (
              <div
                key={product._id}
                className="flex flex-col bg-white shadow-md rounded-[16px] h-fit gap-1  border border-[#0000001A]
                               hover:scale-101 cursor-pointer transition-transform duration-200 relative"
                onClick={() => {
                  navigate(`/product/${product._id}`);
                }}
              >
                <img
                  src={product.image[0].url}
                  className="w-full h-[400px] object-cover rounded-t-[8px] max-md:h-[300px]"
                  alt={product.title}
                />
                <div className="flex  items-center justify-between gap-2 mt-2 py-2 px-3">
                  <div>
                    <h3
                      className="text-xl font-roboto font-bold text-[#424242] overflow-hidden whitespace-nowrap text-ellipsis w-[250px]
                    max-md:w-[150px] max-md:text-lg"
                    >
                      {product.title}
                    </h3>
                    <div className="flex gap-2  flex-col">
                      <div className="flex items-center gap-5">
                        <p className="text-lg font-roboto font-bold line-through text-[#00000066] max-md:text-base">
                          {product.price.toLocaleString("de-DE")}
                        </p>
                        <p
                          className="text-xl w-fit font-roboto font-bold bg-[#FF6100]/80 text-white rounded-[4px] px-2 py-1 ml-2 2
                        max-md:text-base"
                        >
                          -{product.discount}%
                        </p>
                      </div>
                      <p className="text-xl font-roboto font-semibold text-[#FF6100] max-md:text-base">
                        {Math.round(
                          product.price -
                            (product.price * product.discount) / 100
                        ).toLocaleString("de-DE")}{" "}
                        Đ
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-1 w-[50px] h-[50px] border bg-[#FF6100] border-[#0000001A] rounded-full flex items-center justify-center cursor-pointer group  hover:bg-white 
                     transition-colors duration-200 max-md:w-[35px] max-md:h-[35px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <IconContext.Provider
                      value={{
                        className:
                          "fill-white group-hover:fill-[#FF6100] transition-colors duration-200 max-md:scale-75",
                      }}
                    >
                      <BsCart2 size={25} />
                    </IconContext.Provider>
                  </button>
                </div>
              </div>
            ))}
        </div>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          shape="rounded"
          className="mt-4"
          size="large"
          sx={{
            "& .Mui-selected": {
              backgroundColor: "#FF6F00",
              borderRadius: "25px",
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              "&:hover": {
                backgroundColor: "#2A4178",
              },
            },
            "& .MuiPaginationItem-text": {
              fontSize: "20px",

              fontWeight: "bold",
              fontFamily: "Roboto",
            },
            "& .MuiPaginationItem-root": {
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Roboto",

              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#FF6F00",
                opacity: 0.6,
                color: "#ffffff",
              },
            },
          }}
        />
      </section>
    </div>
  );
}

export default Search;
