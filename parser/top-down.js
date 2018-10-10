const input = process.argv[2];

let next = 0;

function term(token) {
    return toToken(input[next++]) === token
}

const INT = 1;
const TIMES = '+';
const MUL = '*';
const OPEN = '(';
const CLOSE = ')'

function toToken(str) {
    if (/\d+/.test(str)) {
        return INT;
    }

    if (str === '+') {
        return TIMES;
    }

    if (str === '*') {
        return MUL;
    }

    if (str === '(') {
        return OPEN;
    }

    if (str === ')') {
        return CLOSE;
    }
}

/**
 * E -> T | T + E
 * T -> int | int * T | (E)
 */

function E() {
    const save = next;
    return (next = save, E1()) || (next = save, E2());
}

function E1() {
    return T();
}

function E2() {
    return T() && term('+') && E()
}

function T() {
    const save = next;
    return (next = save, T1()) ||
    (next = save, T2()) ||
    (next = save, T3());
}

function T1() {
    return term(INT);
}

function T2() {
    return term(INT) && term(MUL) && T();
}

function T3() {
    return term(OPEN) && E() && term(CLOSE);
}

console.log(E());