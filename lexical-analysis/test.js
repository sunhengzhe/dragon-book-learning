const Lexer = require("./lexer");

// test
const expr = `  const key = 123;
    // will be ignored
    const flag = true;
    /* just commend */ const a = key > 123 >= 123 < 123 <= 123 == 123;
`;
let nextIndex = 0;
const lexer = new Lexer();

while (nextIndex < expr.length) {
  const t = lexer.scan(() => expr[nextIndex++]);
  console.log(t);
}

console.log(lexer.line);
