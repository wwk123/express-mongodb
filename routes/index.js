/**
 * 通过expor导出index函数接口，如果用户访问/(主页)，则由routes.index来处理，
 * routers/index.js内容如下
 */

/**
 * 为了维护用户状态和flash的通知功能，我们给每一个ejs模板文件传入了以下三个值
 * user:  req.session.user
 * success: req.flash('success').toString()
 * error: req.flash('error').toString()
 */ 
//修改的代码
var crypto = require('crypto');
User = require('../models/user.js');
Post = require('../models/post.js');

// 引入cryptohe user.hs用户模型文件，crypto是Node.js的一个核心模块
// 用它来生成散列值来加密密码
//添加login reg post logout  的登录信息

module.exports = function(app){
  app.get('/',function(req,res){
    Post.get(null, function(err, posts){
      if(err){
        posts = [];
      }
      res.render('index',{
        title: '主页',
        user: req.session.user,
        success:　req.flash('success').toString(),
        error: req.flash('error').toString()  
      });
    });
  });
  //注册页 
  app.get('/reg',checkNotLogin);
  app.get('/reg',function(req,res){
    res.render('reg',{
      title: '注册页',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  // 
  app.post('/reg',checkNotLogin);
  app.post('/reg',function(req,res){
    var uname = req.body.uname,
        upwd = req.body.upwd,
        upwd_re = req.body['upwd-repeat'];
    // 检查用户两次输入的密码是否一致
    if(upwd_re !== upwd){
      req.flash('error','两次输入的密码不一致！');
      return res.redirect('/reg');//返回注册页面
    }
    // 生成密码的md5值
    var md5 = crypto.createHash('md5');
        upwd = md5.update(req.body.upwd).digest('hex');
    var newUser = new User({
        uname: req.body.uname,
        upwd: upwd,
        email: req.body.email
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user){
      if(user){
        req.flash('error','用户已存在');
        return res.redirect('/reg');//返回注册页面
      }
      // 如果用户不存在则新增用户
      newUser.save(function(err, user){
        if(err){
          req.flash('error', err);
          return res.redirect('/reg');//注册失败返回注册页
        }
        req.session.user = user;//用户信息存入session
        req.flash('success','注册成功!');
        res.redirect('/');//注册成功后返回主页
      });
    });
  });
// 登录
  app.get('/login',checkNotLogin);
  app.get('/login',function(req,res){
    console.log("test");
    res.render('login',{
      title:'登录',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/login',checkNotLogin);
  app.post('/login',function(req, res){
    // 生成密码的md5值
    console.log("test1");
    var md5 = crypto.createHash('md5'),
       upwd = md5.update(req.body.upwd).digest('hex');
      
    //检查用户是否存在
    User.get(req.body.uname,function(err,user){
      console.log("test2");
      if(!user){
        req.flash('error','用户不存在');
        return res.redirect('/login');//用户不存在则跳转到登录页
      }
      // 检查密码是否一致
      if(user.upwd!==upwd){
        req.flash('error','密码错误');
        return res.redirect('/login');//密码错误则跳转到登录页
      }
      // 用户名和密码全部匹配之后，将用户的信息存入session
      req.session.user = user;
      req.flash('success','登录成功！');
      res.redirect('/');//登录成功后跳转到主页
    })  
  });
  // 发表
  app.get('/post',checkLogin);
  app.get('/post',function(req, res){
    res.render('post',{
      title: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/post',checkLogin);
  app.post('/post',function(req,res){
    var currentUser = req.session.user,
        post = new Post(currentUser.uname,req.body.title,req.body.post);
    post.save(function(err){
      if(err){
        req.flash('error' ,err);
        return res.redirect('/');
      }
      req.flash('success','发布成功');
      res.redirect('/');//发表成功之后跳转到主页
    });
  });
   // 注销
  app.get('/logout',checkLogin);
  app.get('/logout',function(req,res){
      req.session.user = null;
      req.flash('success','注销成功');
      res.redirect('/');
  });
// 增加用户访问权限
  function checkLogin(req, res, next){
      if(!req.session.user){
        req.flash('error','未登录!');
        res.redirect('/login');
      }
      next();
  }

  function checkNotLogin(req, res, next){
    if(req.session.user){
      req.flash('error','已登录！');
      req.redirect('back');
    }
    next();
  }
};

