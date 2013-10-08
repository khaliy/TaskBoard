var connect = require('connect');
console.log(__dirname);
connect.createServer(
    connect.static(__dirname + "/../TaskUI/")
).listen(8080);