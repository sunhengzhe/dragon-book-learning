/**
 * 简单的词法分析器
 */
const Util = {
  isDigit(value) {
    return /\d/.test(value);
  },

  isLetter(value) {
    return /\w/.test(value);
  },

  isSpace(value) {
    return /\s/.test(value);
  },

  isLineBreak(value) {
    return /\n/.test(value);
  }
}

/** Token */
class Token {
  constructor(tag) {
    this.tag = tag;
  }
}

/** Tag */
class Tag {};
Tag.NUM = 256;
Tag.ID = 257;
Tag.TRUE = 258;
Tag.FALSE = 259;
Tag.GTE = 260;
Tag.LTE = 261;
Tag.GT = 262;
Tag.LT = 263;
Tag.EQ = 264;
Tag.ASSIGN = 265;

/** Number */
class Number extends Token {
  constructor(value) {
    super(Tag.NUM);
    this.value = value;
  }
}

/** Word */
class Word extends Token {
  constructor(tag, str) {
    super(tag);
    this.lexeme = str;
  }
}

/** Lexer */
class Lexer {
  constructor() {
    this.words = new Map();
    this.line = 1;
    this.peek = ' ';
    // 保留关键字
    this.reserve(new Word(Tag.TRUE, 'true'));
    this.reserve(new Word(Tag.FALSE, 'false'));
  }

  reserve(word) {
    this.words.set(word.lexeme, word);
  }

  scan(nextToken) {
    // 过滤空白符与换行符
    for (;; this.peek = nextToken()) {
      if (Util.isLineBreak(this.peek)) {
        this.line++;
      } else if (Util.isSpace(this.peek)) {
        continue;
      } else if (this.peek === '/') {
        let peek = nextToken();
        if (peek === '/') {
          // 单行注释
          do {
            this.peek = nextToken();
          } while (!Util.isLineBreak(this.peek));
          continue;
        } else if (peek === '*') {
          // 块注释
          peek = nextToken();
          let peek2 = nextToken();
          while (peek !== '*' && peek2 !== '/') {
            peek = peek2;
            peek2 = nextToken();
          }

          this.peek = nextToken();
          continue;
        }
      } else if (!this.peek) {
        // 结束
        return Lexer.$;
      } else {
        break;
      }
    }

    if (this.peek === '>') {
      this.peek = nextToken();

      if (this.peek === '=') {
        this.peek = ' ';
        return new Word(Tag.GTE, '>=');
      }

      return new Token('>');
    }

    if (this.peek === '<') {
      this.peek = nextToken();

      if (this.peek === '=') {
        this.peek = ' ';
        return new Word(Tag.LTE, '<=');
      }

      return new Token('<');
    }

    if (this.peek === '=') {
      this.peek = nextToken();

      if (this.peek === '=') {
        this.peek = ' ';
        return new Word(Tag.EQ, '==');
      }

      return new Token('=');
    }

    // 提取数值型
    if (Util.isDigit(this.peek)) {
      let value = 0;
      do {
        value = 10 * value + parseInt(this.peek, 10);
        this.peek = nextToken();
      } while (Util.isDigit(this.peek));

      return new Number(value);
    }

    // 提取标识符
    if (Util.isLetter(this.peek)) {
      let lexeme = '';
      do {
        lexeme += this.peek;
        this.peek = nextToken();
      } while (Util.isLetter(this.peek));

      if (this.words.has(lexeme)) {
        return this.words.get(lexeme);
      }

      const word = new Word(Tag.ID, lexeme);
      this.words.set(lexeme, word);
      return word;
    }

    const token = new Token(this.peek);
    this.peek = ' ';
    return token;
  }
}

Lexer.$ = '_lexer_$'

module.exports = Lexer;