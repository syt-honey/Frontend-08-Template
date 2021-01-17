(function () {
    /**
     * 字典树
     * 功能：
     * 1. 单词的插入
     * 2. 词频统计
     * @type {symbol}
     */
    let $ = Symbol("$");

    class Trie {
        constructor() {
            this.root = Object.create(null);
        }

        // 将字符插入字典树中
        insert(word) {
            let node = this.root;
            for (let c of word) {
                if (!node[c]) {
                    node[c] = Object.create(null);
                }
                node = node[c];
            }

            if (!($ in node)) {
                node[$] = 0;
            }

            node[$]++;
        }

        // 找出重复次数最多的单词
        most() {
            let max = 0;
            let maxWord = null;
            let visit = (node, word) => {
                if (node[$] && node[$] > max) {
                    max = node[$];
                    maxWord = word;
                }

                for (let p in node) {
                    visit(node[p], word + p);
                }
            }
            visit(this.root, "");
            return {
                value: maxWord,
                count: max
            };
        }

        // 指定某值，查询出现次数
        freq(key) {
            let p = key.split("");
            let freq = 0;
            let has = false;
            let visit = (node, str) => {
                if (!node[str] && !node[$] && node[$] !== 0 || (node[$] && str)) {
                    // 查找的字符不在 root 中、输入的 key 的长度大于 root 当前字符的长度（包含关系）
                    has = false;
                } else if (node[$]) {
                    has = true;
                    freq = node[$];
                } else {
                    visit(node[str], p.shift());
                }
            }
            visit(this.root, p.shift());
            return {
                value: key,
                has,
                count: freq
            }
        }
    }

    // 生成随机字符串
    function randomWord(length) {
        let s = "";
        for (let i = 0; i < length; i++) {
            s += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0));
        }
        return s;
    }

    window.randomWord = randomWord;
    window.Trie = Trie;
})();
