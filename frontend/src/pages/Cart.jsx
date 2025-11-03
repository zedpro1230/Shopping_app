import UserNavBar from "../components/UserNavBar";
import { useSelector } from "react-redux";
import { FaMinus } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { IconContext } from "react-icons/lib";
import { MdOutlineDeleteSweep } from "react-icons/md";
import empty from "../images/cartEmpty.png";
import { useNavigate } from "react-router-dom";
import {
  addQuantity,
  totalQuantity,
  totalAmount,
  minusQuantity,
  removeItem,
} from "../features/counters/cartSlice";
import { useDispatch } from "react-redux";
function Cart() {
  const navigate = useNavigate();
  const quantity = useSelector((state) => state.cart.totalQuantity);
  const items = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();
  const handleAdd = (item) => {
    dispatch(addQuantity(item._id));
    dispatch(totalQuantity());
    dispatch(totalAmount());
  };
  const handleMinus = (item) => {
    dispatch(minusQuantity(item._id));
    dispatch(totalQuantity());
    dispatch(totalAmount());
  };
  const handleDelete = (item) => {
    dispatch(removeItem(item._id));
    dispatch(totalQuantity());
    dispatch(totalAmount());
  };
  return (
    <div className="p-8 bg-[#f4f2ee] flex min-h-screen mt-[80px] flex-col max-md:mt-[200px]">
      <UserNavBar />
      <div className="w-[60%] mx-auto bg-white p-8 rounded-lg shadow-md max-md:w-[90%] max-sm:w-full max-md:p-4">
        <h1 className="text-3xl font-bold font-montserrat mb-4   font-roboto text-[#424242] max-md:text-2xl">
          Giỏ hàng của bạn
        </h1>
        <p className="text-xl font-roboto text-[#424242] max-md:text-lg">
          Bạn có {quantity} sản phẩm trong giỏ hàng.
        </p>
        {items.length === 0 && (
          <div className="flex flex-col items-center mt-8">
            <img
              src={empty}
              alt="Empty Cart"
              className="w-64 h-64 mb-4 rounded-[8px] object-cover "
            />
            <p
              className="text-lg text-gray-600 cursor-pointer hover:underline max-md:text-base"
              onClick={() => {
                navigate("/home");
              }}
            >
              Quay lại mua sắm.
            </p>
          </div>
        )}
        <ul className="mt-4">
          {items.map((item) => (
            <li
              key={item._id}
              className="border border-gray-300 px-10 py-6 bg-white  rounded-lg mb-2 justify-between flex items-center gap-4
              max-xl:flex-col max-xl:items-start
              "
            >
              <div className="flex gap-4 max-xl:flex-col max-xl:items-start">
                <img
                  src={item.image[0].url}
                  alt={item.title}
                  className="w-[200px] h-[200px] object-cover rounded-lg max-md:w-[150px] max-md:h-[150px]"
                />
                <div>
                  <h2 className="text-xl font-bold font-roboto text-[#424242] max-md:text-lg">
                    {item.title}
                  </h2>
                  <div className="flex gap-2 items-center flex-wrap mt-2">
                    <p className="text-xl font-roboto font-semibold text-[#FF6F00] max-md:text-lg">
                      {Math.round(
                        item.price - (item.price * item.discount) / 100
                      ).toLocaleString("de-DE")}
                      đ
                    </p>
                    <p className="text-[16px] font-roboto font-bold line-through text-[#00000066] max-md:text-[14px]">
                      {item.price.toLocaleString("de-DE")}đ
                    </p>
                    <p
                      className="text-[20px] font-roboto font-bold bg-[#FF6F00]/30 text-[#FF6F00] rounded-[4px] px-2 py-1 ml-2 2
                    max-md:text-[16px] max-md:px-1 max-md:py-0.5"
                    >
                      -{item.discount}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between  items-center gap-4 ">
                <button
                  className="bg-white cursor-pointer text-white px-4 py-2 rounded-lg w-[50px] h-[50px] 
                  flex justify-center shadow-xs items-center border border-gray-300 transition-colors duration-300
                  max-md:w-[35px] max-md:h-[35px] max-md:px-3 max-md:py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMinus(item);
                  }}
                >
                  <IconContext.Provider
                    value={{ size: "1.5em", className: "fill-[#2A4178]" }}
                  >
                    <FaMinus />
                  </IconContext.Provider>
                </button>
                <span className="text-[20px] font-roboto font-bold text-[#2A4178] max-md:text-[16px]">
                  {item.quantity}
                </span>
                <button
                  className="bg-white cursor-pointer text-white px-4 py-2 rounded-lg w-[50px] h-[50px] shadow-xs flex justify-center
                   items-center border border-gray-300 transition-colors duration-300 max-md:w-[35px] max-md:h-[35px] max-md:px-3 max-md:py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAdd(item);
                  }}
                >
                  <IconContext.Provider
                    value={{ size: "1.5em", className: "fill-[#2A4178]" }}
                  >
                    <MdAdd />
                  </IconContext.Provider>
                </button>
                <button
                  className="bg-[#FF3333] w-[50px] h-[50px]   rounded-lg cursor-pointer flex justify-center items-center
                  max-md:w-[35px] max-md:h-[35px]"
                  onClick={() => {
                    handleDelete(item);
                  }}
                >
                  <IconContext.Provider
                    value={{ size: "1.5em", className: "fill-white" }}
                  >
                    <MdOutlineDeleteSweep />
                  </IconContext.Provider>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className=" my-6 flex justify-between items-center flex-wrap gap-4">
          <div className="  flex  items-center gap-4">
            <p className="text-2xl font-roboto font-bold text-[#424242]">
              Tổng tiền:
            </p>
            <p className="text-2xl font-roboto font-bold text-[#FF6F00]">
              {Math.round(total).toLocaleString("de-DE")}đ
            </p>
          </div>
          <button
            className="text-xl font-roboto bg-[#FF6F00] min-w-max text-white px-6 py-3 flex-1 rounded-lg cursor-pointer hover:bg-[#FF6F00]/80 transition-colors duration-300 "
            onClick={() => navigate("/order")}
          >
            Điền thông tin đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
