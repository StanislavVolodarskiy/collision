import * as dom from './dom.js';

const makeCurrentFpsMeter = parent_ => {
    const text = dom.createTextNode(parent_, '-');

    const alpha = 0.9;
    let last_t = 0;
    let fps = 0;
    let update_interval = 0.2;
    let next_update_t = 0;

    const update = t => {
        const current_fps = 1 / (t - last_t);
        fps = alpha * fps + (1 - alpha) * current_fps;
        if (t >= next_update_t) {
            text.data = fps.toFixed(2);
            next_update_t = t + update_interval;
        }
        last_t = t;
    };

    return {'update': update};
};

const makeMinFpsMeter = parent_ => {
    const text = dom.createTextNode(parent_, '-');

    let last_t = 0;
    let min_fps = Number.POSITIVE_INFINITY;

    const update = t => {
        const fps = 1 / (t - last_t);

        if (fps < min_fps) {
            text.data = fps.toFixed(2);
            min_fps = fps;
        }
        last_t = t;
    };

    return {'update': update};
};

const makeMaxFpsMeter = parent_ => {
    const text = dom.createTextNode(parent_, '-');

    let last_t = 0;
    let max_fps = Number.NEGATIVE_INFINITY;

    const update = t => {
        const fps = 1 / (t - last_t);

        if (fps > max_fps) {
            text.data = fps.toFixed(2);
            max_fps = fps;
        }
        last_t = t;
    };

    return {'update': update};
};

const makeFpsMeter = parent_ => {
    const minFpsMeter = makeMinFpsMeter(parent_);
    dom.createTextNode(parent_, ' / ');
    const currentFpsMeter = makeCurrentFpsMeter(parent_);
    dom.createTextNode(parent_, ' / ');
    const maxFpsMeter = makeMaxFpsMeter(parent_);

    const update = t => {
        minFpsMeter.update(t);
        maxFpsMeter.update(t);
        currentFpsMeter.update(t);
    };

    return {'update': update};
};

export { makeFpsMeter };
