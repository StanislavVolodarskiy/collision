import * as dom from './modules/dom.js';
import { onAnimationFrames } from './modules/game_loop.js';
import { makeFpsMeter } from './modules/fps_meter.js';
import { makeStatsMeter } from './modules/stats_meter.js';
import { makeCanvasDisplay } from './modules/canvas_display.js';
import * as physics from './modules/physics.js';
import { mulberry32 } from './modules/mulberry32.js';

const main = () => {
    const body = document.getElementById('demo');
    const width = 1400;
    const height = 600;
    dom.createTextNode(body, 'FPS: ');
    const fpsMeter = makeFpsMeter(body);
    dom.createTextNode(body, ' | Statistics: ');
    const statsMeter = makeStatsMeter(body);
    const canvasDisplay = makeCanvasDisplay(body, width, height);

    const randomBalls = (n, maxR, minR, v) => {
        const rng = mulberry32(42);
        const balls = [];

        let r = maxR;
        for (let i = 0; i < n; ++i) {
            const x = r + (width  - 2 * r) * rng();
            const y = r + (height - 2 * r) * rng();
            const a = 2 * Math.PI * rng();
            balls.push(physics.makeBall(
                r ** 2, r, x, y, v * Math.cos(a), v * Math.sin(a)
            ));
            r = minR + 0.92 * (r - minR);
        }

        return balls;
    };

    const balls = randomBalls(8000, 80, 2.5, 50);

    const time = () => performance.now() / 1000;

    const collision = [
        physics.noCollision,
        physics.completeCollision,
        physics.makeOptimizedCollision(width, height, 8, 20)
    ][2];

    let last_t = time();
    onAnimationFrames(() => {
        const t = time();
        fpsMeter.update(t);
        const stats = physics.makeStats();
        physics.update(width, height, t - last_t, collision, balls, stats);
        statsMeter.update(stats);
        canvasDisplay.repaint(balls);
        last_t = t;
        return true;
    });
};

document.addEventListener('DOMContentLoaded', main); 
