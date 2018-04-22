/**
 * parse
 * S -> 0 S 1 | 0 1
 *
 * 换一个思路：
 * S -> '0' R
 * R -> S '1' | '1'
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

let lookahead = '';
let userInput = '';
let curIndex = 0;

function report(msg) {
  console.error(msg);
}

function nextToken() {
  curIndex = curIndex + 1;
  lookahead = userInput[curIndex];
}

function match(terminal) {
  if (lookahead === terminal) {
    nextToken();
  } else {
    report('syntax error');
  }
}

function r() {
  if (lookahead === '0') {
    s();
    match('1');
  } else {
    match('1');
  }
}

function s() {
  if (lookahead !== '0') {
    return report('syntax error');
  }

  nextToken();
  r();
}

rl.on('line', function (line) {
  curIndex = 0;
  userInput = line;
  lookahead = userInput[curIndex];
  s();
  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});
