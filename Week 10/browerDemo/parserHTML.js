const { addCSSRules, computeCSS } = require("./parseCSS.js");
const { layout } = require("./layout.js");
const EOF = Symbol("EOF");
let currentToken = null;
let currentAttribute = null;
let stack = [{
    type: "document",
    children: [],
    attributes: [],
    parent: null,
    tagName: null
}];

let currentTextNode = null;
function emit (token) {
    let top = stack[stack.length - 1];

    if (token.type === "startTag") {
        // DOM 树中只会有 node 和 element
        let element = {
            type: "element",
            children: [],
            attributes: [],
            parent: null,
            tagName: null
        };

        element.tagName = token.tagName;

        for(let p in token) {
            if (p !== "type" && p !== "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }

        computeCSS(element, stack);

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }

        currentTextNode = null;
    } else if (token.type === "endTag") {
        if (top.tagName !== token.tagName) {
            // 理论上来说应该有一定容错性
            throw new Error("Tag start end doesn't match!");
        } else {
            // 暂时只考虑 style 标签和内联形式
            if (top.tagName === "style") {
                addCSSRules(top.children[0].content);
            }

            stack.pop();
        }
        layout(top);
        currentTextNode = null;
    } else if (token.type === "text") {
        // 将所有的文本合在一起
        if (currentTextNode === null) {
            currentTextNode = {
                type: "text",
                content: ""
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }

    return stack;
}

function data (w) {
    if (w === "<") {
        return tagOpen;
    } else if (w === EOF) {
        emit({
            type: "EOF"
        });
        return null;
    } else {
        emit({
            type: "text",
            content: w
        });
        return data;
    }
}

function tagOpen(w) {
    if (w === "/") {
        return endTagOpen;
    } else if (w.match(/^[a-zA-Z]$/)) {
        // 开始标签和自封闭标签都标记为 startTag，同时将自封闭标签标记一个 isSelfClosing 用作区分
        currentToken = {
            type: "startTag",
            tagName: ""
        };
        return tagName(w);
    } else {

    }
}

function endTagOpen(w) {
    if (w.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        };
        return tagName(w);
    } else if (w === ">") {

    } else if (w === "EOF") {

    } else {

    }
}

function tagName(w) {
    if (w.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (w === "/") {
        return selfClosingStartTag;
    } else if (w.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += w; // toLowerCase()
        return tagName;
    } else if (w === ">") {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName(w) {
    if (w.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (w === "/" || w === ">" || w === EOF) {
        return afterAttributeName(w);
    } else if (w === "=") {
        // return beforeAttributeName;
    } else {
        currentAttribute = {
            name: "",
            value: ""
        };
        return attributeName(w);
    }
}

function attributeName(w) {
    if (w.match(/^[\t\n\f ]$/) || w === "/" || w === ">" || w === EOF) {
        return afterAttributeName(w);
    } else if (w === "=") {
        return beforeAttributeValue;
    } else if (w === "\u0000") {

    } else if (w === "\"" || w === "'" || w === "<") {

    } else {
        currentAttribute.name += w;
        return attributeName;
    }
}

function beforeAttributeValue(w) {
    if (w.match(/^[\t\n\f ]$/) || w === "/" || w === ">" || w === EOF) {
        return beforeAttributeValue;
    } else if (w === "\"") {
        return doubleQuotedAttributeValue;
    } else if (w === "'") {
        return singleQuotedAttributeValue;
    } else if (w === ">") {

    } else  {
        return unQuotedAttributeValue(w);
    }
}

function doubleQuotedAttributeValue(w) {
    if (w === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (w === "\u0000") {

    } else if (w === EOF) {

    } else {
        currentAttribute.value += w;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(w) {
    if (w === "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (w === "\u0000") {

    } else if (w === EOF) {

    } else {
        currentAttribute.value += w;
        return singleQuotedAttributeValue;
    }
}


function afterQuotedAttributeValue(w) {
    if (w.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (w === "/") {
        return selfClosingStartTag;
    } else if (w === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (w === EOF) {

    } else {
        currentAttribute.value += w;
        return doubleQuotedAttributeValue;
    }
}

function unQuotedAttributeValue(w) {
    if (w.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (w === "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (w === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (w === "\u0000") {

    } else if (w === "\"" || w === "'" || w === "<" || w === "=" || w === "`") {

    } else if (w === EOF) {

    } else {
        currentAttribute.value += w;
        return unQuotedAttributeValue;
    }
}

function afterAttributeName(w) {
    if (w.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (w === "/") {
        return selfClosingStartTag;
    } else if (w === "=") {
        return beforeAttributeValue;
    } else if (w === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (w === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        };
        return attributeName(w);
    }
}

function selfClosingStartTag(w) {
    if (w === ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (w === "EOF") {

    } else {

    }
}

module.exports.parserHTML = function parserHTML(html) {
    let state = data;
    for(let w of html) {
        state = state(w);
    }
    state = state(EOF);
    return stack[0];
}
