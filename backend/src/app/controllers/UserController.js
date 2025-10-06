const User = require("../models/User");
const cloudinary = require("../../config/data/cloudinary");
class UserController {
  async updateUser(req, res) {
    const userId = req.params.id;
    const { name } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      let oldAvatar = user.avatar;
      if (req.file) {
        try {
          const newAvatar = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "avatars" }, (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve({
                    publicId: result.public_id,
                    url: result.secure_url,
                  });
                }
              })
              .end(req.file.buffer);
          });
          // Xoá ảnh cũ trên Cloudinary nếu trùng
          if (oldAvatar && oldAvatar.publicId) {
            try {
              await cloudinary.uploader.destroy(oldAvatar.publicId);
            } catch (err) {
              console.error("Lỗi khi xoá ảnh cũ trên Cloudinary:", err);
            }
          }
          oldAvatar = newAvatar;
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Lỗi khi tải ảnh lên Cloudinary" });
        }
      }

      const updatedData = {
        name: name,
        avatar: oldAvatar,
      };
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });
      res
        .status(200)
        .json({ message: "Cập nhật người dùng thành công", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật người dùng", error });
    }
  }
  async getUser(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.findById(
        userId,
        " -password -__v -createdAt -updatedAt"
      );
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      res.status(200).json({ user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy thông tin người dùng", error });
    }
  }
  async getAllUsers(req, res) {
    try {
      const users = await User.find(
        {},
        " -password -__v -createdAt -updatedAt"
      );
      res.status(200).json({ users });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách người dùng", error });
    }
  }
}
module.exports = new UserController();
