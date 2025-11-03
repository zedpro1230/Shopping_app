import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import { useSelector, useDispatch } from "react-redux";
import { storeUserInfo } from "../features/counters/cartSlice";
import { FaEdit } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import backendHost from "../config/backendHost";
import { useNavigate } from "react-router-dom";
function UserDetail() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.cart.userInfo);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [avatar, setAvatar] = useState(
    userInfo?.avatar?.url || userInfo?.avatar || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);
  console.log(userInfo);
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the actual file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Store the data URL for preview
      };
      reader.readAsDataURL(file);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    if (selectedFile) {
      formData.append("image", selectedFile); // Send the actual file, not the base64 string
    }
    try {
      const response = await axios.put(
        `${backendHost}/users/${userInfo._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("User updated successfully:", response.data);
      setLoading(false);
      fetchUserData();

      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${backendHost}/users/${userInfo._id}`);
      dispatch(storeUserInfo(response.data.user));
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  return (
    <div className="flex items-center justify-center bg-[#f4f2ee] min-h-screen  p-4 max-md:p-0">
      <div className="bg-white rounded-lg w-[30%]  mx-auto shadow-md flex   flex-col gap-4 max-xl:w-[90%] max-md:mx-[0px]">
        <div className="bg-[#FF6A00]/80 h-[200px] rounded-t-lg relative w-full">
          <div
            className="absolute translate-y-[40%] left-[20px]  flex flex-col items-start gap-2 justify-center w-[90%]
          max-md:translate-y-[80%] max-md:left-[10px]"
          >
            <div className="border-3 border-white rounded-full overflow-hidden">
              <img
                src={
                  userInfo?.avatar.url ||
                  userInfo?.avatar ||
                  "https://static.vecteezy.com/system/resources/thumbnails/011/490/381/small_2x/happy-smiling-young-man-avatar-3d-portrait-of-a-man-cartoon-character-people-illustration-isolated-on-white-background-vector.jpg"
                }
                alt="User Avatar"
                referrerPolicy="no-referrer"
                className="h-[150px] w-[150px] rounded-full  max-md:h-[100px] max-md:w-[100px] object-cover "
              />
            </div>
            <div className="flex  gap-1 justify-between items-center w-full max-md:flex-col max-md:items-start">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold font-roboto text-[#424242]">
                  {userInfo?.name}
                </p>
                <p className="text-sm font-medium font-roboto text-gray-500 ">
                  {userInfo?.email}
                </p>
              </div>

              <button
                className="bg-[#FF6A00]/80 text-white cursor-pointer px-4 py-2 rounded-[25px] 
          flex items-center gap-2  hover:bg-[#FF6A00] transition-colors duration-200"
                onClick={handleOpen}
              >
                <IconContext.Provider
                  value={{
                    className: "size-[20px] fill-white",
                  }}
                >
                  <FaEdit />
                </IconContext.Provider>
                cập nhật thông tin
              </button>
            </div>
          </div>
        </div>
        <div className="mt-[130px] px-[20px] flex flex-col gap-4  max-md:mt-[200px]">
          <div className="w-full rounded-lg border-1 p-5 border-gray-300 relative">
            <span className="w-max bg-white absolute -top-3 left-4 px-2">
              Tên
            </span>
            <p className="text-lg font-semibold font-roboto text-[#424242]">
              {userInfo?.name}
            </p>
          </div>

          <div className="w-full rounded-lg border-1 p-5 border-gray-300 relative break-all">
            <span className=" bg-white absolute -top-3 left-4 px-2 ">
              Email
            </span>
            <p className="text-lg font-semibold font-roboto text-[#424242]">
              {userInfo?.email}
            </p>
          </div>
          <div className="w-full rounded-lg border-1 p-5 border-gray-300 relative">
            <span className="w-max bg-white absolute -top-3 left-4 px-2">
              Cấp độ
            </span>
            <p className="text-lg font-semibold font-roboto text-[#424242]">
              {userInfo?.role}
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between px-[20px] mb-5 max-md:flex-col max-md:gap-4 max-md:items-start">
          <div className="rounded-lg flex   py-2">
            <p className="text-lg font-semibold font-roboto text-[#424242]">
              Trạng thái:{" "}
              <span className="text-green-500 font-semibold">
                Đang hoạt động
              </span>
            </p>
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
            <div className="bg-white p-4 rounded-lg shadow-lg outline-none w-[30%] flex flex-col items-center max-xl:w-[90%]">
              <h2 className="text-xl text-[#424242] font-bold font-roboto">
                Cập nhật thông tin
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center gap-2"
              >
                <label
                  className="flex flex-col items-center justify-center mt-4 w-[200px] rounded-[50%] cursor-pointer h-[200px] border-2 border-dashed border-gray-300"
                  htmlFor="avatar-upload"
                >
                  <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />

                  <img
                    src={avatar}
                    alt="User Avatar..."
                    referrerPolicy="no-referrer"
                    className="h-[200px] w-[200px] rounded-[50%] object-cover max-xl:h-[150px] max-xl:w-[150px]"
                  />
                </label>
                <label className="mt-4 w-full">
                  <span className="text-lg font-roboto text-[#424242]">
                    Tên
                  </span>
                  <input
                    type="text"
                    defaultValue={userInfo?.name}
                    className="border border-gray-300 rounded-md p-2 w-full "
                    {...register("name", { required: "Tên là bắt buộc" })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </label>
                <label className="mt-4 w-full">
                  <span className="text-lg font-roboto text-[#424242]">
                    Email
                  </span>
                  <input
                    type="email"
                    defaultValue={userInfo?.email}
                    disabled
                    className="border border-gray-300 rounded-md p-2 w-full bg-gray-300/50 cursor-not-allowed"
                    {...register("email", { required: "Email là bắt buộc" })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </label>
                <label className="mt-4 w-full">
                  <span className="text-lg font-roboto text-[#424242]">
                    Loại tài khoản
                  </span>
                  <input
                    type="text"
                    defaultValue={userInfo?.role}
                    disabled
                    className="border border-gray-300 rounded-md p-2 w-full bg-gray-300/50 cursor-not-allowed"
                    {...register("role", {
                      required: "Loại tài khoản là bắt buộc",
                    })}
                  />
                  {errors.role && (
                    <p className="text-red-500 text-sm">
                      {errors.role.message}
                    </p>
                  )}
                </label>
                <button
                  type="submit"
                  className="bg-[#FF6A00]/80 text-white text-lg px-4 py-2 rounded-md mt-4 w-full 
                hover:bg-[#FF6A00] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loading /> : "Cập nhật"}
                </button>
              </form>
            </div>
          </Modal>
          <p
            className="text-lg font-medium text-gray-500 hover:underline cursor-pointer hover:text-[#FF6A00]"
            onClick={() => navigate(-1)}
          >
            Quay về trang trước
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
