const express = require("express");
const app = express();
var cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var ejs = require('ejs');
const shorid = require("shortid");
const UserModel = require("./model/User");
const bcrypt = require("bcrypt");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/userids");
var useridname;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const chatroomRouter = require("./routes/chatroomRoute");
const sessionRouter = require("./routes/sessionRoute");

app.use("/chat/", chatroomRouter);
app.use("/createsession", sessionRouter);


const oneDay = 1000 * 60 * 60 * 24;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.use(
  expressSession({
    secret: "thisismysecretkey34erwe",
    cookie: { secure: true, maxAge: oneDay },
    saveUninitialized: true,
    resave: true,
  })
);


function getpage (greet, info){
  var pageinfo = {
    greet:greet, info:info, frmshwbtn:'<form action="/hello" method = "GET"> <div class="btn"> <input id = "butts" type="submit" value = "Show My chats"></div> </form>',
     lblinfo: "Chat anonymously encourage everyone <br> Good Under world",
  }
  return pageinfo;
}
app.get("/", (req, res) => {
  if(req.cookies['username']){
    let greet = "Hello " + req.cookies['username'];
    var pageinfo = getpage(greet, "");
    res.render('home', {root: pageinfo['greet'], info: pageinfo['lblinfo'], showchat: pageinfo['frmshwbtn']});
  }
  else{
    var pageinfo = getpage("Hello New User", "Provide your username <br> Can be anything");
    res.render('home', {root: pageinfo['greet'], info: pageinfo['info'],showchat:""});
  }
  
});

app.get("/msg", async (req, res) => {
  useridname = req.query.username;
  //console.log(" =====", useridname);
  if(req.cookies['username']){
    // console.log(req, req.cookies);
    greet = "Hello " + req.cookies['username'];
    var pageinfo = getpage(greet, "No need of register again");
    res.render('home', {root: pageinfo['greet'], info: pageinfo['info'], showchat: pageinfo['frmshwbtn'] });
  }
  else {
    let user = await UserModel.findOne({ username: useridname });
    if (user) {
      var pageinfo = getpage("Already Exixts", "");
      return res.render('home', {root:pageinfo['greet'], info: pageinfo['lblinfo'], showchat: ""});
    }
    user = await UserModel.create({ username: useridname });
    res.cookie(`username`,useridname);
    let greet = "Hello " + useridname;
    var pageinfo = getpage(greet, "");
    var hashuserid = await bcrypt.hash(useridname,12);
    // res.writeHead(200, {'Content-Type': 'application/force-download','Content-disposition':'attachment; filename=key.txt'});
    // res.end( hashuserid );
    res.render('home', {root:pageinfo['greet'], info: pageinfo['lblinfo'], showchat: pageinfo['frmshwbtn']});
    
    

  }
  app.get("/hello", async (req, res) => {
    res.send("hey");
  })
  
 
});
app.listen(process.env.PORT || 3334);