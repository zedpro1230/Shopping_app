import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import axios from "axios";
function HomeBanner() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
  };
  const [banners, setBanners] = useState([]);
  const [key, setKey] = useState(0); // State to force re-render
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("http://localhost:3000/banners");
        setBanners(response.data.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
    setKey(1);
  }, []);

  return (
    <div className="slider-container mt-[60px] mb-[20px] h-[700px]  w-[85%] mx-auto border border-[#e5e5e5] rounded-lg shadow-md border-solid">
      <Slider {...settings} key={key}>
        {banners.map((banner, index) => (
          <div
            key={index}
            className="  flex items-center justify-center rounded-lg h-[700px]"
          >
            <img
              src={banner.image.url}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-fit rounded-lg "
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomeBanner;
