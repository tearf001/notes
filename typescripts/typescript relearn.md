# extends
## 扩展关系
When the type on the *left* of the `extends` is *assignable* to the one on the *right*, result in getting the type in the *first* branch otherwise the *latter*
也就是说, 当extends 的左边类型(*实际上是值*) 可以赋值给 右边的类型; 或者说 左类型*作为子类型*扩展了右类型作为*基类型*.
>也就是子类型的值可以赋予为基类型的type , 这符合直觉. 反过来则不行.

```ts
type StringExtendAny = string extends any ? true: false; // true string 更窄, 是子类型. 它的值可以赋予给更宽的类型.
type StringExtendKnown = string extends unknown ? true: false; // true

type StringExtendLiteral = string extends 'unknown' ? true: false; // false;
type LiteralExtendAny = "literal" extends any ? true : false; // true
type LiteralExtendUnkown = "literal" extends unknown ? true : false; // true

type LiteralExtendLiteralObject = "literal" extends {} ? true : false; // true
type LiteralExtendobject = "literal" extends object ? true : false; // false

// 互相扩展. 可以互相赋值, 即使 object 被赋予更少的值.
type LiteralObjectExtendObject = {} extends object ? true: false; // true
type ObjectExtendObject = object extends {} ? true: false; // true

type UnkownExtendAny = unknown extends any ? true: false; // true
type AnyExtendUnkown = any extends unknown ? true: false; // true

// 几个奇异点
type wtf = any extends never ? true: false; // boolean    因为: any的值"不确定"能赋予never 类型
type wtf2 = unknown extends never ? true: false; // false 因为: unknown的值 `不能` 赋予never类变量.实际上除never自己之外,无类型可以!

// void 类似于 never 扩展 void的值非常少, 只有never, void, undefined, 加了2个
type void_never = never extends void ? true: false; // true. 一个 never的值, 允许赋给 void
type und_never = undefined extends void ? true: false; // true 一个 undefined的值, 允许赋给 void
// 那么什么样的值可以赋予给 void类型变量呢, 只有void, undefined, never

// undefined 类似于 never 和 void 但是 除了never 和 undefined
type void_extends = never extends undefined ? true: false; // true. 一个 never的值, 允许赋给 void
type void_extends2 = undefined extends undefined ? true: false; // true 一个 undefined的值, 允许赋给 void
type void_extends3 = void extends undefined ? true: false; // false 一个 void的值只能赋予给 void的类型.
// 那么什么样的值可以赋予给 undefined类型变量呢, 只有never, undefined


// never类型的值 可以赋予给任何类型的变量.
type neverExtendsAll = never extends string | boolean | undefined | null | never ? true: false; // true. 
// 小结: 一个是never的值, 可以赋予给任意类型的变量. 但是never类型只能接受never值
//       一个定义类型为undefined的值 只可以赋予给 void 和 undefined, any类型. 
				              作为类型, 它只能接受 never, undefined的值
//       一个定义类型为void的值 只可以赋予给 void类型, any类型. 
							  作为类型, 它只能接受 never, void, undefined的值
```
### 函数扩展
术语: ***扩展***. 也可以成为衍生, 子类, 它包括了原型的内容, 增加了内容, 体积变大(限制变多), 但是类型更*窄*了. 你可以理解, 身体胖了, 那么*活动场所*变窄了

参数组逆变(原型扩展应用, *宽进*>=), 参数逆变(原型扩展应用, *宽进*>=), 返回值 协变(应用扩展原型, *窄出*<=), 
 > 但是函数返回类型有个特殊情况, 若原型是`void, any, unkown`, 那么实际函数类型,可以返回任何值. 
 > 其他的返回类型, 则遵循*协变*规则, 也就是实际函数的返回类型*窄出*(包括`any, unknow`的扩展, 基于此可以把特殊情况限制到`void`)

