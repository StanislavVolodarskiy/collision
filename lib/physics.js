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
    const size = Math.max(width, height);

    const split = square => {
        const [x, y, size, balls] = square;
        const q1 = [];
        const q2 = [];
        const q3 = [];
        const q4 = [];
        for (const b of balls) {
            if (b.x - b.radius < x) {
                if (b.y - b.radius < y) {
                    q3.push(b);
                }
                if (b.y + b.radius > y) {
                    q2.push(b);
                }
            }
            if (b.x + b.radius > x) {
                if (b.y - b.radius < y) {
                    q4.push(b);
                }
                if (b.y + b.radius > y) {
                    q1.push(b);
                }
            }
        }
        return [
            [x + size / 4, y + size / 4, size / 2, q1],
            [x - size / 4, y + size / 4, size / 2, q2],
            [x - size / 4, y - size / 4, size / 2, q3],
            [x + size / 4, y - size / 4, size / 2, q4],
        ];
    };

    const collision = (balls, stats) => {
        const collide = (depth, square) => {
            const balls = square[3];
            if (depth === 0 || balls.length <= maxLeafSize) {
                completeCollision(balls, stats);
            } else {
                stats.splits += balls.length;
                for (const q of split(square)) {
                    collide(depth - 1, q);
                }
            }
        };

        collide(
            maxDepth,
            [width / 2, height / 2, Math.max(width, height), balls]
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
