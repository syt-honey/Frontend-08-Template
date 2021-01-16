(function () {
    /**
     * 字典树
     * 功能：
     * 1. 单词的插入
     * 2. 词频统计
     * TODO：是否可以指定单词来查找频率呢？
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

        // 字典树最小/最大，对数字进行补位处理一下
        // 哈希树的一个特例
    }

    // 随机产生字符
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
