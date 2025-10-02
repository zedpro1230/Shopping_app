import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import UserNavBar from "../components/UserNavBar";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { BsCart2 } from "react-icons/bs";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {
  storeItem,
  totalQuantity,
  totalAmount,
} from "../features/counters/cartSlice";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import backendHost from "../config/backendHost";
function Category() {
  const location = useLocation();
  const { slug } = useParams();
  const { name } = location.state || { name: slug };
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [value, setValue] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  //Redux handle add to cart
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const rangeList = [
    { label: "Tất cả", value: [] },
    { label: "Dưới 500.000 ngàn", value: [1, 500000] },
    { label: "500.000đ - 1.000.000đ", value: [500000, 1000000] },
    { label: "1.000.000đ - 5.000.000đ", value: [1000000, 5000000] },
    { label: "5.000.000đ - 10.000.000đ", value: [5000000, 10000000] },
    { label: "Trên 10.000.000đ", value: [10000000, 1000000000] },
  ];
  const moveToDetail = (id) => {
    navigate(`/product/${id}`);
  };
  const handleAddToCart = (product) => {
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
  const fetchProducts = useCallback(async () => {
    try {
      console.log("Fetching products with params:", {
        value,
        city,
        page,
        name,
      });
      const response = await axios.get(
        `${backendHost}/products/filter?minPrice=${value[0] || ""}&maxPrice=${
          value[1] || ""
        }&city=${
          city === "Tất cả" ? "" : city
        }&slug=${name}&page=${page}&limit=${limit}`,
        {}
      );
      setProducts(response.data.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching products", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [value, city, page, name, limit]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const getCity = async () => {
    try {
      const response = await axios.get(
        "https://open.oapi.vn/location/provinces?page=0&size=63&query="
      );
      setCities(response.data.data);
    } catch (error) {
      console.error("Error retrieving cities:", error);
    }
  };
  useEffect(() => {
    getCity();
  }, []);

  const handleReset = () => {
    console.log("Resetting filters");
    setValue([]);
    setCity("");
    setPage(1);
  };
  console.log(cities);
  console.log("Selected price range:", value);

  return (
    <div className="p-8 bg-[#f4f2ee] flex min-h-screen mt-[80px] ">
      <UserNavBar />
      <ToastContainer />
      <div className="w-[20%] mx-auto bg-white p-8 rounded-lg shadow-md flex flex-col h-fit">
        <h1 className="text-[32px] font-bold font-roboto mb-4    text-[#424242]">
          Bộ lọc sản phẩm
        </h1>
        <div className="mb-4 flex flex-col gap-3">
          <label className="block text-[#424242] font-roboto mb-2 font-bold text-[20px]">
            Thành phố
          </label>
          <Select
            onChange={(e) => setCity(e.target.value)}
            value={city}
            displayEmpty
            className="w-full "
          >
            <MenuItem value="" className="font-roboto text-xl text-[#424242]">
              Tất cả thành phố
            </MenuItem>
            {cities.map((city) => (
              <MenuItem
                key={city.id}
                value={city.name}
                className="font-roboto text-xl text-[#424242]"
              >
                {city.name}
              </MenuItem>
            ))}
          </Select>
          <label className="block text-[#424242] font-roboto mb-2 mt-4 font-bold text-[20px]">
            Giá thành
          </label>
          {rangeList.map((range, index) => (
            <div key={index} className="flex items-center mb-2 gap-2">
              <input
                type="radio"
                name="priceRange"
                value={range.label}
                checked={JSON.stringify(value) === JSON.stringify(range.value)}
                className="mr-2 w-[25px] h-[25px] accent-[#2A4178] outline-none cursor-pointer"
                onChange={() => setValue(range.value)}
              />

              <label className="text-[#424242] font-roboto text-[18px] font-medium cursor-pointer">
                {range.label}
              </label>
            </div>
          ))}
          {/* <button
            className="mt-4 bg-[#FF6100] text-white py-2 px-4 rounded-lg text-[20px] font-roboto font-bold  transition-colors cursor-pointer hover:bg-[#FF6100]/80"
            onClick={() => {
              handleFilter();
            }}
          >
            Áp dụng bộ lọc
          </button> */}
          <button
            className="mt-2 bg-white border border-gray-300 text-[#F64] py-2 px-4 rounded-lg text-[20px] font-roboto font-bold  transition-colors cursor-pointer hover:bg-gray-100"
            onClick={() => {
              handleReset();
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
      <div className="w-[75%] mx-auto min-h-dvh  bg-white p-8 rounded-lg shadow-md flex flex-col ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="bg-[#FF6100] text-white py-1 px-3 cursor-pointer rounded-lg flex justify-center items-center font-medium text-[18px] font-roboto"
              onClick={() => navigate("/home")}
            >
              Trang chủ
            </span>
            <span className="font-roboto text-[30px]">/</span>
            <span className="bg-gray-300 text-white py-1 px-3 rounded-lg flex justify-center items-center font-medium text-[18px] font-roboto">
              {`  ${name}`}
            </span>
          </div>
          <p className="text-black/50 font-medium font-roboto text-xl">
            Tổng số sản phẩm: {products.length}
          </p>
        </div>
        <div className=" grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] h-fit gap-5">
          {products.length > 0 ? (
            products.map((product) => (
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
            ))
          ) : (
            <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
          )}
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
                  backgroundColor: "#F0F0F0",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Category;
