const { Request } = require("./request.js");
const parser = require("./parserHTML.js");

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

    // 3. 将转码后获取到的 HTML 进行 parser 返回构建后 DOM 树
    let dom = parser.parserHTML(res.body);
    console.log(dom);

    // 4. 收集 CSS 规则，对 CSS 规则进行 parser，返回 Style Rules

    // 5. 通过遍历 DOM 树进行匹配计算将 Style Rules 插入 DOM 树，返回 Attachment 后的 DOM 树

})();

