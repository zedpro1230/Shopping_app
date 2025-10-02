import { TiDeleteOutline } from "react-icons/ti";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import { useItemsContext } from "../context/Itemscontext";
import { MdDeleteForever } from "react-icons/md";
import { IconContext } from "react-icons/lib";
import { LuUpload } from "react-icons/lu";
import backendHost from "../config/backendHost";
function CategoryContent() {
  const [open, setOpen] = useState(false);
  const { categories, setCategories } = useItemsContext();
  // const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const getCategories = async () => {
    try {
      const response = await axios.get(`${backendHost}/categories/`);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async () => {
    if (categoryName.trim() === "") {
      alert("Please enter a category name!");
      return;
    }
    const formData = new FormData();
    formData.append("categoryTitle", categoryName);
    formData.append("image", image);
    try {
      const response = await axios.post(
        `${backendHost}/categories/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCategoryName("");
      setImage(null);
      handleClose();
      getCategories();
      return response.data;
    } catch (error) {
      alert(error.response?.data?.message || "Error creating category");
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendHost}/categories/${id}`);
      getCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting category");
    }
  };
  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center font-roboto">
        <h1 className="text-2xl font-bold font-roboto text-[#2A4178]">
          Quản lý danh mục
        </h1>
        ,
        <div className="flex gap-5">
          <div className="flex items-center gap-2 text-[#2A4178]">
            <span className="bg-gray-200 px-5 py-1 rounded-[25px] font-semibold font-roboto">
              Bảng điều khiển
            </span>
            <span className="font-roboto"> / </span>
            <span className="bg-gray-200 px-5 py-1 rounded-[25px] font-semibold font-roboto">
              Danh mục
            </span>
          </div>
          <button
            className="bg-blue-500 text-white p-4 font-bold font-roboto rounded-[12px] cursor-pointer hover:bg-blue-600 transition-colors"
            onClick={() => {
              handleOpen();
            }}
          >
            Thêm danh mục mới
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md  mt-4 p-4 gap-5  grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] ">
        {categories.map((category) => (
          <div
            key={category._id}
            className={`p-4 border border-gray-200  shadow-md rounded-lg  min-w-[300px]  bg-gradient-to-r from-[#F8FAFF] to-transparent flex justify-between items-center
            transition-transform duration-300 hover:translate-y-[-5px]`}
          >
            <div className="flex items-center gap-4 flex-col">
              <p className="text-[20px] font-roboto font-bold text-[#222222]">
                {category.categoryTitle}
              </p>
              <img
                src={category.image?.url}
                alt={category.categoryTitle}
                className="w-[100px] h-[100px] rounded-[50%] object-cover"
              />
            </div>

            <span onClick={() => handleDelete(category._id)}>
              <IconContext.Provider
                value={{
                  className:
                    "fill-[#2A4178] cursor-pointer size-[40px] transition-colors ease-in-out duration-300 hover:fill-[#FB4141]",
                }}
              >
                <MdDeleteForever />
              </IconContext.Provider>
            </span>
          </div>
        ))}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="bg-white w-[600px]  rounded-2xl flex flex-col items-center justify-start p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#2A4178]">
            Danh mục mới
          </h2>
          <div className="w-full flex flex-col items-center">
            <input
              type="text"
              placeholder="Tên danh mục vd: Áo, Quần, Váy..."
              onChange={(e) => setCategoryName(e.target.value)}
              className="border border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="category-image"
              className={`mb-2 text-[#2A4178] w-[200px] h-[200px] 
            flex flex-col justify-center items-center border-2 border-dashed border-gray-300 
            rounded-lg cursor-pointer hover:border-blue-500 transition-colors
            ${image ? "hidden" : ""}`}
            >
              <IconContext.Provider
                value={{
                  className: "size-[50px]  mb-4 text-[#2A4178] animate-bounce",
                }}
              >
                <LuUpload />
              </IconContext.Provider>
            </label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="mb-4 hidden"
              id="category-image"
            />
            {image !== null && (
              <div className="mb-4 w-[200px] relative flex justify-center">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-[200px] h-[200px] rounded-lg object-cover"
                />
                <button
                  type="button"
                  className="mt-2 absolute right-0 top-0 z-30 cursor-pointer"
                  onClick={() => setImage(null)}
                >
                  <IconContext.Provider
                    value={{ className: "size-[40px] fill-gray-500" }}
                  >
                    <TiDeleteOutline />
                  </IconContext.Provider>
                </button>
              </div>
            )}
            <button
              onClick={() => handleSubmit()}
              className="bg-blue-500 w-full flex justify-center items-center cursor-pointer text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
            >
              Thêm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CategoryContent;
