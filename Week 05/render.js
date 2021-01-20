import { utils } from "../utils";

class StyleRender {
    constructor(doms, contexts) {
        this.doms = doms;
        this.doms.preview = document.getElementsByClassName('preview')[0];
        this.doms.result = document.getElementsByClassName('result')[0];
        this.contexts = contexts;
        this.evaluate();
    }

    evaluate() {
        // 获取色相
        this.hue = 360 * (this.contexts.filter(context => context.name === 'hue')[0].valueOf());
        [this.saturation, this.brightness] = this.contexts.filter(context => context.name === 'palette')[0].valueOf();
        this.alpha = this.contexts.filter(context => context.name === 'alpha')[0].valueOf();

        // 计算出 hex 的值
        this.hsl = utils.color.hsb2hsl(this.hue, this.saturation, this.brightness);
        this.rgb = utils.color.hsl2rgb(this.hsl.h, this.hsl.s, this.hsl.l);
        this.hex = utils.color.rgb2hex(this.rgb.r, this.rgb.g, this.rgb.b);
        this.setStyles();
    }

    setStyles() {
        const round = Math.round;
        const rgbValues = `${round(this.rgb.r * 255)}, ${round(this.rgb.g * 255)}, ${round(this.rgb.b * 255)}`;
        const alphaValue = utils.trimZero(this.alpha.toFixed(2));
        const hslaColor = `hsla(${round(this.hsl.h % 360)}, ${round(this.hsl.s * 100)}%, ${round(this.hsl.l * 100)}%, ${alphaValue})`;
        const rgbColor = `rgb(${rgbValues})`;
        const rgbaColor = `rgba(${rgbValues}, ${alphaValue})`
        // TODO alpha 计算有问题
        // TODO 透明度没有进行设置
        this.doms.preview.style.background =
            `linear-gradient(${hslaColor}, ${hslaColor}) 0 0 / cover,
      linear-gradient(45deg, rgba(0,0,0,0.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,0.25) 0) 0 0 / 12px 12px,
      linear-gradient(45deg, rgba(0,0,0,0.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,0.25) 0) 6px 6px / 12px 12px`;
        this.doms.palettes
            .filter(element => element.getAttribute('name') === 'alpha')[0]
            .style.background =
            `linear-gradient(to right, rgba(0,0,0,0), ${rgbColor}) 0 0 / cover,
        linear-gradient(45deg, rgba(0,0,0,0.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,0.25) 0) 0 0 / 12px 12px,
        linear-gradient(45deg, rgba(0,0,0,0.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,0.25) 0) 6px 6px / 12px 12px`;
        this.doms.picker.style.backgroundColor = `hsl(${this.hue}, 100%, 50%)`;

        // results
        this.doms.result.innerHTML = this.hex;

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