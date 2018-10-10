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