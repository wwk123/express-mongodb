var mongodb = require('./db');

function Post(uname, title, post){
    this.uname = uname;
    this.title = title;
    this.post = post;
}
module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback){
    var date = new Date();
    // 存储各种时间格式，方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-"  + date.getDate() + "" +
        date.getHours() +　"-"
        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    };
    // 要存入数据库的文档
    var post = {
        uname : this.uname,
        time : time,
        title : this.title,
        post : this.post
    };
    // 打开数据库
    mongodb.open(function(err, db){
       if(err){
         return callback(err);
       }
       // 读取 posts集合
       db.collection('posts', function(err, collection){
           if(err){
               mongodb.close();
               return callback(err);
           }
           // 将文档插入 posts 集合
           collection.insert(post, {
             safe: true
           },function(err){
               mongodb.close();
               if(err){
                   return callback(err); //失败！返回err
               }
               callback(null);//返回err 为null
           });
       });
    });
};

// 读取文章及其相关的信息
Post.get = function(uname, callback){
    // 打开数据库
    mongodb.open(function (err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        // 读取posts集合
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (uname){
                query.uname = uname;
            }
            // 根据 query 对象查询文章
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs){
                mongodb.close();
                if(err){
                    return callback(err);//失败！返回err
                }
                callback(null, docs);//成功！以数组的形式返回查询的结果
            });
        });
    });
};

