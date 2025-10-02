const express = require("express");
const router = express.Router();
const MomoController = require("../controllers/MomoController");

router.post("/payment", MomoController.payment);
router.post("/callback", MomoController.paymentStatus);
router.post("/callback2", MomoController.paymentStatus2);
module.exports = router;
