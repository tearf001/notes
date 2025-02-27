生命周期
# Ref
示例来有3种, *Object ref(useRef() ref prop | (node)=>{} | useCallback(n=>{},[]))*

```tsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const getInitialInput = () => {
    const value = Math.random().toFixed(36);
    console.log("getInitialInput", value, ' at ', seq);
    return value
}
const doSomethingHeavy = (inputValue: any) => {
    console.log("doSomethingHeavy for ", inputValue, ' at ', seq);
    for (let i = 0; i < 10000000; i++) {
        // do nothing
    }
    console.log("doSomethingHeavy done for ", inputValue, ' at ', seq);
    return inputValue.split("").reverse().join("");
}
let seq = 0;

const Child = ({ heavy }: { heavy: string }) => {
    return <div>Heavy: {heavy}</div>
}
export function Component() {
    console.log("Component render, seq:", ++seq);
    const [inputValue, setInputValue] = useState(() => getInitialInput());
    const ref = useRef(null); // Object ref
    // const ref = (node) => { console.log(node) }; // unstable callback ref
    // const ref = useCallback(n=> console.log(n),[]); //stable callback ref
    useEffect(() => {
        console.log("useEffect, seq:", ++seq);
        return () => {
            console.log("useEffect cleanup: seq", ++seq);
        };
    }, [inputValue]);
    useLayoutEffect(() => {
        console.log("useLayoutEffect seq:", ++seq);
        return () => {
            console.log("useLayoutEffect cleanup, seq:", ++seq);
        }
    });
    const id = "textInput";
    const heavy = useMemo(() => {
        return doSomethingHeavy(inputValue)
    }, [inputValue]);

    return (
        <div>
            <label htmlFor={id}>Text</label>
            <input
                id={id}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type something to update"
                ref={ref}
                autoFocus
                onFocus={() => {
                    console.log("onFocus");
                }}
            />
            <Child heavy={heavy} />
        </div >
    )
}
```
## Topic Overview
![[react-生命周期.png]]
“渲染”是指 React 调用组件来确定在屏幕上显示什么。
React 的渲染过程必须始终是纯粹的，组件应该只返回其 JSX，并且不会更改渲染前存在的任何对象或变量.

以此类组件为例. 
## Mount
包含 
### Component() ***called*** 
组件调用(called):
- Evaluate local variables
- Initialize hooks
> [!important]
> In render, all local variables are *evaluated* and effects are *scheduled*. On the *initial* render, certain hooks are *initialized* in order of *appearance*. 按顺序初始化

- For `useState`, `useReducer`, and `useRef`, React **saves** the initial value *once* and ***ignores*** it on [*all subsequent renders*]().

- 作为性能优化, React 允许 passing a *fun* to get 初始状态 for `useState` 和 `useReducer`. React 调用 **initializer function** *strictly once* on *mount*.
- useMemo 返回的值是调用传递给它的函数的结果。
- React returns (***not calls!***) the function passed to `useCallback` during the ***initial*** render.
- For `useDeferredValue`, React returns the **same** value as the one you *provided*.

### React ***return*** elements
The component returns JSX (React elements). If it returns components, React will **recursively** render those components until there are only ***host***(DOM) elements left.

### ***插入***Dom节点s
DOM nodes are inserted from the returned React elements. This is called the ***commit*** and it’s handled by the renderer (*react-dom*).

One way we can tell a DOM element is created is by adding `autoFocus` attribute and an `onFocus` handler to it. The browser focuses the element *as soon as* it’s added to the DOM, which will trigger the `onFocus`.
**onFocus 的触发时机**：  
- autoFocus 确保 `<input/>` 在 DOM 挂载后立即聚焦，因此 onFocus 在 commit 阶段结束后、但 useLayoutEffect 之前触发。
```markdown
...
onFocus call seq: 2
useLayoutEffect seq: 3
...
```
### 设置ref
Refs provide a way to access DOM nodes. During the first render, the DOM nodes have not yet been created, so `ref.current` is `undefined`. React sets `ref.current` ***right after the commit***.  
>Besides a `useRef` object, you can pass a function to the ref attribute, a ref ***callback***. This function will be called with the DOM element at this point. 时机同set `ref.current=...`
>whether its stable or not once at mount cycle.

### useLayoutEffect
React will run the `useLayoutEffects` setups. Layout effects run before ***paint*** to avoid blocking *visual* updates. It can optionally return a cleanup function.React 将运行 useLayoutEffects 设置。布局效果在绘制之前运行，以避免阻止视觉更新。它可以选择返回清理函数。
Note that if the component returns **child** components, the layout effects are called *from* children ***upwards*** to the parent.请注意，如果组件返回子组件，则布局效果调用的顺序是从底向上.

