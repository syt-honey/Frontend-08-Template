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
                  <title>TrafficSignal</title>
                  <style>
                    .container {
                      width: 500px;
                      height: 500px;
                      background: #fff;
                    }
                    #traffic-signal {
                      width: 30px;
                      height: 30px;
                      border-radius: 50%;
                      border: none;
                      animation: trafficSignal linear 6s infinite;
                    }
                    
                    div div {
                        width: 20px;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div id="traffic-signal"></div>
                    <input/>
                  </div>
                </body>
                </html>
        `);
    });
}).listen(8080);

console.log("server started");