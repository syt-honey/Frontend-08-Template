function hex2rgba(hex) {
    let sColor = hex.toLowerCase();

    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = "#";
            for (let i = 1; i < 4; ++i) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "rgba(" + sColorChange.join(", ") + ", 1)";
    }
    return sColor;
}
function rgb2rgba(r, g, b) {
    return `rgba(${r}, ${g}, ${b}, 1)`;
}

module.exports = { hex2rgba, rgb2rgba };