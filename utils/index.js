const utils = {
    /**
     * @param {*} duration
     */
    sleep(duration) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }
};

window.utils = utils;
