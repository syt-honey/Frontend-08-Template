(function () {
    function wildcard(source, pattern) {
        let startCount = 0;
        for(let i = 0; i < pattern.length; i++) {
            if (pattern[i] === "*") {
                startCount++;
            }
        }

        if (startCount === 0) {
            // 严格相等
            for (let i = 0; i < pattern.length; i++) {
                if (pattern[i] !== source[i] && pattern[i] !== "?") {
                    return false;
                }
            }
            return true;
        }

        // 第一个 * 之前的内容匹配，包含第一个 * 之前为空的情况。如：*abc
        let i = 0;
        let lastIndex = 0;
        for (i = 0; pattern[i] !== "*"; i++) {
            if (pattern[i] !== source[i] && pattern[i] !== "?") {
                return false;
            }
        }

        lastIndex = i;

        // 后面 * 与 * 之间的内容匹配，并且替换其中可能存在的 "?" 字符。
        for (let p = 0; p < startCount - 1; p++) {
            i++;
            let subPattern = "";
            while (pattern[i] !== "*") {
                subPattern += pattern[i];
                i++;
            }

            let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
            reg.lastIndex = lastIndex;

            if (!reg.exec(source)) {
                return false;
            }

            lastIndex = reg.lastIndex;
        }

        // 从后往前匹配
        for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
            if (pattern[pattern.length - j] !== source[source.length - j]
                && pattern[pattern.length - j] !== "?") {
                return false;
            }
        }
        return true;
    }

    window.wildcard = wildcard;
})()