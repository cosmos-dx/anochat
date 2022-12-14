const loginRoute = require("express").Router();
const userModel = require("../models/usermodel");
loginRoute.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/login.html");
});

loginRoute.post("/", async (req, res) => {
  const user = await userModel.findOne({ username: req.body.uname });
  if (user) {
    return res.send("user already exists!");
  }
  await userModel.create({ username: req.body.uname });
  res.cookie("username", req.body.uname);
  res.redirect("/");
});

module.exports = loginRoute;
