const conn = require("./mongooseConnection");
const chatModel = conn.model("chatmodel", {
  chatid: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  joinee: {
    type: String,
    required: false,
  },
});

module.exports = chatModel;
