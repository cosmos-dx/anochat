const chatroomRoute = require("express").Router();
const userModel = require("../model/User");
const chatModel = require("../model/chatModel");
const bcrypt = require("bcrypt");
//const id = require("./routes/sessionRoute")(id);
//app.use(express.static('public'));

chatroomRoute.get("/:id", async (req, res) => {
  console.log(req.cookies);
  //var hashuserid = req.cookies['username'];
  var hashuserid = await bcrypt.hash(req.cookies['username'],2);
  const id = req.params.id;
  if (!(await chatModel.findOne({ chatid: id })))
    return res.send("chat session not found");
  const uname = req.cookies["username"];
  const user = await userModel.findOne({ username: uname });
  if (user) {
    if (await chatModel.findOne({ chatid: id, creator: user.username })) {
      return res.render('chat',{room:id, username:hashuserid});
    }
    if ((await chatModel.findOne({ chatid: id })).joinee === uname) {
      return res.render('chat',{room:id,username:hashuserid});
    } else if (await chatModel.findOne({ chatid: id, joinee: null })) {
      await chatModel.updateOne(
        { chatid: id, joinee: null },
        { joinee: uname }
      );
      return res.render('chat',{room:id,username:hashuserid});
    } else {
      return res.send("room is full");
    }
  }
  return res.send("Not found");
});



module.exports = chatroomRoute;
