const css = require("css");
let rules = [];

function addCSSRules(text) {
    const ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}

function computeCSS(element, stack) {
    const elements = stack.slice().reverse();

    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    for (let rule of rules) {
        const selectorParts = rule.selectors[0].split(" ").reverse();

        if (!match(element, selectorParts[0])) {
            continue;
        }

        let matched = false;

        let j = 1;
        for(let i = 0; i < elements.length; ++i) {
            if (match(elements[i], selectorParts[j])) {
                ++j;
            }
        }

        if (j >= selectorParts.length) {
            matched = true;
        }

        if (matched) {
            const sp = specificity(rule.selectors[0]);
            const computedStyle = element.computedStyle;
            for (let del of rule.declarations) {
                if (!computedStyle[del.property]) {
                    computedStyle[del.property] = {};
                }

                if (!computedStyle[del.property].specificity) {
                    computedStyle[del.property].value = del.value;
                    computedStyle[del.property].specificity = sp;
                } else if (compare(computedStyle[del.property].specificity, sp) < 0) {
                    computedStyle[del.property].value = del.value;
                    computedStyle[del.property].specificity = sp;
                }
            }
            // console.log(element.computedStyle);
        }
    }
}
// .a #a div
function match(element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }

    if (selector.charAt(0) === "#") {
        const attr = element.attributes.filter(attr => attr.name === "id")[0];
        if (attr && attr.value === selector.replace("#", "")) {
            return true;
        }
    } else if (selector.charAt(0) === ".") {
        const attr = element.attributes.filter(attr => attr.name === "class")[0];
        if (attr && attr.value === selector.replace(".", "")) {
            return true;
        }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }

    return false;
}

function specificity(selector) {
    let p = [0, 0, 0, 0];
    const selectorParts = selector.split(" ");
    for (let part of selectorParts) {
        if (part.charAt(0) === "#") {
            p[1] += 1;
        } else if (part.charAt(0) === ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }

    return p;
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    }

    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    }

    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }

    return sp1[3] - sp2[3];
}

module.exports = {
    addCSSRules,
    computeCSS
}