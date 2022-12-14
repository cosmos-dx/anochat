const sessionRoute = require("express").Router();
const userModel = require("../model/User");
const chatModel = require("../model/chatModel");
const shorid = require("shortid");
// sessionRoute.use()
sessionRoute.get("/", async (req, res) => {
  if (!req.cookies["username"]) return res.redirect("/");
  const user = await userModel.findOne({ username: req.cookies["username"] });
  if (!user) {
    res.clearCookie("username");
    res.redirect("/");
  }
  const id = shorid.generate();
  await chatModel.create({
    chatid: id,
    creator: req.cookies["username"],
    joinee: null,
  });
  res.redirect(`/chat/${id}`);
});

sessionRoute.post("/", async (req, res) => {
  uname = req.cookies['username'];
  const id = shorid.generate();
  console.log("      -------------------------------------------- ",req);
  await chatModel.create({ chatid: id, creator: uname, joinee: null });
 // res.cookie("username", req.cookies["username"]);
  res.send(`/chat/${id}`);
});

module.exports = sessionRoute;
