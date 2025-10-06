import { Routes, Route } from "react-router-dom";
import AdminHome from "./pages/AdminHome";
import AdminBanner from "./pages/AdminBanner";
import { ItemsProvider } from "./context/Itemscontext";
import { BannerProvider } from "./context/BannerContext";
import { Navigate } from "react-router-dom";
import AdminCategory from "./pages/AdminCategory";
import AdminProduct from "./pages/AdminProduct";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import OrderForm from "./pages/OrderForm";
import Cart from "./pages/Cart";
import Category from "./pages/Category";
import AdminOrder from "./pages/AdminOrder";
import UserDetail from "./pages/UserDetail";
import "./index.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLogin, storeUserInfo } from "./features/counters/cartSlice";
import { useSelector } from "react-redux";
// Component to initialize auth state from localStorage

function App() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.cart.userInfo);
  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(storeUserInfo(user));
        dispatch(setLogin(true));
      } catch (error) {
        console.error(
          "Có lỗi khi phân tích chuỗi user từ localStorage:",
          error
        );

        localStorage.removeItem("user");
      }
    } else {
      console.log("Không tìm thấy thông tin user trong localStorage.");
    }
  }, [dispatch]);
  return (
    <div className="App ">
      <ItemsProvider>
        <BannerProvider>
          <Routes>
            <Route
              // Check tự động đăng nhập với role
              path="/"
              element={
                userInfo ? (
                  userInfo.role === "admin" ? (
                    <Navigate
                      to="/admin/dashboard"
                      replace
                      element={<AdminHome />}
                    />
                  ) : (
                    <Navigate to="/home" replace element={<HomePage />} />
                  )
                ) : (
                  <Navigate to="/home" replace element={<HomePage />} />
                )
              }
            />
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin/dashboard" element={<AdminHome />} />
            <Route path="/admin/banner" element={<AdminBanner />} />
            <Route path="/admin/category" element={<AdminCategory />} />
            <Route path="/admin/products" element={<AdminProduct />} />
            <Route path="/admin/orders" element={<AdminOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/user_profile" element={<UserDetail />} />
          </Routes>
        </BannerProvider>
      </ItemsProvider>
    </div>
  );
}

export default App;
