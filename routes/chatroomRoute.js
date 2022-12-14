const chatroomRoute = require("express").Router();
const userModel = require("../model/User");
const chatModel = require("../model/chatModel");
chatroomRoute.get("/:id", async (req, res) => {
  console.log(req.cookies);
  const id = req.params.id;
  if (!(await chatModel.findOne({ chatid: id })))
    return res.send("chat session not found");
  const uname = req.cookies["username"];
  const user = await userModel.findOne({ username: uname });
  if (user) {
    if (await chatModel.findOne({ chatid: id, creator: user.username })) {
      return res.send("tu hi bANHILEBALA.");
    }
    if ((await chatModel.findOne({ chatid: id })).joinee === uname) {
      return res.send("you are in chat window");
    } else if (await chatModel.findOne({ chatid: id, joinee: null })) {
      await chatModel.updateOne(
        { chatid: id, joinee: null },
        { joinee: uname }
      );
      return res.send("you have joined the chatroom");
    } else {
      return res.send("room is full");
    }
  }
  return res.send("Not found");
});

module.exports = chatroomRoute;