### Paint
After rendering is done and React has updated the DOM, the browser will repaint the screen (“browser rendering”) and you’ll see the component appear on the screen.

```markdown
Component render, seq: 1
getInitialInput ()=> initvalue  at  1
doSomethingHeavy memo() done for [inputValue] at 1
end with jsx: seq 2 return (</>)
--onFocus--
useLayoutEffect seq: 3
useEffect seq: 4
=====触发重渲染=====
Component render, seq: 5
doSomethingHeavy for  -  at  5
doSomethingHeavy done for  -  at  5
end with jsx: seq 6 return (</>)
useLayoutEffect cleanup, seq: 7
useLayoutEffect seq: 8
useEffect cleanup: seq 9
useEffect seq: 10
```

### useEffects
After a short delay, React will run the `useEffect` setups. `useEffect` runs after paint because most types of work shouldn’t block the browser from updating the screen. The effect setup function can optionally return a *cleanup* function.

Note that if the component returns ***child*** components, the effects are called from children ***upwards*** to the parent.

## Update
React will ***call*** the component again in response to an update driven by the engine.
- Evaluate local variables
- Run necessary hooks
### 重新执行
By default, React will *recursively* render all child components in an update, even if their props are ***unchanged***.
Rerenders generally happen more than mount and unmount, write your components such that it can be rendered at any time.vdom的重渲染不仅仅发生在加载和卸载, 任何时候都可以.

组件被 ***reevaluted*** with new state and prop values. 组件***重算***当状态改变和prop改变.

- 对于 useState, useReducer, useRef来说, 令人惊讶，即使组件函数每次都被完整调用，钩子仍能保持状态的连续性，而无需重新初始化。注意这类hook有***初始值*.**
- 没有使用初始值的 hook, 或者不能称之为状态的hook来说, 比如使用***依赖数组***的, React 将新的钩子依赖项值与上次渲染时的值进行比较. 从而进行重新评估或者执行副作用.
- Hooks *without* dependencies or with *changed* dependencies will be called again. 
	- useMemo , 重新计算
	- useCallback, 重新计算
	- use? 待补充
- Those with unchanged dependencies will be *skipped*.
	- useMemo, 跳过callback, 返回旧值.
	- useCallback, 跳过 callback, 返回旧函数
	- use? 待补充.
有依赖数组的hooks
- `useEffect` (optional)
- `useLayoutEffect` (optional)
- `useMemo`
- `useCallback`
- `useImperativeHandle` (optional, rare)

> [!tip]
>   技术细节: react *compares* the new hooks ***dependency values*** to the values they **had** during the previous render *using* the `Object.is` comparison 

### 返回更新值
同mount 阶段
### Update DOM nodes
The changes of the updated React elements are committed to the DOM. Rendering does ***not*** always produce a DOM update. React only updates the DOM nodes if the React elements have changed.
### Unset refs
Before updating the DOM, React will set the affected `ref.current` values to `null`, *The identity of a ref prop* if changed, also forces it to update. A ==non-stable ref callback== is called with `null`, while a ==stable ref callback== is not called again.
在更新 DOM 之前，React 会将受影响(什么是受影响的)的ref.current 值设置为 null。*The identity of a ref prop*也会强制其更新。非稳定 ref 回调会使用 null 进行调用，而稳定 ref 回调不会再次调用。

**强制更新：** 如果 ref prop 的标识发生了变化，React 会认为 ref 发生了“更新”，并触发相应的操作：
	- 设置新 ref 对象的 .current 属性。`useRef()`
	- 如果 ref 是回调函数(仅函数引用变化)
		- 用 null 调用旧 ref 的回调函数（）。
		- 用新的 DOM 元素（或类组件实例）调用新 ref 的回调函数

> 这里要根据示例来. 有3种, *Object ref(useRef() ref prop | (node)=>{} | useCallback(n=>{},[]))*
>1. 对于 useRef 创建的 ref 对象，它的标识在组件的整个生命周期内都是不变的(同一个对象)。
>2.  对于回调函数，它的标识取决于你是如何创建这个回调函数的,  如果每次渲染都创建一个新的回调函数(如箭头函数)，那么每次渲染 时 ref 的标识都会 改变。
>3.  如果使用 useCallback 缓存回调函数，那么只有当 useCallback 的依赖数组发生变化时，ref 的标识才会 改变；否则，ref 的标识保持 不变。

