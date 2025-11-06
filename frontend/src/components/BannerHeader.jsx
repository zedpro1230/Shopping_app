import Modal from "@mui/material/Modal";
import { TiDeleteOutline } from "react-icons/ti";
import { IconContext } from "react-icons/lib";
import { useState, useRef } from "react";
import Loading from "./Loading";
import { useBanners } from "../context/BannerContext";
import { LuUpload } from "react-icons/lu";

function BannerHeader() {
  const { addBanner } = useBanners();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleImageChange = (file) => {
    if (file) {
      setSelectedFile(file); // Store the actual file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store base64 for preview
      };
      reader.readAsDataURL(file);
    }
  };
  const clearImage = () => {
    setImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the file input
    }
  };
  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile); // Use the actual file with correct field name
    try {
      await addBanner(formData);
      setOpen(false);
      clearImage();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error uploading banner. Please try again.");
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center max-xl:flex-col">
        <h1 className="text-2xl font-bold font-roboto text-[#424242] max-md:text-xl">
          Danh sách hình ảnh Banner
        </h1>
        ,
        <div className="flex gap-5 max-xl:flex-col max-xl:items-center">
          <div className="flex items-center gap-2 text-[#424242]">
            <span className="bg-gray-200 px-5 py-1 rounded-[25px] font-semibold font-roboto max-md:text-[16px]">
              Trang Chủ
            </span>
            <span className="font-roboto"> / </span>
            <span className="bg-gray-200 px-5 py-1 text-[#424242] rounded-[25px] font-semibold font-roboto max-md:text-[16px]">
              Banner
            </span>
          </div>
          <button
            className="bg-[#FF6F00] text-white p-4 font-bold font-roboto rounded-[12px] max-md:text-[16px] cursor-pointer hover:bg-[#FF8F00] transition-colors"
            onClick={handleOpen}
          >
            Tạo Banner
          </button>
        </div>
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
        <div
          className="bg-white w-[600px]  rounded-2xl flex flex-col items-center justify-start p-6
        max-md:w-[90%] "
        >
          <h2 className="text-2xl font-bold mb-4 text-[#2A4178] font-roboto">
            Tải Ảnh Banner
          </h2>
          <div className="w-full flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className={`w-full mb-4 text-center h-[500px] border border-dashed 
              border-gray-300 p-2 rounded-lg flex flex-col justify-center items-center cursor-pointer
              ${image ? "hidden" : ""} max-md:h-[300px]`}
            >
              <IconContext.Provider
                value={{
                  className: "size-[50px]  mb-4 text-[#2A4178] animate-bounce",
                }}
              >
                <LuUpload />
              </IconContext.Provider>
              <span className="text-gray-500">
                Chọn Ảnh Banner từ máy tính của bạn
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              hidden
              onChange={(e) => handleImageChange(e.target.files[0])}
              ref={fileInputRef}
              className=""
            />
            {image !== null && (
              <div className="mb-4 w-full relative">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-[500px] rounded-lg object-cover max-md:h-[300px]"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="mt-2 absolute right-0 top-0 z-30 cursor-pointer"
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
              className="bg-[#FF6F00] w-full flex justify-center items-center cursor-pointer text-white px-6 py-2 rounded-lg font-bold hover:bg-[#FF8F00] transition-colors"
            >
              {loading ? <Loading /> : "Tải lên"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BannerHeader;
