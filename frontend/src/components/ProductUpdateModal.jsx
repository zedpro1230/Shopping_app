import React, { useEffect, useCallback } from "react";
import { Modal } from "@mui/material";
import axios from "axios";
import { IconContext } from "react-icons/lib";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, MenuItem } from "@mui/material";
import { TiDelete } from "react-icons/ti";
import backendHost from "../config/backendHost";
import Loading from "./Loading";
function ProductUpdateModal({
  open,
  onClose,
  productId,
  categoriesList,
  city,
  onProductUpdated,
}) {
  const [loading, setLoading] = useState(false);
  const posterInputRef = useRef(null);
  const [posters, setPosters] = useState([]);
  const [product, setProduct] = useState(null);

  // get product by id
  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`${backendHost}/products/${productId}`);
      setProduct(response.data.data);
      setPosters(response.data.data.image || []);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct, open]);

  // Form control
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    if (product) {
      console.log("Setting form values with product data:", product);
      setValue("productName", product.title || "");
      setValue("price", product.price || "");
      setValue("category", product.category._id || "");
      setValue("city", product.city || "");
      setValue("discount", product.discount || "");
      setValue("stock", product.stock || "");
      setValue("description", product.description || "");
    }
  }, [product, setValue]);

  useEffect(() => {
    if (product) {
      reset({
        productName: product.title || "",
        price: product.price || "",
        category: product.category?._id || "",
        city: product.city || "",
        discount: product.discount || "",
        stock: product.stock || "",
        description: product.description || "",
      });
    }
  }, [product, reset]);
  const onSubmit = async (data) => {
    const existingImages = posters.filter((poster) => poster.url);
    const newImages = posters.filter((poster) => poster.file);
    console.log("Existing Images:", existingImages);
    console.log("New Images:", newImages);
    const formData = new FormData();
    formData.append("title", data.productName);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("city", data.city);
    formData.append("discount", data.discount);
    formData.append("stock", data.stock);
    formData.append("description", data.description);
    formData.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((img) => {
      formData.append("image", img.file);
    });
    setLoading(true);
    try {
      const response = await axios.put(
        `${backendHost}/products/${productId}`,
        formData
      );
      console.log(response.data);
      onClose();
      setLoading(false);
      onProductUpdated(); // Notify parent to refresh product list
      setPosters([]);
      reset();
    } catch (err) {
      console.log(err.response?.data?.message || "Error updating product");
    }
  };
  // Handle image change
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
  console.log("New posters list:", posters);
  const handleRemovePoster = (index) => {
    const updatedPosters = posters.filter((_, i) => i !== index);
    setPosters(updatedPosters);
    // update react hook form poster
    setTimeout(() => {
      trigger("imagePoster");
    }, 0);
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="bg-white w-[80%] h-[90%]  rounded-2xl flex flex-col items-center justify-start p-6 max-xl:w-[90%]">
          <h2 className="text-2xl font-bold mb-4 text-[#2A4178] max-md:text-xl">
            Sửa sản phẩm
          </h2>
          <div className="w-full flex flex-col items-center h-full overflow-y-scroll p-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-2 h-full "
            >
              <div className="flex flex-row gap-3 max-xl:flex-col">
                <label className="flex flex-col flex-1 font-roboto text-[#2A4178]">
                  <span className="text-[20px] font-bold max-md:text-[16px]">
                    Tên sản phẩm:
                  </span>
                  <input
                    type="text"
                    disabled={loading}
                    defaultValue={product?.title}
                    className="border cursor-pointer border-gray-300 p-2 h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500 max-md:text-[16px] "
                    {...register("productName", {
                      required: "Please enter a product name",
                      maxLength: {
                        value: 50,
                        message: "Product name should not exceed 50 characters",
                      },
                    })}
                  />
                  {errors.productName && (
                    <span className="text-red-500">
                      {errors.productName.message}
                    </span>
                  )}
                </label>
                <label className="flex flex-col flex-1 font-roboto text-[#2A4178]">
                  <span className="text-[20px] font-bold max-md:text-[16px]">
                    Giá sản phẩm:
                  </span>
                  <input
                    type="text"
                    disabled={loading}
                    defaultValue={product?.price}
                    className="border cursor-pointer border-gray-300 p-2 h-[50px] max-md:text-[16px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                    {...register("price", {
                      required: "Please enter a price",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                        message: "Please enter a valid price",
                      },
                    })}
                  />
                  {errors.price && (
                    <span className="text-red-500">{errors.price.message}</span>
                  )}
                </label>
              </div>
              <div className="flex gap-3 max-xl:flex-col">
                <label className="flex flex-col flex-1/4 font-roboto text-[#2A4178]">
                  <span className="text-[20px] font-bold max-md:text-[16px]">
                    Tên danh mục:
                  </span>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Please select a category" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        inputProps={{ "aria-hidden": false }}
                        disabled={loading}
                        value={field.value || ""}
                        className="border cursor-pointer border-gray-300 p-2 max-md:text-[16px] h-[50px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          console.log("Category changed to:", e.target.value);
                        }}
                      >
                        {categoriesList.map((cat) => (
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
                  <span className="text-[20px] font-bold max-md:text-[16px]">
                    Tên thành phố:
                  </span>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: "Please select a city" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        inputProps={{ "aria-hidden": false }}
                        disabled={loading}
                        value={field.value || ""}
                        className="border cursor-pointer border-gray-300 p-2 h-[50px]  max-md:text-[16px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          console.log("City changed to:", e.target.value);
                        }}
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
                  <span className="text-[20px] font-bold max-md:text-[16px]">
                    Giảm giá:
                  </span>
                  <input
                    type="text"
                    disabled={loading}
                    defaultValue={product?.discount}
                    className="border cursor-pointer border-gray-300 p-2 h-[50px] max-md:text-[16px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                    {...register("discount", {
                      required: "Please enter a discount",
                      pattern: {
                        value: /^(100|[1-9][0-9]?|0)$/,
                        message: "Vui lòng nhập số từ 0 đến 100",
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
                  <span className="text-[20px] font-bold max-md:text-[16px]">
                    Số lượng:
                  </span>
                  <input
                    type="text"
                    disabled={loading}
                    defaultValue={product?.stock}
                    className="border cursor-pointer border-gray-300 p-2 h-[50px] max-md:text-[16px] text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                    {...register("stock", {
                      required: "Please enter a stock quantity",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                        message: "Vui lòng nhập số lượng hợp lệ",
                      },
                    })}
                  />
                  {errors.stock && (
                    <span className="text-red-500">{errors.stock.message}</span>
                  )}
                </label>
              </div>

              <label className="flex flex-col font-roboto text-[#2A4178]">
                <span className="text-[20px] font-bold max-md:text-[16px]">
                  Mô tả:
                </span>
                <textarea
                  disabled={loading}
                  defaultValue={product?.description}
                  className="border cursor-pointer border-gray-300 max-md:text-[16px] p-2 h-[200px] resize-none text-[20px] rounded-lg w-full mb-4 text-[#2A4178] focus:outline-none  focus:ring-2 focus:ring-blue-500"
                  {...register("description", {
                    required: "Please enter a description",
                  })}
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
                  </span>
                )}
              </label>
              <label className="flex flex-col font-roboto text-[#2A4178]">
                <span className="text-[20px] font-bold max-md:text-[16px]">
                  Ảnh minh họa:
                </span>
                <div className="border border-gray-300 p-2 gap-3 text-[20px] rounded-lg w-full mb-4 text-[#2A4178] flex flex-col">
                  <input
                    type="file"
                    disabled={loading}
                    accept="image/*"
                    ref={posterInputRef}
                    defaultValue={product?.posters}
                    className="hidden"
                    multiple
                    id="posterInput"
                    {...register("imagePoster", {
                      validate: {
                        minImages: () =>
                          posters.length >= 1 ||
                          "You must upload at least 1 image",
                        maxImages: () =>
                          posters.length <= 5 ||
                          "You can upload maximum 5 images",
                        hasImages: () =>
                          posters.length > 0 ||
                          "Please select at least one image",
                      },
                    })}
                    onChange={(e) => {
                      handleImageChange(e.target.files);
                    }}
                  />
                  <label
                    htmlFor="posterInput"
                    className=" text-[#FF6400] px-4 py-2 rounded cursor-pointer text-center max-md:text-[16px]  font-roboto font-bold "
                  >
                    Tải lên ảnh
                  </label>
                </div>
              </label>
              <div className="flex flex-wrap font-roboto text-[#2A4178] gap-3">
                {posters.map((poster, index) => (
                  <div className="relative" key={index}>
                    <img
                      src={poster.url || poster.preview}
                      alt={`Poster ${index + 1}`}
                      className="h-[200px] w-[200px] object-cover rounded-lg mr-2 mb-2
                      max-md:h-[100px] max-md:w-[100px]"
                    />
                    <IconContext.Provider
                      value={{
                        className:
                          "absolute top-[-10px] right-[-10px] text-red-500 size-[24px] max-md:size-[30px] cursor-pointer",
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
                className="bg-[#FF6400] w-full  place-content-end flex justify-center items-center cursor-pointer text-white px-6 py-2 rounded-lg font-bold hover:bg-[#FF6400]/80 transition-colors"
              >
                {loading ? <Loading /> : "Câp nhật "}
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductUpdateModal;
