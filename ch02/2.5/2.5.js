/**
 * 简单表达式的中缀表达式转后缀表达式
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

class Parser {
  constructor(expression) {
    this.curIndex = 0;
    this.expression = expression;
    this.lookahead = expression[this.curIndex];
  }

  nextToken() {
    this.lookahead = this.expression[++this.curIndex];
  }

  expr() {
    this.term();
    this.rest();
  }

  match(char) {
    if (this.lookahead === char) {
      this.nextToken();
    } else {
      console.error('syntax error');
    }
  }

  term() {
    if (/\d/.test(this.lookahead)) {
      const temp = this.lookahead;
      this.match(this.lookahead);
      rl.write(temp);
    } else {
      console.error('syntax error');
    }
  }

  rest() {
    while(true) {
      if (this.lookahead === '+') {
        this.match('+');
        this.term();
        rl.write('+');
        continue;
      } else if (this.lookahead === '-') {
        this.match('-');
        this.term();
        rl.write('-');
        continue;
      }
      break;
    }
  }
}

rl.on('line', function (line) {
  const parser = new Parser(line);
  parser.expr();
  rl.clearLine(process.stdin, 1);
  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});
