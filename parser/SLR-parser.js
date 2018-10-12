/**
 * Grammar
 * ---
 * S' -> E
 * E -> T+E | T
 * T -> int*T | int | (E)
 */

 /**
  * NFA
  * ---
  * [S' -> .E] -E-> [S' -> E.]
  * [S' -> .E] -ε-> [E -> .T+E]
  * [S' -> .E] -ε-> [E -> .T]
  *
  * [E -> .T+E] -T-> [E -> T.+E]
  * [E -> .T+E] -ε-> [T -> .int*T]  // production of T
  * [E -> .T+E] -ε-> [T -> .int]    // production of T
  * [E -> .T+E] -ε-> [T -> .(E)]    // production of T
  *
  * [E -> .T] -T-> [E -> T.]
  * [E -> .T] -ε-> [T -> .int*T]
  * [E -> .T] -ε-> [T -> .int]
  * [E -> .T] -ε-> [T -> .(E)]
  *
  * [E -> T.+E] -+-> [E -> T+.E]
  *
  * [T -> .int*T] -int-> [T -> int.*T]
  *
  * [T -> .int] -int-> [T -> int.]
  *
  * [T -> .(E)] -(-> [T -> (.E)]
  *
  * [E -> T+.E] -E-> [E -> T+E.]
  * [E -> T+.E] -ε-> [E -> .T+E]    // production of E
  * [E -> T+.E] -ε-> [E -> .T]      // production of E
  *
  * [T -> int.*T] -*-> [T -> int*.T]
  *
  * [T -> (.E)] -E-> [T -> (E.)]
  * [E -> (.E)] -ε-> [E -> .T+E]    // production of E
  * [E -> (.E)] -ε-> [E -> .T]      // production of E
  *
  * [T -> int*.T] -T-> [T -> int*T.]
  * [T -> int*.T] -ε-> [T -> .int*T]
  * [T -> int*.T] -ε-> [T -> .int]
  * [T -> int*.T] -ε-> [T -> .(E)]
  *
  * [T -> (E.)] -)-> [T -> (E).]
 */

 /**
  * DFA
  * ---
  * A:[                B:[
  *  [S' -> .E]           [S' -> E.]
  *  [E -> .T+E]
  *  [E -> .T]
  *  [T -> .int*T] -E->
  *  [T -> .int]
  *  [T -> .(E)]
  * ]                    ]
  *
  *                    C:[
  * A -T->                [E -> T.+E]
  *                       [E -> T.]
  *                      ]
  *
  *                    D:[
  * A -int->              [T -> int.*T]
  *                       [T -> int.]
  *                      ]
  *
  *                    E:[
  *                       [T -> (.E)]
  *                       [E -> .T+E]
  * A -(->                [E -> .T]
  *                       [T -> .int*T]
  *                       [T -> .int]
  *                       [T -> .(E)]
  *                      ]
  *
  *                    F:[
  *                       [E -> T+.E]
  *                       [E -> .T+E]
  * C -+->                [E -> .T]
  *                       [T -> .int*T]
  *                       [T -> .int]
  *                       [T -> .(E)]
  *                      ]
  *
  *                    G:[
  *                       [T -> int*.T]
  *                       [T -> .int*T]
  * D -*->                [T -> .int]
  *                       [T -> .(E)]
  *                      ]
  *
  *                    H:[
  * E -E->                [T -> (E.)]
  *                      ]
  *
  * E -T->             C
  *
  * E -int->           D
  *
  * E -(->             E
  *
  *                    I:[
  * F -E->                [E -> T+E.]
  *                      ]
  *
  * F -T->             C
  *
  * F -int->           D
  *
  * F -(->             E
  *
  *                    J:[
  * G -T->                [T -> int*T.]
  *                      ]
  *
  * G -int->           D
  *
  * G -(->             E
  *
  *                    K:[
  * H -)->                [T -> (E).]
  *                      ]
 */

 /**
  * - Idea: Assume
  *   - stack contains α
  *   - next input is t
  *   - DFA input α terminates in state s
  * - Reduce by X -> β if
  *   - s contains X -> β.
  *   - t ∈ FOLLOW(X) # 基于 LR 的改进
  * - shift if
  *   - s contains X -> β.tw
  */

const Lexer = require('../lexical-analysis/lexer');

let nextIndex = 0;
const lexer = new Lexer();

/**
 *  * S' -> E
 * E -> T+E | T
 * T -> int*T | int | (E)
 */
