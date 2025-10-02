import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function HomeCategory() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-[85%] mx-auto    rounded-lg  relative  flex flex-col items-center ">
      <h2 className=" text-[26px] font-bold font-roboto text-[#424242] mb-8 ">
        Danh mục sản phẩm
      </h2>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-10  mt-2 w-full ">
        {categories.map((category) => (
          <li
            key={category._id}
            className="p-4  bg-white gap-2 border border-[#e5e5e5] shadow-lg rounded-[12px] group flex-col-reverse    flex justify-center items-center
              transition-all cursor-pointer hover:translate-y-[-20px] duration-200"
            onClick={() =>
              navigate(
                `/category/${encodeURIComponent(category.categoryTitle)}`,
                {
                  state: { name: category.categoryTitle },
                }
              )
            }
          >
            <p className="text-xl text-[#424242] font-roboto font-bold text-center  transition-colors duration-200">
              {category.categoryTitle}
            </p>
            <img
              src={category.image.url}
              alt={category.categoryTitle}
              className="w-[100px] h-[100px] object-cover rounded-[50%] mt-2 border-3 border-[#FF6100]  transition-transform duration-200 group-hover:scale-110"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomeCategory;
