import * as dom from './dom.js';

const makeStatsMeter = parent_ => {
    dom.createTextNode(parent_, 'splits ');
    const splitsNode = dom.createTextNode(parent_, '-');
    dom.createTextNode(parent_, ' / tests ');
    const testsNode = dom.createTextNode(parent_, '-');
    dom.createTextNode(parent_, ' / collisions ');
    const collisionsNode = dom.createTextNode(parent_, '-');
    dom.createTextNode(parent_, ' / reactions ');
    const reactionsNode = dom.createTextNode(parent_, '-');

    const update_interval = 200;
    let next_update_t = 0;

    const update = stats => {
        const t = performance.now();
        if (t < next_update_t) {
            return;
        }
        splitsNode.data = stats.splits.toString();
        testsNode.data = stats.tests.toString();
        collisionsNode.data = stats.collisions.toString();
        reactionsNode.data = stats.reactions.toString();
        next_update_t = t + update_interval;
    };

    return {'update': update};
};

export { makeStatsMeter };
