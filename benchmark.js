import { mulberry32 } from './lib/mulberry32.js';
import * as physics from './lib/physics.js';

const width = parseFloat(process.argv[2]);
const height = parseFloat(process.argv[3]);

const nBalls = parseInt(process.argv[4]);
const maxR = parseFloat(process.argv[5]);
const minR = parseFloat(process.argv[6]);
const v = parseFloat(process.argv[7]);
const collistionMode = parseInt(process.argv[8]);
const collisionMaxDepth = parseInt(process.argv[9]);
const collisionLeafSize = parseInt(process.argv[10]);

process.stdout.write(`box: ${width}*${height}\n`);
process.stdout.write(`balls: n ${nBalls}, radius ${maxR} -> ${minR}, v ${v}\n`);
process.stdout.write(`collision: mode ${collistionMode}, max depth ${collisionMaxDepth}, leaf size ${collisionLeafSize}\n`);

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

const balls = randomBalls(nBalls, maxR, minR, v);

const density = (() => {
    let s = 0;
    for (const b of balls) {
        s += Math.PI * b.radius ** 2;
    }
    return s / (width * height);
})();
process.stdout.write(`density: ${density}\n`);

const collision = [
    physics.noCollision,
    physics.completeCollision,
    physics.makeOptimizedCollision(width, height, collisionMaxDepth, collisionLeafSize)
][collistionMode];

for (let i = 0; ; ++i) {
    const start = performance.now();
    const stats = physics.makeStats();
    physics.update(width, height, 1 / 60, collision, balls, stats);
    const finish = performance.now();
    const duration = (finish - start) / 1000;
    process.stdout.write(`${i} ${duration} ${stats.splits} ${stats.tests} ${stats.collisions} ${stats.reactions}\n`);
};
