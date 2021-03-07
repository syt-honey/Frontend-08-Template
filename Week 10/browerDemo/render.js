const images = require("images");
const { hex2rgba, rgb2rgba } = require("./utils.js")
/**
 * 渲染已经计算好的样式
 * @param viewport
 * @param element
 *
 * 支持：background-color、background; 注：rgb 中的空格也需要加上
 */
function render(viewport, element) {
    if (element.style && Object.keys(element.style).length) {
        let img = images(element.style.width, element.style.height);

        for (let p in element.style) {
            let value = element.style[p];

            // background、background-color
            if (p === "background-color" || p === "background") {
                let color = value || "rgba(0, 0, 0, 0)";

                // 获取 background 中颜色的值
                if (p === "background") {
                   if (value.includes("#")) {
                       color = color.match(/([^\s]+)/)[0];
                   } else if (value.includes("rgb(")) {
                       color = color.match(/rgb\((\d+), (\d+), (\d+)\)/)[0];
                   } else if (value.includes("rgba")) {
                       color = color.match(/rgba\((\d+), (\d+), (\d+), (0?\.[0-9])\)/)[0];
                   }
                }

                // 将不同格式的颜色值转换为 rgba 。#fff、rgb(255, 255, 255)、rgba(255, 255, 255, 1)
                if (value.includes("#")) {
                    color = hex2rgba(value);
                }

                if (value.includes("rgb(")) {
                    color.match(/rgb\((\d+), (\d+), (\d+)\)/)
                    color = rgb2rgba(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
                }

                color.match(/rgba\((\d+), (\d+), (\d+), (\d+)\)/);
                img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), Number(RegExp.$4));
            }

            viewport.draw(img, element.style.left || 0, element.style.top || 0);
        }
    }

    if (element.children) {
        for (let child of element.children) {
            render(viewport, child);
        }
    }
}

module.exports = { render };
