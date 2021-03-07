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
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(`
                <html lang="ch">
                <head>
                  <title>Test</title>
                  <style>
                    .container {
                      display: flex;
                      flex-direction: row-reverse;
                      justify-content: space-around;
                      flex-wrap: wrap;
                      align-items: center;
                      height: 500px;
                      width: 500px;
                      background-color: #606266;
                    }
                    .placeholder {
                        width: 100px;
                        height: 100px;
                        background: rgb(255, 0, 0);
                    }
                    #traffic-signal {
                      width: 300px;
                      height: 300px;
                      background: rgba(79, 139, 238, .8);
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div id="traffic-signal"></div>
                    <div class="placeholder"><div></div></div>
                  </div>
                </body>
                </html>
        `);
    });
}).listen(8080);

console.log("server started");