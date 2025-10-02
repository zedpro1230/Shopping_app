import React from "react";
import Modal from "@mui/material/Modal";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TiDelete } from "react-icons/ti";
import { IconContext } from "react-icons/lib";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Controller } from "react-hook-form";
import { BiDetail } from "react-icons/bi";
import Loading from "./Loading";
import ProductUpdateModal from "./ProductUpdateModal";
import ProductViewModal from "./ProductViewModal";
import { Pagination } from "@mui/material";
function ProductContent() {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedViewProduct, setSelectedViewProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [city, setCity] = useState([]);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  //   const [posterFile, setPosterFile] = useState(null);
  const posterInputRef = useRef(null);
  // handle categories, city
  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories/");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  };
  const getCity = async () => {
    try {
      const response = await axios.get(
        "https://open.oapi.vn/location/provinces?page=0&size=63&query="
      );
      setCity(response.data.data);
    } catch (error) {
      console.error("Error retrieving cities:", error);
    }
  };
  useEffect(() => {
    getCategories();
    getCity();
  }, []);
  // Get products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/products?page=${currentPage}&limit=10`
      );
      setProducts(response.data.data.items);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error retrieving products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);
  console.log("Total Pages:", totalPages);
  console.log("Current Page:", currentPage);
  // Form control
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: { categoryName: "", city: "", category: "" },
  });

  // handle poster file
  const handleImageChange = (file) => {
    if (file && file.length > 0) {
      const files = Array.from(file);
      const newPoster = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setPosters((prevPosters) => [...prevPosters, ...newPoster]);
      // update react hook form poster
      setTimeout(() => {
        trigger("imagePoster");
      }, 0);
    }
  };
  const handleRemovePoster = (index) => {
    setPosters((prevPosters) => prevPosters.filter((_, i) => i !== index));
    setTimeout(() => {
      trigger("imagePoster");
    }, 0);
  };
  useEffect(() => {
    console.log(posters);
  }, [posters]);
  // handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("title", data.categoryName);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("stock", data.stock);
    formData.append("city", data.city);
    formData.append("discount", data.discount);
    posters.forEach((poster) => {
      formData.append("image", poster.file);
    });
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/products",
        formData
      );
      console.log(response.data);
      setOpen(false);
      setLoading(false);
      setPosters([]);
      reset();
      fetchProducts();
    } catch (err) {
      console.log(err.response?.data?.message || "Error adding product");
    }
  };
  // // handle delete product
  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/products/${productId}`
      );
      console.log("Product deleted:", response.data);
      // Refresh the product list after deletion
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center gap-2">
        <h1 className="text-2xl font-bold font-roboto text-[#424242]">
          Quản lý sản phẩm
        </h1>
        ,
        <div className="flex gap-5">
          <div className="flex items-center gap-2 text-[#424242]">
            <span className="bg-gray-200 px-5 py-1 rounded-[25px] font-semibold font-roboto">
              Bảng điều khiển
            </span>
            <span className="font-roboto"> / </span>
            <span className="bg-gray-200 px-5 py-1 rounded-[25px] font-semibold font-roboto">
              Sản phẩm
            </span>
          </div>
          <button
            className="bg-[#FF6100] text-white p-4 font-bold font-roboto rounded-[12px] cursor-pointer hover:bg-[#FF6F00] transition-colors"
            onClick={() => setOpen(true)}
          >
            Thêm sản phẩm mới
          </button>
        </div>
      </div>
      <div className="w-full bg-white rounded-lg  pb-4 mt-4 border border-gray-200 shadow-md overflow-x-scroll">
        {products.length > 0 ? (
          <table className="w-full bg-white  rounded-[16px]     shadow-xs">
            <thead className="p-2 bg-[#FFFFF0] text-[#424242] ">
              <tr>
                <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                  Ảnh nền
                </th>
                <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                  Tên sản phẩm
                </th>
                <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                  Danh mục
                </th>
                <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                  Giá tiền
                </th>
                <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                  Tồn kho
                </th>
                <th className=" text-2xl text-left  h-[100px] pl-4 font-roboto">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="text-[#222222] ">
              {products.map((product, index) => (
                <tr
                  className={`odd:bg-[#F6F1E9] even:bg-[#F9F5F0] ${
                    index === 0 ? "first:rounded-t-[16px]" : ""
                  } ${
                    index === products.length - 1 ? "last:rounded-b-[16px]" : ""
                  }`}
                  key={product._id}
                >
                  <td className=" h-[200px] p-4 ">
                    <img
                      src={product.image[0].url || ""}
                      alt={product.image[0].publicId}
                      className="h-[100px] object-cover w-[100px] rounded-lg"
                    />
                  </td>
                  <td
                    className=" h-[200px] p-4 text-xl font-roboto font-semibold
                  overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] text-[#424242]"
                  >
                    {product.title}
                  </td>
                  <td className=" h-[200px] p-4 text-xl font-roboto font-semibold text-[#424242]">
                    {product.category.categoryTitle}
                  </td>
                  <td className=" h-[200px] p-4 text-xl font-roboto font-semibold text-[#424242]">
                    {product.discount === 0 ? (
                      <span>{product.price.toLocaleString("de-DE")}</span>
                    ) : (
                      <div className="flex  gap-2 flex-col">
                        <span className="  font-bold ml-2 text-xl text-[#FF6F00]">
                          {Math.round(
                            product.price -
                              (product.price * product.discount) / 100
                          ).toLocaleString("de-DE")}
                        </span>
                        <span className="line-through text-black/50 ml-2 text-[18px]">
                          {product.price.toLocaleString("de-DE")}
                        </span>
                        <span className="ml-2 w-[fit-content] bg-[#FF6F00]/50 rounded-[8px] text-white px-3 py-2 text-[14px] font-semibold">
                          - {product.discount}%
                        </span>
                      </div>
                    )}
                  </td>
                  <td className=" h-[200px] p-4 text-[22px] font-semibold">
                    {product.stock < 30 ? (
                      <span className="bg-red-100 text-red-600 px-2 py-2 rounded text-[18px] font-roboto">
                        Sắp hết ({product.stock})
                      </span>
                    ) : product.stock > 200 ? (
                      <span className="bg-green-100 text-green-600 px-2 py-2 rounded text-[18px] font-roboto">
                        Dồi dào ({product.stock})
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-600 px-2 py-2 rounded text-[18px] font-roboto">
                        {product.stock} còn lại
                      </span>
                    )}
                  </td>
                  <td className=" h-[200px] pl-4">
                    <div className="flex gap-3">
                      <button
                        className="cursor-pointer bg-[#5EABD6]/30 p-4 text-[#5EABD6] rounded-lg flex items-center gap-2 font-roboto font-semibold
                        hover:bg-[#5EABD6]/50 transition-colors"
                        onClick={() => {
                          setOpenUpdate(true);
                          setSelectedProductId(product._id);
                        }}
                      >
                        Cập nhật
                        <IconContext.Provider
                          value={{ className: "size-[20px] fill-[#5EABD6]" }}
                        >
                          <FaEdit />
                        </IconContext.Provider>
                      </button>
                      <button
                        className="cursor-pointer bg-[#E14434]/30 p-4 text-[#E14434] rounded-lg flex items-center gap-2 font-roboto font-semibold
                        hover:bg-[#E14434]/50 transition-colors"
                        onClick={() => handleDelete(product._id)}
                      >
                        Xóa
                        <IconContext.Provider
                          value={{ className: "size-[20px] fill-[#E14434]" }}
                        >
                          <MdDeleteForever />
                        </IconContext.Provider>
                      </button>
                      <button
                        className="cursor-pointer bg-blue-500/30 p-4 text-blue-500 rounded-lg flex items-center gap-2 font-roboto font-semibold
                        hover:bg-blue-500/50 transition-colors"
                        onClick={() => {
                          setOpenView(true);

                          setSelectedViewProduct(product._id);
                        }}
                      >
                        Chi tiết
                        <IconContext.Provider
                          value={{ className: "size-[20px] fill-blue" }}
                        >
                          <BiDetail />
                        </IconContext.Provider>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No banners available</p>
          </div>
        )}
        <div className="w-full flex justify-end mt-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            shape="rounded"
            size="large"
            onChange={(event, page) => setCurrentPage(page)}
          />
        </div>
      </div>
      {/* modal add product */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="bg-white w-[80%] h-[90%]  rounded-2xl flex flex-col items-center justify-start p-6 ">
          <h2 className="text-2xl font-bold mb-4 text-[#2A4178]">
            Sản phẩm mới
          </h2>
          <div className="w-full flex flex-col items-center h-full overflow-y-scroll p-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-2 h-full "
            >
              <div className="flex flex-row gap-3 ">
                <label className="flex flex-col flex-1 font-roboto text-[#2A4178]">
                  <span className="text-[20px] font-bold">Tên sản phẩm:</span>
                  <input
                    type="text"
                    disabled={loading}
                    className="border cursor-pointer border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                    {...register("categoryName", {
                      required: "xin vui lòng nhập tên sản phẩm",
                      maxLength: {
                        value: 50,
                        message: "Tên sản phẩm không được vượt quá 50 ký tự",
                      },
                    })}
                  />
                  {errors.categoryName && (
                    <span className="text-red-500">
                      {errors.categoryName.message}
                    </span>
                  )}
                </label>
                <label className="flex flex-col flex-1 font-roboto text-[#2A4178]">
                  <span className="text-[20px] font-bold">Giá thành:</span>
                  <input
                    type="text"
                    disabled={loading}
                    className="border cursor-pointer border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                    {...register("price", {
                      required: "xin vui lòng nhập giá thành",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                        message: "xin vui lòng nhập giá thành hợp lệ",
                      },
                    })}
                  />
                  {errors.price && (
                    <span className="text-red-500">{errors.price.message}</span>
                  )}
                </label>
              </div>
              <div className="flex gap-3">
                <label className="flex flex-col flex-1/4 font-roboto text-[#2A4178]">
                  <span className="text-[20px] font-bold">Tên danh mục:</span>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Xin vui lòng chọn danh mục" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        disabled={loading}
                        defaultValue=""
                        className="border cursor-pointer border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map((cat) => (
                          <MenuItem
                            className="rounded-lg hover:bg-blue-400"
                            key={cat._id}
                            value={cat._id}
                          >
                            {cat.categoryTitle}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <span className="text-red-500">
                      {errors.category.message}
                    </span>
                  )}
                </label>
                <label className="flex flex-col flex-1/4 font-roboto text-[#2A4178]">
                  <span className="text-[20px] font-bold">Nơi bán:</span>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: "Xin vui lòng chọn nơi bán" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        disabled={loading}
                        defaultValue=""
                        className="border cursor-pointer border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {city.map((ct) => (
                          <MenuItem
                            className="rounded-lg hover:bg-blue-400"
                            key={ct.id}
                            value={ct.name}
                          >
                            {ct.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.city && (
                    <span className="text-red-500">{errors.city.message}</span>
                  )}
                </label>
                <label className="flex flex-col flex-1/4 font-roboto text-[#2A4178]">
                  <span className="text-[20px] font-bold">Giảm giá:</span>
                  <input
                    type="text"
                    disabled={loading}
                    className="border cursor-pointer border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                    {...register("discount", {
                      required: "Xin vui lòng nhập giảm giá",
                      pattern: {
                        value: /^(100|[1-9][0-9]?|0)$/,
                        message: "Xin vui lòng nhập giảm giá hợp lệ từ (1-100)",
                      },
                    })}
                  />
                  {errors.discount && (
                    <span className="text-red-500">
                      {errors.discount.message}
                    </span>
                  )}
                </label>
                <label className="flex flex-col flex-1/4 font-roboto text-[#2A4178]">
                  <span className="text-[20px] font-bold">Số lượng:</span>
                  <input
                    type="text"
                    disabled={loading}
                    className="border cursor-pointer border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                    {...register("stock", {
                      required: "Xin vui lòng nhập số lượng",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                        message: "Xin vui lòng nhập số lượng hợp lệ",
                      },
                    })}
                  />
                  {errors.stock && (
                    <span className="text-red-500">{errors.stock.message}</span>
                  )}
                </label>
              </div>

              <label className="flex flex-col font-roboto text-[#2A4178]">
                <span className="text-[20px] font-bold">Mô tả:</span>
                <textarea
                  disabled={loading}
                  className="border cursor-pointer border-gray-300 p-2 h-[200px] resize-none text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                  {...register("description", {
                    required: "Xin vui lòng nhập mô tả",
                  })}
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
                  </span>
                )}
              </label>
              <label className="flex flex-col font-roboto text-[#2A4178]">
                <span className="text-[20px] font-bold">Ảnh sản phẩm:</span>
                <div className="border border-gray-300 p-2 gap-3 text-[20px] rounded-lg w-full mb-4 text-[#2A4178] flex flex-col">
                  <input
                    type="file"
                    disabled={loading}
                    accept="image/*"
                    ref={posterInputRef}
                    className="hidden"
                    multiple
                    id="posterInput"
                    {...register("imagePoster", {
                      validate: {
                        minImages: () =>
                          posters.length >= 1 ||
                          "Bạn phải tải lên ít nhất 1 hình ảnh",
                        maxImages: () =>
                          posters.length <= 5 ||
                          "Bạn có thể tải lên tối đa 5 hình ảnh",
                        hasImages: () =>
                          posters.length > 0 ||
                          "Xin vui lòng chọn ít nhất một hình ảnh",
                      },
                    })}
                    onChange={(e) => {
                      handleImageChange(e.target.files);
                    }}
                  />
                  <label
                    htmlFor="posterInput"
                    className=" text-blue-500 px-4 py-2 rounded cursor-pointer text-center  font-roboto font-bold "
                  >
                    Tải lên ảnh
                  </label>
                </div>
              </label>
              <div className="flex flex-wrap font-roboto text-[#2A4178]">
                {posters.map((poster, index) => (
                  <div className="relative" key={index}>
                    <img
                      src={poster.preview}
                      alt={`Poster ${index + 1}`}
                      className="h-[200px] w-[200px] object-cover rounded-lg mr-2 mb-2"
                    />
                    <IconContext.Provider
                      value={{
                        className:
                          "absolute top-0 right-0 text-red-500 size-[24px]",
                      }}
                    >
                      <TiDelete onClick={() => handleRemovePoster(index)} />
                    </IconContext.Provider>
                  </div>
                ))}
              </div>
              {errors.imagePoster && (
                <span className="text-red-500">
                  {errors.imagePoster.message}
                </span>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 w-full cursor-pointer place-content-end flex justify-center items-center  text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                {loading ? <Loading /> : "Thêm sản phẩm"}
              </button>
            </form>
          </div>
        </div>
      </Modal>
      {/* modal update product */}
      {selectedProductId && (
        <ProductUpdateModal
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
          productId={selectedProductId}
          categoriesList={categories}
          city={city}
          onProductUpdated={fetchProducts}
        />
      )}
      {/* modal view product */}
      {selectedViewProduct && (
        <ProductViewModal
          open={openView}
          onClose={() => setOpenView(false)}
          productId={selectedViewProduct}
        />
      )}
    </div>
  );
}

export default ProductContent;
