const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/BannerController");
const upload = require("../middleware/upload");
// Route to create a new banner
router.post("/", upload.single("image"), bannerController.createBanner);

// Route to get all banners
router.get("/", bannerController.getBanners);

// Route to update a banner
router.put("/:id", upload.single("image"), bannerController.updateBanner);

// Route to delete a banner
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
