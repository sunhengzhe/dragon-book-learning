## Exercises for Section 2.4

### 2.4.1

为下列文法构造递归下降语法分析器：

- 1) S -> + S S | - S S | **a**
- 2) S -> S ( S ) S | **∈**
- 3) S -> 0 S 1 | 0 1

1) S -> + S S | - S S | **a**
nodejs 版：[2.4.1_1.js](./2.4.1_1.js)

```
void S() {
  switch (lookahead) {
    case '+':
      match('+');
      S();
      S();
      break;
    case '-':
      match('-');
      S();
      S();
      break;
    case 'a':
      match('a');
      break;
    default:
      report('syntax error');
  }
}

void match(terminal t) {
  if (lookahead == t) {
    lookahead = nextTerminal;
  } else {
    report('syntax error');
  }
}
```

2) S -> S ( S ) S | **∈**
nodejs 版：[2.4.1_2.js](./2.4.1_2.js)

```
void S(){
  if(lookahead == "("){
    match("("); S(); match(")"); S();
  }
}
```

3) S -> 0 S 1 | 0 1
nodejs 版：[2.4.1_3.js](./2.4.1_3.js)

```
void S(){
  switch (lookahead) {
    case '0':
      match('0');
      S();
      match('1');
      break;
    case '1':
      break;
    default:
      report('syntax error');
  }
}
```
