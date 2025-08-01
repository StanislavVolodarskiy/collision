const mulberry32 = a => {
    a |= 0;
    return () => {
        a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, a | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

export { mulberry32 };
