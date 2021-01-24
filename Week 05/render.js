import { utils } from "../utils";
// import { reactive } from "./proxy.js";

class StyleRender {
    constructor(doms, contexts) {
        this.doms = doms;
        this.doms.preview = document.getElementsByClassName('preview')[0];
        this.doms.hsla = Array.prototype.slice.call(document.querySelectorAll('.hsla')[0].getElementsByTagName('input'));
        this.contexts = contexts;
        // this.hue = reactive({});
        // this.saturation = reactive({});
        // this.brightness = reactive({});
        // this.alpha = reactive({});
        this.evaluate();
    }

    evaluate() {
        // 获取色相、饱和度等
        this.hue = 360 * (this.contexts.filter(context => context.name === 'hue')[0].valueOf());
        [this.saturation, this.brightness] = this.contexts.filter(context => context.name === 'palette')[0].valueOf();
        this.alpha = this.contexts.filter(context => context.name === 'alpha')[0].valueOf();

        // 计算出 hex 的值
        this.hsl = utils.color.hsb2hsl(this.hue, this.saturation, this.brightness);
        this.setStyles();
    }

    getHSL() {
        const round = Math.round;
        const alphaValue = utils.trimZero(Number(this.alpha).toFixed(2));
        return [round(this.hsl.h % 360), `${round(this.hsl.s * 100)}%`, `${round(this.hsl.l * 100)}%`, alphaValue];
    }

    setStyles() {
        const hsl = this.getHSL();
        const hslaColor = `hsla(${hsl[0]}, ${hsl[1]}, ${hsl[2]}, ${hsl[3]})`;

        this.doms.preview.style.background =
            `linear-gradient(${hslaColor}, ${hslaColor}) 0 0 / cover,
             linear-gradient(45deg, rgba(0,0,0,0.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,0.25) 0) 0 0 / 12px 12px,
             linear-gradient(45deg, rgba(0,0,0,0.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,0.25) 0) 6px 6px / 12px 12px`;

        this.doms.picker.style.backgroundColor = `hsl(${this.hue}, 100%, 50%)`;

        // hsla
        this.doms.hsla.map((hItem, i) => { hItem.value = hsl[i]; });
    }

    // 采用单例模式
    static getInstance(doms, contexts) {
        if (!this.instance) {
            this.instance = new StyleRender(doms, contexts);
        }
        return this.instance;
    }
}

export {
    StyleRender
}