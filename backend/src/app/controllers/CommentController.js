const Comment = require("../models/Comment");
class CommentController {
  async createComment(req, res) {
    try {
      const { commentText, productId, userId, rating } = req.body;

      const newComment = await Comment.create({
        commentText,
        productId,
        userId,
        rating,
      });

      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  // get all comments base on product id
  async getComments(req, res) {
    try {
      const { productId } = req.params;

      const comments = await Comment.find({ productId }) // filter by productId
        .sort({ _id: -1 }) // sort newest first
        .populate("userId", "name avatar"); // join user details

      return res.status(200).json(comments);
    } catch (error) {
      console.error("Error retrieving comments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      await Comment.findByIdAndDelete(id);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = new CommentController();
