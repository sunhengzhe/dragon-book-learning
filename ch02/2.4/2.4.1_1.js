/**
 * parse
 * S -> + S S | - S S | a
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

function match(terminal) {
  if (lookahead === terminal) {
    curIndex = curIndex + 1;
    lookahead = userInput[curIndex];
  } else {
    report('syntax error');
  }
}

function s() {
  switch(lookahead) {
    case '+':
      match('+');
      s();
      s();
      break;
    case '-':
      match('-');
      s();
      s();
      break;
    case 'a':
      match('a');
      break;
    default:
      report('syntax error');
  }
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
