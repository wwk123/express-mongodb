var express = require('express');
var path = require('path');
var connect = require("connect");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);//添加

// 捆绑在一起已经不再支持

var settings = require('./settings');//添加
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require("http");//添加
var router = express.Router();//添加

var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// set port is 3000
app.set('port',process.env.PORT||3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 设置views文件夹为存放视图文件的目录
app.set('view engine', 'ejs');
// 设置视图模板引擎为ejs
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(flash());
/**
 * flash是一个在session中用于存储信息的特定区域。信息写入flash,下一次显示完毕后
 * 即被清楚。典型的应用是结合重定向的功能，确保信息提供给下一个被渲染的页面。express3.X不支持
 * 通过connect-flash来实现
 */
app.use(logger('dev'));
// connect内建的中间件，在开发环境下使用，在终端显示简单的日志
app.use(bodyParser.json());
// 加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false }));//加载解析urlencoded请求体的中间件
// express中使用cookieparser  cookie解析的中间件
app.use(express.cookieParser());//4.0中不存在
// 提供会话支持  secret 用来防止篡改Cookie ,key的值为Cookie的名字，通过设置Cookie
// 的maxAge值来设定Coolie的生存期，这里我们设置Cookie的生存期为30天，设置它的store参数为MongoStore
// 实例，把会话信息存储到数据库中，以免丢失
app.use(express.session({  
  secret: settings.cookieSecret,
  key:settings.db, //cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},  //30 day
//  
  store: new MongoStore({
   /* db: settings.db,
    host: settings.host,
    port: settings.DEFULAT_PORT*/
    url: 'mongodb://localhost/blog' 
  })
}));

// connect内建的中间件，用来解析请求主体，支持application/json
// application/x-www-form-urlencoded和multipart/form-data

// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// connect内建的中间件,将根据目录下的public文件夹设置为存放image,css,js等静态文件的目录
// app.use('/', index);
// app.use('/users', users);
index(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handle
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}//2017-05-09
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // 使用ejs模板解析
});
// listening localhost:3000
http.createServer(app).listen(app.get('port'),function(){
  console.log("Express server listening on port "+app.get('port'));
});
module.exports = app;