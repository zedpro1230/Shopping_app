const express = require("express");
const router = express.Router();
const commentController = require("../controllers/CommentController");

router.post("/", commentController.createComment);
router.get("/:productId", commentController.getComments);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
