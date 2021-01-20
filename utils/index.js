const utils = {
    /**
     * @param {*} duration
     */
    sleep(duration) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    },
    getBounding(val, min, max) {
        return val < min ? min : (val > max ? max : val);
    },
    color: {
        hsb2hsl(h, s, b) {
            var hsl = {
                h: h
            };
            hsl.l = (2 - s) * b;
            hsl.s = s * b;
            if (hsl.l <= 1 && hsl.l > 0) {
                hsl.s /= hsl.l;
            } else {
                hsl.s = hsl.s / (2 - hsl.l) || 0;
            }
            hsl.l /= 2;
            if (hsl.s > 1) {
                hsl.s = 1;
            }
            return hsl;
        },
        rgb2hex(r, g, b) {
            return "#" + (16777216 | (b * 255) | ((g * 255) << 8) | ((r * 255) << 16)).toString(16).slice(1);
        },
        hsl2rgb(h, s, l) {
            h = h / 360;
            var r, g, b;
            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return {r, g, b};
        }
    },
    trimZero(str) {
        return str.replace(/.?0*$/, '');
    }
};

export {
 utils
};
