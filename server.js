/*
*	Creating Nodejs based Web and Application server at specific port
*/
'use strict';
const http = require("http");
module.exports = function(app){
    const port = process.env.PORT || 3000;
    app.set('port', port);

    var server = http.createServer(app);
    server.listen(port);
    console.log("server is listening on port 3000");
};