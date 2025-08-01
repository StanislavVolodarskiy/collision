import { createElement } from './dom.js';

const makeCanvasDisplay = (parent_, width, height) => {
    const context = createElement(parent_, 'canvas', {
        width,
        height
    }).getContext('2d');
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    const repaint = circles => {
        context.clearRect(0, 0, width, height);

        context.beginPath();
        context.rect(0, 0, width, height);
        context.stroke();
        for (const {x, y, radius} of circles) {
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.stroke();
        }
    };

    return { repaint };
};

export { makeCanvasDisplay };
