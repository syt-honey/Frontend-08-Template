const http = require("http");

http.createServer((req, res) => {
    let body = [];
    req.on("error", e => {
        console.error(e);
    }).on("data", chunk => {
        // must be an instance of Buffer or Uint8Array，不需要 toString
        body.push(chunk);
    }).on("end", () => {
        body = Buffer.concat(body).toString();
        console.log("body:", body);
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end("Hello world\n");
    });
}).listen(8080);

console.log("server started");