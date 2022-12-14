const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:");
const conn = mongoose.createConnection("mongodb://127.0.0.1:27017/userids");
module.exports = conn;
