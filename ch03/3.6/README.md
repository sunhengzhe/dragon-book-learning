## 3.6 有穷自动机

确定的有穷自动机（DFA）是不确定的有穷自动机（NFA）的一个特例，其中：

1. 没有输入 ∈ 之上的转换动作
2. 对每个状态 s 和每个输入符号 a，有且只有一条标号为 a 的边离开 s。

### 3.6.5
给出如下练习中的 NFA 的转换表：

1）练习 3.6.3

|      | a        | b        | ∈     |
| ---- | -------- | -------- | ----- |
| 0    | { 0, 1 } | { 0 }    | Ø     |
| 1    | { 1, 2}  | { 1 }    | Ø     |
| 2    | { 2 }    | { 2, 3 } | { 0 } |
| 3    | Ø        | Ø        | Ø     |

2）练习 3.6.4

|      | a        | b        | ∈     |
| ---- | -------- | -------- | ----- |
| 0    | { 1 }    | Ø        | { 3 } |
| 1    | Ø        | { 2 }    | { 0 } |
| 2    | Ø        | { 3 }    | { 1 } |
| 3    | { 0 }    | Ø        | { 2 } |

3）图 3-26

|      | a     | b     | ∈        |
| ---- | ----- | ----- | -------- |
| 0    | Ø     | Ø     | { 1, 3 } |
| 1    | { 2 } | Ø     | Ø        |
| 2    | { 2 } | Ø     | Ø        |
| 3    | Ø     | { 4 } | Ø        |
| 4    | Ø     | { 4 } | Ø        |