> [!NOTE]
> **受影响的 ref.current 值?：** 这指的是哪些 ref.current 会被设置为 null。并不是所有的 ref.current 都会被设置为 null，只有“受影响的”才会被设置。那么，哪些是“受影响的”呢？
> - **组件卸载：** 如果一个组件被卸载(toggle)，那么与该组件关联的所有 ref.current 都会被设置为 null。
> - **ref 属性改变：** 如果一个组件的 ref 属性的值发生了变化（例如，从一个 useRef 对象变为另一个 useRef 对象，或者从一个回调函数变为另一个回调函数），那么 旧 的 ref.current 会被设置为 null。
**设置为 null：** 这是为了防止内存泄漏，并明确表示 ref 不再指向有效的 DOM 元素。



### useLayoutEffect cleans up
The cleanup functions returned by previous renders `useLayoutEffect`s are called. 
State or props in ***here*** will be that of the ***previous*** render. `useLayoutEffect` cleanups also run from child components up ***towards*** the parent, just like the setup.

### set useRef
After updating the DOM, React immediately sets refs to the corresponding DOM nodes. A ref callback will be called with the DOM node. A stable (guaranteed to not change on a re-render) ref callback will not be ***fired*** on update.

### useLayoutEffect setup
The `useLayoutEffect` setup functions will be called again. Note, if the layout effect has a dependency array, it will only run its dependencies have changed. In this example, it has no dependency array so it will run on every update.

### DOM Paint
After rendering is done and React updated the DOM, the browser will ***repaint*** the screen. Note that rendering ==does not always== produce a DOM update, so the component might not change visually.

### useEffect cleans up
React first runs the cleanup function of the previous renders `useEffect`. State or props in here are '***stale***', i.e. that of previous render.
`useEffect` cleanups also run from child components upwards to the parent, just like setup functions.

### useEffect setups
The `useLayoutEffect` setup function will be called with new values(本例). Note, if the effect has a dependency array, it will only run its dependencies have changed according to `Object.is`. In this case, the effect setup will only run if `inputValue` has changed. You can’t “choose” your dependencies. Your dependencies must include every reactive value you read in the effect.

## 卸载 unmount
On unmount, React will run the `useLayoutEffect` cleanup functions one final time
### useLayoutEffect cleans up
如上.
### unset useRef
React will set refs to `null` when the DOM node is removed. A ref callback, stable or unstable, will be called with `null`
### remove DOM nodes
The DOM nodes for this component are removed.
### useEffect cleans up
Finally, React runs the `useEffect` cleanup functions one final time.
# 附录
原理
扩展: 组件在变换迭代中, 使用最新的状态, 而不是初始值, 但是在销毁重建的时候, 又重新使用初值了, 那么我如何确定状态到底来自初始值还是持久状态?
#### 为什么会这样？
React 的钩子状态是与组件实例绑定的：
- **组件实例存活时**：状态存储在 React 的内部 fiber 树中，与组件的内存实例关联。只要组件不被卸载，状态就保持持久。
- **组件实例销毁时**：fiber 节点被移除，状态随之销毁。重新挂载时，React 从头开始创建新的 fiber 节点，因此钩子会使用初始值。
解决方案：持久化状态跨重建
- 将状态提升到父组件
- 使用外部状态管理（如 Redux 或 Zustand）
## 问答
Q: Will the `<Child />` component also re-render in an update of `<Parent />`? Does the type of update (self or by parent) trigger of `<Parent />` matter in this case?

Yes, rendering a component will cause *all components inside of* it to be rendered ***too***. In *normal* rendering, React does **not** check *if props have changed* — it will render child components ***unconditionally*** just because the parent rendered [1](https://julesblom.com/writing/react-hook-component-timeline#user-content-fn-standardrenderbehavior).

In this example, both types of update (self & parent) will cause `<Child />` to rerender. The fact that the `heavy` prop is made stable by `useMemo` ==does not prevent== a re-render of `<Child />`. If the `<Child/>` component is ***wrapped*** in `React.memo`, it will not re-render in ***passive*** updates, only a state update of `inputValue` would trigger an update for it.

## 为什么ref如此特色
我想知道为什么 "ref 属性： 由于 ref 属性的值（回调函数）在后续渲染中没有变化，React 认为没有必要重新调用回调函数。 React 只有在 ref 属性的值发生变化时，才会用 null 调用旧的 ref 回调，用新的 DOM 元素调用新的 ref 回调"? 
显然这是有ref挂载元素的一个组件prop, 甚至都不是该元素对应的DOM的attribute, 例子div, 它可能还有别的属性,都是React.createElement的第二个参数, 为什么ref看起来如此特殊?

**1. `ref` 不是普通的 prop**

* 虽然 `ref` 在 JSX 中看起来像prop（例如 `<div ref={...} className="..." />`)但 React 对它的处理方式与 `className`、`style` 或任何自定义 prop *完全不同*。
*  `ref` *不会* 出现在组件的 `props` 中。React 在处理 JSX 元素时会 *拦截* `ref` 属性，进行特殊处理

