const move = (balls, dt) => {
    for (const b of balls) {
        b.x += dt * b.vx;
        b.y += dt * b.vy;
    }
};

const noCollision = (balls, stats) => {};

const completeCollision = (balls, stats) => {
    for (let i = 0; i < balls.length; ++i) {
        const si = balls[i];
        for (let j = i + 1; j < balls.length; ++j) {
            const sj = balls[j];
            const dx = sj.x - si.x;
            const dy = sj.y - si.y;
            const norm = (dx ** 2 + dy ** 2) ** 0.5;
            if (norm <= si.radius + sj.radius && 0 < norm) {
                ++stats.collisions;
                const ndx = dx / norm;
                const ndy = dy / norm;
                const v1 = ndx * si.vx + ndy * si.vy;
                const v2 = ndx * sj.vx + ndy * sj.vy;
                if (v1 - v2 <= 0) {
                    continue;
                }
                ++stats.reactions;
                const v = (si.mass * v1 + sj.mass * v2) / (si.mass + sj.mass);
                const dv1 = 2 * (v - v1);
                const dv2 = 2 * (v - v2);

                si.vx += dv1 * ndx;
                si.vy += dv1 * ndy;
                sj.vx += dv2 * ndx;
                sj.vy += dv2 * ndy;
            }
        }
    }
    stats.tests += balls.length * (balls.length - 1) / 2;
};

const makeOptimizedCollision = (width, height, maxDepth, maxLeafSize) => {

    const collision = (balls, stats) => {
        const collide = (depth, sx, sy, step, balls) => {
            if (depth === 0 || balls.length <= maxLeafSize) {
                completeCollision(balls, stats);
            } else {
                stats.splits += balls.length;
                const q1 = [];
                const q2 = [];
                const q3 = [];
                const q4 = [];
                for (const b of balls) {
                    const { x, y, radius } = b;
                    const dx = sx - x;
                    const dy = sy - y;
                    if (-radius < dx) {
                        if (-radius < dy) { q3.push(b); }
                        if ( radius > dy) { q2.push(b); }
                    }
                    if (radius > dx) {
                        if (-radius < dy) { q4.push(b); }
                        if ( radius > dy) { q1.push(b); }
                    }
                }
                collide(depth - 1, sx + step, sy + step, step / 2, q1);
                collide(depth - 1, sx - step, sy + step, step / 2, q2);
                collide(depth - 1, sx - step, sy - step, step / 2, q3);
                collide(depth - 1, sx + step, sy - step, step / 2, q4);
            }
        };

        collide(
            maxDepth,
            width / 2,
            height / 2,
            Math.max(width, height) / 4,
            balls
       );
    };

    return collision;
};

const wallCollision = (width, height, balls) => {
    for (const b of balls) {
        if (b.x <= b.radius && b.vx < 0) {
            b.vx = -b.vx;
        }
        if (width - b.radius <= b.x && b.vx > 0) {
            b.vx = -b.vx;
        }
        if (b.y <= b.radius && b.vy < 0) {
            b.vy = -b.vy;
        }
        if (height - b.radius <= b.y && b.vy > 0) {
            b.vy = -b.vy;
        }
    }
};

const makeBall = (mass, radius, x, y, vx, vy) =>
    ({ mass, radius, x, y, vx, vy });

const makeStats = () => ({ splits: 0, tests: 0, collisions: 0, reactions: 0 });

const update = (width, height, dt, collision, balls, stats) => {
    move(balls, dt);
    collision(balls, stats);
    wallCollision(width, height, balls);
};

export {
    noCollision,
    completeCollision,
    makeOptimizedCollision,
    makeBall,
    makeStats,
    update
};
