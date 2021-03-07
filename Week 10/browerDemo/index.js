const { Request } = require("./request.js");
const parser = require("./parserHTML.js");
const images = require("images");
const { render } = require("./render.js");

(async function Main() {
    // 1. 定义请求内容
    let req = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8080",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
            name: "hello"
        }
    });

    // 2. 发送请求获取响应内容并转码
    let res = await req.send();

    // 3. 将转码后获取到的 HTML 进行 parser，同时进行 Style Rules 的计算并放入 DOM 树上、进行 layout，最后返回构建后 DOM 树
    let dom = parser.parserHTML(res.body);

    // 4. 绘制
    let viewport = images(500, 500);
    render(viewport, dom);

    viewport.save("viewport.jpg");
})();

