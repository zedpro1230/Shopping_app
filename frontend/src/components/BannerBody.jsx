import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IconContext } from "react-icons/lib";
import { useEffect } from "react";
import { useBanners } from "../context/BannerContext";
import { TiDeleteOutline } from "react-icons/ti";
import Loading from "./Loading";
import { useState, useRef } from "react";
import Modal from "@mui/material/Modal";
function BannerBody() {
  const { banners, fetchBanners, deleteBanner } = useBanners();
  const [open, setOpen] = useState(false);
  const [imageId, setImageId] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateBanner } = useBanners();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleModalData = (id) => {
    setOpen(true);
    const selectedBanner = banners.find((banner) => banner._id === id);
    if (selectedBanner) {
      setImageId(selectedBanner._id);
      setImage(selectedBanner.image.url);
      setSelectedFile(selectedBanner.image);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("handle image change", file); // Store the actual file
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
      fileInputRef.current.value = null;
    }
  };
  const handleSubmit = async (id) => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      await updateBanner(id, formData);
      setOpen(false);
      setLoading(false);
      clearImage();
    } catch {
      alert("Error updating banner. Please try again.");
    }
  };
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Error deleting banner. Please try again.");
    }
  };
  return (
    <div>
      {banners.length > 0 ? (
        <table className="w-full bg-white mt-4 rounded-[16px] border-collapse border border-gray-400 text-[#424242] overflow-hidden shadow-xs">
          <thead className="p-2 bg-[#FFFFF0]">
            <tr>
              <th className=" text-2xl font-bold text-left w-[30%] h-[100px] pl-4 font-roboto text-[#424242]">
                Banners
              </th>
              <th className=" text-2xl font-bold  text-left w-[70%] h-[100px] pl-4 font-roboto text-[#424242]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, idx) => (
              <tr
                className={`odd:bg-[#F6F1E9] even:bg-[#F9F5F0] ${
                  idx === 0 ? "first:rounded-t-[16px]" : ""
                } ${idx === banners.length - 1 ? "last:rounded-b-[16px]" : ""}`}
                key={banner._id}
              >
                <td className=" h-[200px] p-4">
                  <img
                    src={banner.image.url}
                    alt={banner.image.publicId}
                    className="h-[350px] object-cover w-full rounded-lg"
                  />
                </td>
                <td className=" h-[200px] pl-4">
                  <div className="flex gap-2">
                    <button
                      className="cursor-pointer bg-[#5EABD6]/30 p-4 text-[#5EABD6] rounded-lg flex items-center gap-2 font-roboto font-semibold
                        hover:bg-[#5EABD6]/50 transition-colors"
                      onClick={() => handleModalData(banner._id)}
                    >
                      Cập nhật
                      <IconContext.Provider
                        value={{ className: "size-[30px] fill-[#5EABD6]" }}
                      >
                        <FaEdit />
                      </IconContext.Provider>
                    </button>
                    <button
                      className="cursor-pointer bg-[#E14434]/30 p-4 text-[#E14434] rounded-lg flex items-center gap-2 font-roboto font-semibold
                        hover:bg-[#E14434]/50 transition-colors"
                      onClick={() => handleDelete(banner._id)}
                    >
                      Xóa
                      <IconContext.Provider
                        value={{ className: "size-[30px] fill-[#E14434]" }}
                      >
                        <MdDeleteForever />
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="bg-white w-[600px]  rounded-2xl flex flex-col items-center justify-start p-6">
          <h2 className="text-2xl font-bold mb-4">cập nhật banner</h2>
          <div className="w-full flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="mb-4 border border-gray-300 p-2 rounded-lg w-full"
            />

            <div className="mb-4 w-full relative">
              <img
                alt="Preview"
                src={image}
                className="w-full h-[500px] rounded-lg object-cover"
              />
              <button
                type="button"
                className="mt-2 absolute right-0 top-0 z-30 cursor-pointer"
                onClick={clearImage}
              >
                <IconContext.Provider
                  value={{ className: "size-[40px] fill-gray-500" }}
                >
                  <TiDeleteOutline />
                </IconContext.Provider>
              </button>
            </div>

            <button
              className="bg-[#FF6F00] w-full flex justify-center items-center cursor-pointer text-white px-6 py-2 rounded-lg font-bold hover:bg-[#FF8F00] transition-colors"
              onClick={() => handleSubmit(imageId)}
            >
              {loading ? <Loading /> : "Cập nhật"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BannerBody;