- 技巧1: 当实际函数类型 () => ... 它的*参数部分*能扩展所有的函数类型的*参数部分*, 如果在`原型推断`(infer)得到的是`unkown`, spread 得到的是[]
- 技巧2: 原型是`(el: infer E, ...rest: infer R) => void` 或者`(el: infer E, ...rest: infer R) => infer Return` 它能被任何函数扩展
![[fun_type_extends.png]]
## 条件类型
```ts
type MessageOf<T extends { message: unknown }> = T["message"]; // 泛型约束
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never; // 泛型无约束(或接受更宽类型), 但在条件类型推断中`窄化`

interface Email {  message: string }
interface Dog {}

type EmailMessageContents = MessageOf<Email>; // string
type DogMessageContents = MessageOf<Dog>; // never
// 另一个例子
type Flatten<T> = T extends any[] ? T[number] : T;
```
条件类型推断
```js
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type; // 更优雅

type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never;

type Num = GetReturnType<() => number>; 
type Str = GetReturnType<(x: string) => string>; 
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>; 
```
# Typescript 重难点
## {} 和 object

两者互相扩展. 但object 在赋值的时候, 比{} 更窄. 它不能接受 string, number, boolean, symbol
![[objectandliterobject.png]]

> 注意, typeof null === 'object', 但是null 不是object. 
```ts
let obj: {} = {}; // 合法 {}类型表示一个除了null/undefined的对象，这个对象可以没有属性。比如基础类型, 甚至NaN

// {} 与 object 类型的区别 
// object: 表示任何非基本类型的值（即不是 string, number, boolean, symbol, null, undefined) 
// {} 更具体地表示一个 对象，但这个对象没有任何已知的属性。两者互相扩展, 但是 {} 扩展除 null和undfined之前的任何类型 
// 在 TypeScript 4.8+ 中， if (value !== null && value !== undefined) { value 的类型会被窄化为 {} }

let obj1: object = { name: "John" }; // 合法
let obj2: object = [1, 2, 3]; // 合法
let obj3: object = () => {}; // 合法
// let objNotExtendsPrimitive = 'string' && 1 && true && null && undefined && Symbol() // 错误

let obj4: {} = { name: "John" }; // 合法
let obj5: {} = [1, 2, 3]; // 合法: 数组也是对象,满足 {} 类型约束
let obj6: {} = () => {}; // 合法：函数也是对象, 满足{} 类型约束
let obj7: {} = "hello"; // 正确：字符串不是对象类型
let obj8: {} = true; // 正确：字符串不是对象类型
let obj9: {} = 1; // 正确：字符串不是对象类型

// let liter_empty_object_not_extend_null_nor_undefined: {} = undefined || null; // 错误

function fun(value: unknown) { 
  if (value !== null && value !== undefined) {
    // 在 TypeScript 4.8+ 中，value. 如果value类型是unkown会被窄化为 {}, 但如果是any则不会被窄化.
    // 但你仍然不能访问 value 上的任何属性，除非你进行类型断言
    console.log(value); // unkown
  }
}

// 泛型 Value 是动态类型, 根据实际参数类型 来推断运行时的泛型类型. 即 (type parameter) Value in f<Value>(value: Value extends {} ? Value : never): void
function f<Value>(value: Value extends {} ? Value : never) { 
  if (value !== null && value !== undefined) {
    // 在 TypeScript 4.8+ 中，value. 如果value类型是unkown会被窄化为 {}, 但如果是any则不会被窄化.
    // 但你仍然不能访问 value 上的任何属性，除非你进行类型断言
    console.log(value.prop); // 错误
  }
}

function f2(value: object) {
  if (value !== null && value !== undefined) {
    // 在 TypeScript 4.8+ 中，如果value类型仅在unkown会被窄化为 {}, 但如果是any/object 则不会被窄化.
    // 你同样不能访问 value 上的任何属性，除非你进行类型断言
    console.log(value); // 错误
  }
}

f(null);      // 编译时错误 // function f<null>(value: never): void. 通过参数反推泛型
f(undefined); // 编译时错误 // function f<undefined>(value: never): void
f({});        // OK       // function f<{}>(value: {}): void
f({a:1});     // OK       // function f<{a: number}>(value: {a: number}): void

f2(null);      // 编译时错误
f2(undefined); // 编译时错误
f2({});        //OK
f2({a:1});      // OK
```

## never
![[never.png]]