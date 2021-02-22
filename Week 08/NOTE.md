> 本章主要学习如何对 `HTTP` 进行简易的发送并解析接收到的数据。

**一、主要步骤及总结**

第一步：`HTTP` 请求
* 设计一个 `HTTP` 请求的类
* `Content-Type` 是一个必要的字段，需要有默认值
* body 是一个 key-value 的格式
* 不同的 `Content-Type` 影响 body 的格式


第二步：`send` 函数
* 在 `Request` 的构造器中收集必要的信息
* 设计一个 `send` 函数
* 设计支持已有的 `connection` 或者创建一个 `connection`
* 收到数据传给 `parser`
* 根据 `parser` 的状态 `resolve` 

第三步：`ResponseParser`
* `Response` 必须分段构造，所以用一个 `ResponseParser` 来装配
* `ResponseParser` 分段处理 `ResponseText`，可以使用状态机来分析文本的结构
