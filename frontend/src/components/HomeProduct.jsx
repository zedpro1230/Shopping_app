import { ToastContainer, toast } from "react-toastify";
import { BsCart2 } from "react-icons/bs";
import { IconContext } from "react-icons/lib";
import { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import backendHost from "../config/backendHost";
import {
  storeItem,
  totalQuantity,
  totalAmount,
} from "../features/counters/cartSlice";
function HomeProduct() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  //Redux handle add to cart
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const isLoggedIn = useSelector((state) => state.cart.isLogin);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${backendHost}/products?page=${page}&limit=15`
      );
      setProducts(response.data.data);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    return () => {
      setProducts([]); // Cleanup on unmount
    };
  }, [page]);
  const moveToDetail = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (product) => {
    // If not logged in, show a toast notification
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        position: "top-right",
        autoClose: 500,
      });
      return; // Stop the function if not logged in
    }

    // Check if the product already exists in the cart
    const exisTingItem = cartItems.find((item) => item._id === product._id);
    if (!exisTingItem) {
      // If it doesn't exist, add it with quantity 1
      dispatch(storeItem([...cartItems, { ...product, quantity: 1 }]));
      dispatch(totalQuantity());
      dispatch(totalAmount());
    } else {
      // If it exists, increment the quantity
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
    <div className="w-[85%] mx-auto  mt-4   gap-10   rounded-lg  max-md:w-[95%]">
      <ToastContainer />
      <div className=" w-full flex flex-col justify-between">
        <div className="   grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-10 ">
          {products.items &&
            products.items.map((product) => (
              <div
                key={product._id}
                className="flex flex-col bg-white shadow-md rounded-[16px] h-fit gap-1  border border-[#0000001A]
               hover:scale-101 cursor-pointer transition-transform duration-200 relative"
                onClick={() => {
                  moveToDetail(product._id);
                }}
              >
                <img
                  src={product.image[0].url}
                  className="w-full h-[400px] object-cover rounded-t-[8px]"
                  alt={product.title}
                />
                <div className="flex  items-center justify-between gap-2 mt-2 py-2 px-3">
                  <div>
                    <h3 className="text-xl font-roboto font-bold text-[#424242] overflow-hidden whitespace-nowrap text-ellipsis w-[250px]">
                      {product.title}
                    </h3>
                    <div className="flex gap-2  flex-col">
                      <div className="flex items-center gap-5">
                        <p className="text-lg font-roboto font-bold line-through text-[#00000066]">
                          {product.price.toLocaleString("de-DE")}
                        </p>
                        <p className="text-xl w-fit font-roboto font-bold bg-[#FF6100]/80 text-white rounded-[4px] px-2 py-1 ml-2 2">
                          -{product.discount}%
                        </p>
                      </div>
                      <p className="text-xl font-roboto font-semibold text-[#FF6100]">
                        {Math.round(
                          product.price -
                            (product.price * product.discount) / 100
                        ).toLocaleString("de-DE")}{" "}
                        Đ
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-1 w-[50px] h-[50px] border bg-[#FF6100] border-[#0000001A] rounded-full flex items-center justify-center cursor-pointer group  hover:bg-white  transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <IconContext.Provider
                      value={{
                        className:
                          "fill-white group-hover:fill-[#FF6100] transition-colors duration-200",
                      }}
                    >
                      <BsCart2 size={25} />
                    </IconContext.Provider>
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div>
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
        </div>
      </div>
    </div>
  );
}

export default HomeProduct;
