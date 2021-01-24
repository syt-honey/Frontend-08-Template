let callbacks = new Map();
let reactives = new Map();

let usedReactive = [];

function effect(callback) {
    usedReactive = [];
    callback();

    for(let reactivity of usedReactive) {
        let [obj, prop] = reactivity;
        if (!callbacks.has(obj)) {
            callbacks.set(obj, new Map());
        }

        if (!callbacks.get(obj).has(prop)) {
            callbacks.get(obj).set(prop, [])
        }

        callbacks.get(obj).get(prop).push(callback);
    }
}

function reactive(obj) {
    if (reactives.has(obj)) {
        return reactives.get(obj);
    }
    let proxy =  new Proxy(obj, {
        set(obj, prop, val) {
            console.log(obj, prop, val);
            obj[prop] = val;
            if (callbacks.get(obj) && callbacks.get(obj).get(prop)) {
                for(let callback of callbacks.get(obj).get(prop)) {
                    callback();
                }
            }
            return obj[prop];
        },
        get(obj, prop) {
            // 每次调用依赖过的 reactive 对象都将它们收集起来
            let has = false
            for(let [temObj, temProp] of usedReactive) {
                if (temProp === prop) {
                    has = true;
                }
            }

            if (!has) {
                usedReactive.push([obj, prop]);
            }

            if (typeof obj[prop] === 'object') {
                return reactive(obj[prop])
            }
            return obj[prop];
        }
    });

    reactives.set(obj, proxy);
    return proxy;
}

export {
    reactive,
    effect
}
