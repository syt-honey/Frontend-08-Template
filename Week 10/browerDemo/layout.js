function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    const itemMap = [
        {
            key: "justify-content",
            val: "justifyContent"
        }, {
            key: "align-items",
            val: "alignItems"
        }, {
            key: "flex-wrap",
            val: "flexWrap"
        }, {
            key: "flex-direction",
            val: "flexDirection"
        }, {
            key: "align-content",
            val: "alignContent"
        }, {
            key: "align-self",
            val: "alignSelf"
        }
    ];

    for (let i = 0; i < itemMap.length; ++i) {
        if (element.computedStyle[itemMap[i].key]) {
            element.computedStyle[itemMap[i].val] = element.computedStyle[itemMap[i].key];
        }
    }

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

        if (element.style[prop].toString().match(/^[0-9.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}

/**
 * 实现 flex 排版
 * 测试：justify-content、flex-direction、flex-wrap
 * @param element
 * @returns {null}
 */
function layout(element) {
    if (!element.computedStyle || !Object.keys(element.computedStyle).length) {
        return null;
    }

    let elementStyle = getStyle(element);

    // 实现 flex 布局
    if (elementStyle.display !== "flex") {
        return null;
    }

    // 先根据 order 属性进行排序
    let items = element.children.filter(e => e.type === "element");
    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
    });

    let style = elementStyle;

    ["width", "height"].forEach(size => {
        if (style[size] === "auto" || style[size] === "") {
            style[size] = null;
        }
    });

    // 初始化 flex-direction、justify-content、flex-wrap、align-items、align-content 值
    const flexItemDefaultProperties = [
        {
            pro: "flexDirection",
            defaultValue: "row"
        }, {
            pro: "justifyContent",
            defaultValue: "flex-start"
        }, {
            pro: "flexWrap",
            defaultValue: "nowrap"
        }, {
            pro: "alignItems",
            defaultValue: "stretch"
        }, {
            pro: "alignContent",
            defaultValue: "stretch"
        }
    ];
    flexItemDefaultProperties.forEach(proItem => {
        if (!style[proItem.pro] || style[proItem.pro] === "auto") {
            style[proItem.pro] = proItem.defaultValue;
        }
    });

    // 初始化 flex-direction 中的主轴和侧轴对应的位置值
    let flexAxisRule = {
        "row": {
            mainSize: "width",
            mainStart: "left",
            mainEnd: "right",
            mainSign: +1,
            mainBase: 0,
            crossSize: "height",
            crossStart: "top",
            crossEnd: "bottom",
        },
        "row-reverse": {
            mainSize: "width",
            mainStart: "right",
            mainEnd: "left",
            mainSign: -1,
            mainBase: style.width,
            crossSize: "height",
            crossStart: "top",
            crossEnd: "bottom",
        },
        "column": {
            mainSize: "height",
            mainStart: "top",
            mainEnd: "bottom",
            mainSign: +1,
            mainBase: 0,
            crossSize: "width",
            crossStart: "left",
            crossEnd: "right"
        },
        "column-reverse": {
            mainSize: "height",
            mainStart: "bottom",
            mainEnd: "top",
            mainSign: -1,
            mainBase: style.height,
            crossSize: "width",
            crossStart: "left",
            crossEnd: "right"
        }
    };

    let { mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign = 0, crossBase = 0 } = flexAxisRule[style.flexDirection];

    if (style.flexWrap === "wrap-reverse") {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    // 如果父级元素没有设置主轴尺寸，则默认为所有子元素所有主轴方向尺寸之和
    let isAutoMainSize = false;
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        // TODO 这里有 bug。如果某一个子元素没有宽高的时候应该要去找对应的 children 看是否设置宽高，直到没有 children 了。
        items.forEach(item => {
            let itemStyle = getStyle(item);
            if (itemStyle[mainSize]) {
                elementStyle[mainSize] += itemStyle[mainSize];
            }
            isAutoMainSize = true;
        });
    }

    // 将 item 放入行。放入的同时要计算剩余空间，如果放入时发现剩余空间不足，则换行
    let flexLine = [];
    let flexLines = [flexLine];
    let mainSpace = style[mainSize];
    let crossSpace = 0;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);
        if (!itemStyle[mainSize]) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (style.flexWrap === 'noWrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize]) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace= style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }
            if (itemStyle[crossSize]) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === 'noWrap' || isAutoMainSize) {
        flexLine.crossSpace = style[crossSize] ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }
            itemStyle[mainSize] = itemStyle[mainSize] * scale;
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach((items) => {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);
                if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }
            if (flexTotal > 0) {
                let currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    if (itemStyle.flex) {
                        itemStyle[mainSize] = mainSpace * (itemStyle.flex/flexTotal);
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let currentMain,step;
                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                } else if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                } else if (style.justifyContent === 'flex-center') {
                    currentMain = (mainSpace/2) * mainSign + mainBase;
                    step = 0;
                } else if (style.justifyContent === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign;
                    currentMain = mainBase;
                } else if (style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        });
    }

    if (!style[crossSize]) {
        crossSpace = 0;
        style[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            style[crossSize] = style[crossSize] + flexLines[i].crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let step;
    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    } else if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    } else if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    } else if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    } else if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    } else if (style.alignContent === 'stretch') {
        step = 0;
        crossBase += 0;
    }

    flexLines.forEach(items => {
        let lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLine.length :
            items.crossSpace;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || style.alignItems;

            if (!itemStyle[crossSize]) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
            }
            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            } else if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            } else if (align === 'center') {
                console.log(crossBase, lineCrossSize, itemStyle[crossSize])
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            } else if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * (itemStyle[crossSize]);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart] )
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });
}

module.exports = { layout };
