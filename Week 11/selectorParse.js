const EOF = Symbol("EOF");
let currentSelector = {};
let selectorList = [];

function emit(selector) {
    selectorList.push(selector);
}

function data(s) {
    if (s.match(/^[a-zA-Z]$/)) {
        return tagSelectorOpen(s);
    } else if (s === "#") {
        return idSelectorOpen;
    } else if (s === ".") {
        return classSelectorOpen;
    } else if (s === EOF) {
        emit({
            type: "EOF"
        })
        return null
    } else {
        return data;
    }
}

function tagSelectorOpen(s) {
    if (s.match(/^[a-zA-Z]$/)) {
        currentSelector = {
            name: "",
            type: "tag"
        }
        return tagSelectorName(s);
    } else if (s.match(/^[\t\n\f ]$/)) {
        return data;
    }
}

function tagSelectorName(s) {
    if (s === EOF) {
        emit(currentSelector);
        return data;
    } else if (s.match(/^[a-zA-Z]$/)) {
        currentSelector.name += s;
        return tagSelectorName;
    } else if (s.match(/^[\t\n\f ]$/)) {
        emit(currentSelector);
        return data;
    } else {
        return data;
    }
}

function idSelectorOpen(s) {
    if (s.match(/^[a-zA-Z]$/)) {
        currentSelector = {
            name: "",
            type: "id"
        }
        return idSelectorName(s);
    } else if (s.match(/^[\t\n\f ]$/)) {
        return data;
    }
}

function idSelectorName(s) {
    if (s === EOF) {
        emit(currentSelector);
        return data;
    } else if (s.match(/^[a-zA-Z]$/)) {
        currentSelector.name += s;
        return idSelectorName;
    } else if (s.match(/^[\t\n\f ]$/)) {
        emit(currentSelector);
        return data;
    } else {
        return data;
    }
}

function classSelectorOpen(s) {
    if (s.match(/^[a-zA-Z]$/)) {
        currentSelector = {
            name: "",
            type: "class"
        }
        return classSelectorName(s);
    } else if (s.match(/^[\t\n\f ]$/)) {
        return data;
    }
}

function classSelectorName(s) {
    if (s === EOF) {
        emit(currentSelector);
        return data;
    } else if (s.match(/^[a-zA-Z]$/)) {
        currentSelector.name += s;
        return classSelectorName;
    } else if (s.match(/^[\t\n\f ]$/)) {
        emit(currentSelector);
        return data;
    } else {
        return data;
    }
}

function selectorParse(selector) {
    let state = data;
    for (let s of selector) {
        state = state(s);
    }
    state = state(EOF);
    return selectorList;
}

export {
    selectorParse
}