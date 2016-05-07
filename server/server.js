/**
 * Created by gongxun on 16/4/25.
 */

var http = require("http");
var url = require("url");

function route(pathName){
    console.log("Request for " + pathName + " received.");
}

function onRequest(request, response){
    var pathName = url.parse(request.url).pathname;
    route(pathName);

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
};

http.createServer(onRequest).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');