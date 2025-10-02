import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storeUserInfo, setLogin } from "../features/counters/cartSlice";
import UserNavBar from "../components/UserNavBar";
import HomeBanner from "../components/HomeBanner";
import HomeCategory from "../components/HomeCategory";
import HomeProduct from "../components/HomeProduct";

import Footer from "../components/Footer";
function HomePage() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  // Handle Google OAuth redirect
  useEffect(() => {
    const query = new URLSearchParams(search);
    const data = query.get("data");
    if (data) {
      try {
        const userData = JSON.parse(decodeURIComponent(data));

        localStorage.setItem("user", JSON.stringify(userData.user));
        dispatch(storeUserInfo(userData.user));
        dispatch(setLogin(true));

        // Clean up URL by removing query parameters
        window.history.replaceState({}, document.title, "/home");
      } catch (error) {
        console.error("Error parsing Google OAuth data:", error);
      }
    }
  }, [search, dispatch]);

  return (
    <div className=" bg-[#f4f2ee] flex flex-col gap-10">
      <UserNavBar />
      <HomeBanner />
      <HomeCategory />
      <HomeProduct />
      <Footer />
    </div>
  );
}

export default HomePage;
