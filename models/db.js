/**
 * 通过 new Db(settings.db, new Server(setting.host, Connection.DEFAULT_PORT),{safe:true});
 * 设置数据库名、数据库名、数据库地址和数据库端口。创建了一个数据库连接实例
 * 并通过module.exports导出该实例。
 */ 
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server =  require('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host, settings.DEFAULT_PORT),{safe:true});