const PRODUCTIONS = {
  S: [
    ['E']
  ],
  E: [
    ['T', '+', 'E'],
    ['T'],
  ],
  T: [
    ['int', '*', 'T'],
    ['int'],
    ['(', 'E', ')']
  ],
};

const FOLLOW_SET = {
  'S': ['$'],
  'E': ['$', ')'],
  'T': ['$', ')', '+'],
}

class DFA {
  constructor() {
    this.finalStates = ['B', 'C', 'D', 'I', 'J', 'K'];
    this.stateMap = {
      A: {
        E: 'B',
        T: 'C',
        'int': 'D',
        '(': 'E',
      },
      C: {
        '+': 'F',
      },
      D: {
        '*': 'G',
      },
      E: {
        E: 'H',
        T: 'C',
        'int': 'D',
        '(': 'E',
      },
      F: {
        E: 'I',
        T: 'C',
        'int': 'D',
        '(': 'E',
      },
      G: {
        T: 'J',
        'int': 'D',
        '(': 'E',
      },
      H: {
        ')': 'K',
      },
    };
  }
  getNextState(from, input) {
    const nextStateMap = this.stateMap[from] || {}
    return nextStateMap[input];
  }
  isFinalState(state) {
    return this.finalStates.includes(state);
  }
  isShouldReduce(state, input) {
    if (state === 'B') {
      return FOLLOW_SET['S'].includes(input);
    } else if (state === 'C') {
      return FOLLOW_SET['E'].includes(input);
    } else if (state === 'D') {
      return FOLLOW_SET['T'].includes(input);
    } else if (state === 'I') {
      return FOLLOW_SET['E'].includes(input);
    } else if (state === 'J') {
      return FOLLOW_SET['T'].includes(input);
    } else if (state === 'K') {
      return FOLLOW_SET['T'].includes(input);
    }
  }
  reduce(stack, state, nextTag) {
    const _reduce = (prodLeft, prodRight) => {
      let before = '';
      for (let i = 0; i < prodRight.length; i++) {
        const pair = stack.pop();
        before = pair[0] + before;
      }

      console.log('REDUCE: ', before + ' -> ', prodLeft);

      if (prodLeft === 'S') {
        return true;
      }

      const prevState = stack.length > 0 ? stack[stack.length - 1][1] : 'A';
      const newState = this.getNextState(prevState, prodLeft);

      if (!newState) {
        throw new Error('no state found');
      }

      stack.push([prodLeft, newState]);

      if (this.isShouldReduce(newState, nextTag)) {
        return this.reduce(stack, newState, nextTag);
      }
    }

    if (state === 'B') {
      // means success
      return _reduce('S', PRODUCTIONS['S'][0]);
    } else if (state === 'C') {
      return _reduce('E', PRODUCTIONS['E'][1]);
    } else if (state === 'D') {
      return _reduce('T', PRODUCTIONS['T'][1]);
    } else if (state === 'I') {
      return _reduce('E', PRODUCTIONS['E'][0]);
    } else if (state === 'J') {
      return _reduce('T', PRODUCTIONS['T'][0]);
    } else if (state === 'K') {
      return _reduce('T', PRODUCTIONS['T'][2]);
    }
  }
}

const expr = process.argv[2] || '(3 * 4 + 8)';

const inputStack = [];
let currentState = 'A';

const dfa = new DFA();

let tag;
let nextTag;
while (tag !== '$') {
  tag = nextTag ? nextTag : lexer.scan(() => expr[nextIndex++]).tag;
  tag = tag === 256 ? 'int' : tag;

  if (tag === '$') {
    if (inputStack.length > 0) {
      error();
    }
    return;
  }

  const token = lexer.scan(() => expr[nextIndex++]);
  if (token === Lexer.$) {
    nextTag = '$';
  } else {
    nextTag = token.tag;
  }

  currentState = dfa.getNextState(currentState, tag);
  inputStack.push([tag, currentState]);

  // check
  if (dfa.isFinalState(currentState) && dfa.isShouldReduce(currentState, nextTag)) {
    try {
      const isSuccess = dfa.reduce(inputStack, currentState, nextTag);
      if (isSuccess) {
        success();
        return;
      }
      currentState = inputStack[inputStack.length - 1][1];
    } catch (error) {
      error();
    }
  }

  console.log('STACK: ', inputStack)
}

function success() {
  console.log('\nSUCCESS!!!', expr, 'is a valid expression');
}

function error() {
  console.log('\nERROR!!!', expr, 'is not a valid expression');
}
