var express = require('express');
var history = require('connect-history-api-fallback'); 

var server = express();

var options = {

index: 'index.html'

};

server.use(history());
server.use('/', express.static('/home/site/wwwroot', options));


server.listen(process.env.PORT);