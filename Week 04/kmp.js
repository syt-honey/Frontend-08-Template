(function () {
    function kmp(source, pattern) {
        if (!source && pattern) {
            return false;
        }

        let table = new Array(pattern.length).fill(0);

        {
            // 获取 pattern 中自重复的 table 列表
            let i = 1, j = 0;

            while (i < pattern.length) {
                if (pattern[i] === pattern[j]) {
                    ++j;
                    ++i;
                    table[i] = j;
                } else {
                    if (j > 0) {
                        j = table[j];
                    } else {
                        ++i;
                    }
                }
            }
        }

        {
            // pattern source
            let i = 0, j = 0;
            while (i < source.length) {
                if (pattern[j] === source[i]) {
                    ++i;
                    ++j;
                } else {
                    if (j > 0) {
                        j = table[j];
                    } else {
                        ++i;
                    }
                }
                if (j === pattern.length) {
                    return true;
                }
            }

            return false;
        }
    }

    window.kmp = kmp;
})()