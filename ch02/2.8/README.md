## 生成中间码

### 左值与右值

求左值

```
Expr lvalue(x: Expr) {
  if (x 是一个 id 结点) return x,
  else if (x  是一个 Access(y, z) 结点，且 y 是一个 id 结点) {
    return new Access(y, rvalue(z));
  }
  else error;
}
```

求右值

```
Expr rvalue(x: Expr) {
  if (x 是一个 Id 或者 Constant 结点) return x,
  else if (x 是一个 Op(op, y, z) 或者 Rel(op, y, z) 结点) {
    t = 新的临时名字;
    生成对应于 t = rvalue(y) op rvalue(z) 的指令串;
    return 一个代表 t 的新结点;
  }
  else if (x 是一个 Access(y, z) 的结点) {
    t = 新的临时名字;
    调用 lvalue(x), 它返回一个 Access(y, z') 的结点;
    生成对应于 t = Access(y, z') 的指令串;
    return 一个代表 t 的新结点;
  }
  else if (x 是一个 Assign(y, z) 结点) {
    z' = rvalue(z);
    生成对应于 lvalue(y) = z' 的指令串
    return z';
  }
}
```

例 2.20 当将函数 rvalue 应用于 a[i] = 2*a[j-k] 的语法树时

这是一个 Assign 结点，求 lvalue(a[i]) = rvalue(2 * a[j - k])
2 * a[j - k] 为一个 Op(op, y, z) 结点，求 rvalue(2) op rvalue(a[j-k])
a[j-k] 为 Access(y, z) 结点，求 lvalue(a[j-k])
求 rvalue(j-k)
求 rvalue(j) op rvalue(k)

t3 = j - k
t2 = a[t3]
t1 = 2*t2
a[i] = t1

### 2.8.1
为 for 语句定义一个类 For

for(expr1; expr2; expr3) stmt

```javascript
class For {
  constructor(expr1, expr2, expr3, stmt) {
    this.Expr1 = expr1;
    this.Expr2 = expr2;
    this.Expr3 = expr3;
    this.Stmt = stmt;
    this.start = newlabel();
    this.after = newlabel();
  }

  gen() {
    Expr n1 = this.Expr1.rvalue();
    emit(this.start + ':');
    Expr n2 = this.Expr2.rvalue();
    emit('ifFalse ' + n2.toString() + ' goto ' + this.after);
    this.Stmt.gen();
    this.Expr3.gen();
    emit('goto ' + this.start);
    emit(this.after + ':');
  }
}
```