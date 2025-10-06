const router = require("express").Router();
const UserController = require("../controllers/UserController");
const multer = require("multer");
const upload = multer();

router.put("/:id", upload.single("image"), UserController.updateUser);
router.get("/:id", UserController.getUser);
router.get("/", UserController.getAllUsers);
module.exports = router;