**2. `ref` 是 React 的指令**

*  你可以把 `ref` 看作是给 React 的一个*指令*，而不是给组件的数据。这个指令告诉 React：
    *"请把这个 DOM 元素的**引用**保存起来，并在特定的时机（挂载、卸载、`ref` 改变）时,更新 `useRef` 创建的对象的 `current` 属性。或**调用**我提供的回调函数"
*   React 维护着一个内部的映射关系，将组件实例与它们的 `ref` 关联起来。

**3. React 如何处理 `ref`**
以下是 React 处理 `ref` 的大致流程
   a. **解析 JSX**（例如 `<div ref={myRef} />`）时，它会识别出 `ref` 属性。
   b. **拦截 `ref`：** React *不会* 传递给组件`props` 它会把 `ref` 的值（回调函数或 `useRef` 对象）单存
   c. **组件渲染：** React 渲染组件。Insert/Update DOM
   d. **DOM 操作：** 如果React对应的组件渲染了一个原生 DOM 元素（如 `<div>`)
   e. **`ref` 挂载：**  在 DOM 节点被创建并插入(组件挂载)，React 会检查是否有关联的 `ref`。如果有.
	-  `ref` 是一个回调函数，将 DOM 节点作为参数传入调用。
	-  `ref`是一个通过`useRef`创建的对象，React会更新该对象的`.current`属性=dom。
   f. **`ref`更新：** 如果在组件更新过程中，`ref` 属性的值发生了变化（例如，从一个回调函数变为另一个回调函数(不稳定回调)，或者从一个 `useRef` 对象变为另一个 `useRef` 对象, 或者不再被赋予元素.(不稳定组件），React 会：
        *  如果旧`ref`是回调函数, 用 `null` 调用旧 `ref` 的callback(上一次)。
        *  如果新`ref`是回调函数, 用新的 DOM 元素（或类组件实例）调用新 `ref` 的callback
        *  如果旧的refObject变化了, 更新新`ref`对象的`.current`属性。
    如果`ref`没有发生变化;

   g. **`ref` 卸载：**  当组件从 DOM 中移除时（卸载），React 会用 `null` 调用 `ref` 的回调函数（如果 `ref` 是回调函数）, 或将`ref`对象的`.current`属性设置为`null`。

**4. 为什么 `ref` 特殊？**

`ref` 之所以特殊，是因为：
* **直接访问 DOM：** `ref` 提供了绕过 React 的声明式数据流，直接访问底层 DOM 元素或类组件实例的能力。  这在某些情况下是必要的，例如：
    *   管理焦点
    *   触发动画
    *   集成第三方 DOM 库
    *   测量 DOM 元素尺寸和位置
* **与 React 生命周期紧密结合：** `ref` 回调函数的调用时机与 React 组件的生命周期（挂载、更新、卸载）紧密相连。使得我们可以精确地控制何时获取和释放对 DOM 元素的引用。
* **性能优化：** 通过 `useCallback` 缓存 `ref` 回调函数，可以避免不必要的 DOM 操作和组件重新渲染，从而提高性能。
* **不触发渲染**: 通过`useRef`创建的ref对象，其`.current`属性的改变*不会*触发重新渲染.

**5. 与普通 props 的对比**

| 特性   | `ref`                                                                                                                   | 普通 props              |
| ---- | ----------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 处理   | 不会传递给组件(而是相反), React拦截并单独保存                                                                                             | 会                     |
| 用途   | 获取 DOM 元素或类组件实例的引用；在函数组件中存储可变值（`useRef`）且不触发重新渲染。                                                                       | 向组件传递数据               |
| 调用时机 | 组件挂载时（传入 DOM 元素或类组件实例）；组件卸载时（传入 `null`）；`ref` 属性的值变化时（先用 `null` 调用旧的，再用新的 DOM 元素或实例调用新的）。                               | 组件渲染时                 |
| 生命周期 | 紧密结合                                                                                                                    | 无直接关系                 |
| 影响渲染 | 如果是 `useRef` 创建的 ref 对象，改变其 `.current` 属性*不会*触发重新渲染。 如果是回调函数，回调函数内部引起的 state 变化会触发更新，但回调函数本身被调用（比如挂载和卸载）并不会***直接***引起更新 | 普通 props 的变化会触发组件重新渲染 |

