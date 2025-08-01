const onAnimationFrames = f => {
    const step = t => {
        if (f()) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

export { onAnimationFrames };
