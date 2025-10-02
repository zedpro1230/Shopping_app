const authRouter = require("./auth");
const googleAuthRouter = require("./googleAuth");
const productRouter = require("./product");
const categoryRouter = require("./category");
const bannerRouter = require("./banner");
const commentRouter = require("./comment");
const momoRouter = require("./momo");
const orderRouter = require("./order");
function route(app) {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/auth", authRouter);
  app.use("/", googleAuthRouter);
  app.use("/products", productRouter);
  app.use("/categories", categoryRouter);
  app.use("/banners", bannerRouter);
  app.use("/comments", commentRouter);
  app.use("/momo", momoRouter);
  app.use("/orders", orderRouter);
}
module.exports = route;
