const banner = require("../models/Banner");
const cloudinary = require("../../config/data/cloudinary");

class BannerController {
  async createBanner(req, res) {
    try {
      const bannerImage = req.file;
      if (!bannerImage) {
        return res.status(400).json({ message: "Banner image is required" });
      }
      let uploadedBannerImage;
      try {
        uploadedBannerImage = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "banners" }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  publicId: result.public_id,
                  url: result.secure_url,
                });
              }
            })
            .end(bannerImage.buffer);
        });
      } catch (error) {
        console.error("Error uploading banner image:", error);
        return res
          .status(500)
          .json({ message: "Error uploading banner image" });
      }

      const newBanner = await banner.create({
        image: uploadedBannerImage,
      });
      return res.status(201).json({
        message: "Banner created successfully",
        data: newBanner,
      });
    } catch (error) {
      console.error("Error creating banner:", error);
      return res.status(500).json({ message: "Error while creating banner" });
    }
  }
  async getBanners(req, res) {
    try {
      const banners = await banner.find().sort({ _id: -1 });
      return res.status(200).json({
        message: "Banners retrieved successfully",
        data: banners,
      });
    } catch (error) {
      console.error("Error retrieving banners:", error);
      return res
        .status(500)
        .json({ message: "Error while retrieving banners" });
    }
  }
  async updateBanner(req, res) {
    try {
      const bannerId = req.params.id;
      // Find existing banner
      const existingBanner = await banner.findById(bannerId);
      if (!existingBanner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      let updatedImageData = existingBanner.image; // Keep existing image by default
      console.log("Existing image data:", existingBanner.image);
      // Handle new image upload if provided
      console.log("New image data:", req.file);
      if (req.file) {
        try {
          // Upload single file
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "banners",
                },
                (error, result) => {
                  if (error) {
                    console.error("Upload error:", error);
                    reject(error);
                  } else {
                    console.log("Image uploaded:", result.secure_url);
                    resolve({
                      publicId: result.public_id,
                      url: result.secure_url,
                    });
                  }
                }
              )
              .end(req.file.buffer);
          });

          // Delete old image from cloudinary if it exists
          if (existingBanner.image && existingBanner.image.publicId) {
            try {
              await cloudinary.uploader.destroy(existingBanner.image.publicId);
              console.log("Old image deleted from cloudinary");
            } catch (deleteError) {
              console.error("Error deleting old image:", deleteError);
            }
          }
          console.log("New image uploaded:", uploadResult);
          updatedImageData = uploadResult;
        } catch (error) {
          console.error("Error uploading new banner image:", error);
          return res.status(500).json({
            message: "Error uploading banner image",
            details: error.message,
          });
        }
      }

      // Update banner with new data

      const updatedBanner = await banner.findByIdAndUpdate(
        bannerId,
        { image: updatedImageData },
        { new: true }
      );

      console.log("✅ Banner updated successfully");

      return res.status(200).json({
        success: true,
        message: "Banner updated successfully",
        data: updatedBanner,
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      return res.status(500).json({
        message: "Error while updating banner",
        details: error.message,
      });
    }
  }
  async deleteBanner(req, res) {
    try {
      const bannerId = req.params.id;
      const bannerImage = await banner.findById(bannerId);
      if (!bannerImage) {
        return res.status(404).json({ message: "Banner not found" });
      }

      // Delete image from cloudinary
      if (bannerImage.image && bannerImage.image.publicId) {
        await cloudinary.uploader.destroy(bannerImage.image.publicId);
        console.log("Old image deleted from cloudinary");
      }

      await banner.findByIdAndDelete(bannerId);
      return res.status(200).json({ message: "Banner deleted successfully" });
    } catch (error) {
      console.error("Error deleting banner:", error);
      return res.status(500).json({ message: "Error while deleting banner" });
    }
  }
}
module.exports = new BannerController();
