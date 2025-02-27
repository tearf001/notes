开发者长文
https://overreacted.io/a-complete-guide-to-useeffect/

**组件** render 中的每个函数（包括其中的事件处理程序、Effect、Timeout或 API 调用）都会***捕获***定义它的 render 调用的 props 和 state

无论你是从 props 中读取还是在组件内部“早期”读取 state，这并不重要。***它们不会改变***在单个 render的范围内，props 和 state 保持不变。（解构 props 使这一点更加明显)

Kingdoms will rise and turn into ashes, the Sun will shed its outer layers to be a white dwarf, and the last civilization will end. But nothing will make the props “seen” by the first render effect’s cleanup anything other than `{id: 10}`.  
王国将崛起并化为灰烬，太阳将脱落其外层成为白矮星，最后一个文明将结束。但有什么能使第一个渲染效果的清理“看到”的props成为除了*Captured then Value*之外的其他任何值。

That’s what allows React to deal with effects right ***after*** painting — and make your apps faster by default. *The old props are still there if our code needs them*.  
这就是允许 React 在绘制后立即处理 effects 的原因——并默认让你的应用程序更快。如果我们的代码需要，旧的 props 仍然存在。

官方文档
#  [生命周期](https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)
每个 React 组件都经历相同的生命周期：
- 当组件被添加到屏幕上时，它会进行组件的 **挂载**。
- 当组件接收到新的 props 或 state 时，通常是作为对交互的响应，它会进行组件的 **更新**。
- 当组件从屏幕上移除时，它会进行组件的 **卸载**。

这是一种很好的思考*组件*的方式，但并不适用于 Effect。

# 心智模型
当你从组件的角度思考时，很容易将 Effect 视为在特定时间点触发的“回调函数”或“生命周期事件”，例如“渲染后”或“卸载前”。这种思维方式很快变得复杂，所以最好避免使用.

> [!important]
> 相反，尝试从组件生命周期中跳脱出来，独立思考 Effect。Effect 描述了如何将***外部系统***与当前的 ***props 和 state*** 同步. 


现在让我们从 Effect 本身的角度来思考所发生的事情：

```tsx
 useEffect(() => {
    // Effect 连接到了通过 roomId 指定的聊天室...
    const connection = createConnection(serverUrl, roomId).connect();
    return () => {
      // ...直到它断开连接
      connection.disconnect();
    };
  }, [roomId]);
```

这段代码的结构可能会将所发生的事情看作是一系列不重叠的时间段：

1. Effect 连接到了 `"general"` 聊天室（直到断开连接）
2. Effect 连接到了 `"travel"` 聊天室（直到断开连接）
3. Effect 连接到了 `"music"` 聊天室（直到断开连接）

Effect在***单个启动/停止周期***。无论组件是*挂载、更新还是卸载*, ***只***需要描述==如何开始同步和如何停止==。如果做得好，Effect 将能够在需要时始终具备***启动和停止的弹性***。

这可能会让你想起当编写创建 JSX 的渲染逻辑时，并不考虑组件是挂载还是更新。描述的是应该显示在屏幕上的内容，而 React 会 [解决其余的问题](https://zh-hans.react.dev/learn/reacting-to-input-with-state)。

# effect职责单一原则
**代码中的每个 Effect 应该代表一个独立的同步过程。**
```tsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const log = logVisit(roomId)?.start;
    return () =>  log?.end();
  }, [roomId]);
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId).connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

为什么 `serverUrl` 不需要作为依赖项呢？

这是因为 `serverUrl` 永远不会因为重新渲染而发生变化。无论组件重新渲染多少次以及原因是什么，`serverUrl` 都保持不变。既然 `serverUrl` 从不变化，将其指定为依赖项就***没有意义***。

另一方面，`roomId` 在重新渲染时可能会不同。**在组件内部声明的 props、state 和*其他值*都是 响应式的**，因为它们是在***渲染过程中计算***的，并参与了**React 的*数据流***。

如果 `serverUrl` 是***状态***变量，那么它就是响应式的。响应式值必须包含在依赖项中!

# Advance
## 没有依赖项的 Effect 的含义
从组件的角度来看，空的 `[]` 依赖数组意味着这个 Effect 仅在组件挂载时连接到聊天室，并在组件卸载时断开连接。

> [!NOTE]
> Effect 连接到了 永久 聊天室（直到断开连接） 这个连接发生的时机, 正是组件新渲染的时机.[[ref-learn#Topic Overview]]中的***just*** after ***Mount/DOM paint***, 何时断开, 正是 Unmount时机.

然而，如果你 [从 Effect 的角度思考](https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)，根本不需要考虑挂载和卸载。重要的是，你已经指定了 Effect 如何开始和停止同步(you’ve **specified** ***what*** your Effect does to start and stop synchronizing)。

目前，它没有任何响应式依赖。但是，如果希望用户随时间改变 `roomId` 或 `serverUrl`（它们将变为响应式），Effect 的代码不需要改变。只需要将它们添加到依赖项中即可。
## Deep Dive Reactive
Can global or mutable values be dependencies?
Mutable values (including global variables) ***aren’t*** reactive.

**A mutable value like [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) can’t be a dependency.** It’s mutable, so it can change at any time completely ***outside*** of the React rendering data flow. Changing it wouldn’t **trigger** a rerender of your component. Therefore, even if you **specified** it in the dependencies, React ***wouldn***’t know to re-synchronize the Effect when it changes. 

This also **breaks the rules of React** because ==reading mutable data during rendering== (指的是你计算依赖) breaks [purity of rendering.](https://react.dev/learn/keeping-components-pure) Instead, you should read and subscribe to an external mutable value with [`useSyncExternalStore`.](https://react.dev/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**A mutable value like [`ref.current`](https://react.dev/reference/react/useRef#reference) or *things you read from it* also can’t be a dependency.** The ref object *returned* by `useRef` **itself** **can** be a dependency, but its `current` property is *intentionally* mutable. It lets you [keep track of something without triggering a re-render.](https://react.dev/learn/referencing-values-with-refs) But since changing it doesn’t trigger a re-render, it’s not a reactive value, and React won’t know to re-run your Effect when it changes. 这是useRef的设计意图.

> [!important]
> All values inside the component (including *props, state, and variables* in your component’s body) are ***reactive***(必须是可变的, 官档表述有问题,后文会补充). Any reactive value can ***change on a re-render***, so you need to ***include*** reactive values as *Effect’s dependencies*. 这是linter的工作机制.

> [!tip]
> 在某些情况下，React **知道** 一个值永远不会改变，即使它在组件内部声明。如从 `useState` 返回的 `set` 函数和从 `useRef` 返回的 ref 对象是**稳定的** ——它们保证在重新渲染时不会改变。稳定值不是响应式的，因此可以从列表中省略它们。***包括它们是允许的***：它们不会改变，所以无关紧要。

本质上说, **Effect 是一段响应式的代码块**。它们在读取的值发生变化时重新进行**同步**(即执行回调)。这一本质决定你不能***选择***依赖项, 这可能会导致出现无限循环的问题，或者 Effect 过于频繁地重新进行同步。不要通过禁用代码检查来解决这些问题:

- **检查 Effect 是否表示了独立的同步过程**。如果 Effect 没有进行任何同步操作，[可能是不必要的](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)如果它同时进行了几个独立的同步操作，[将其拆分为多个 Effect](https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process)。

- **如果想读取 props 或 state 的最新值，但又不想对其做出反应并重新同步 Effect**，可以将 Effect 拆分为具有反应性的部分（保留在 Effect 中）和非反应性的部分（提取为名为 “Effect Event” 的内容）。[阅读关于将事件与 Effect 分离的内容](https://zh-hans.react.dev/learn/separating-events-from-effects)。

- **避免将对象和函数作为依赖项**。如果在渲染过程中创建对象和函数，然后在 Effect 中读取它们，它们将在每次渲染时都不同。这将导致 Effect 每次都重新同步。[阅读有关从 Effect 中删除不必要依赖项的更多内容](https://zh-hans.react.dev/learn/removing-effect-dependencies)。

## 事件与 Effect 分离
事件处理函数和 Effect 对于变化的响应是不一样的：

- **事件处理函数内部的逻辑是非响应式的**。除非用户又执行了同样的操作（例如点击），否则这段逻辑不会再运行。事件处理函数读取响应式值, 而“不响应”他们的变化.
	
	从用户角度出发，**`message` 的变化并不意味着他们想要发送消息**。它只能表明用户正在输入。换句话说，发送消息的逻辑不应该是响应式的。它不应该仅仅因为*响应式值* 变化而再次运行。这就是应该把它归入事件处理函数的原因.
- **Effect 内部的逻辑是响应式的**。如果 Effect 要读取响应式值，[你必须将它指定为依赖项](https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)。如果接下来的重新渲染引起那个值变化，React 就会使用新值重新运行 Effect 内的逻辑。
	从用户角度出发，**`roomId` 的变化意味着他们的确想要连接到不同的房间**。换句话说，连接房间的逻辑应该是响应式的。你 **需要** 这几行代码和响应式值“保持同步”，并在值不同时再次运行。这就是它被归入 Effect 的原因
## 技巧
### 获取数据 [](https://zh-hans.react.dev/learn/synchronizing-with-effects#fetching-data "Link for 获取数据")

如果你的 Effect 需要获取数据，清理函数应 [中止请求](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController) 或忽略其结果：

```ts
useEffect(() => {
  let ignore = false;
  async function startFetching() {
    const json = await fetchTodos(userId); // IO
    if (!ignore) {
      setTodos(json);
    }
  }
  startFetching();
  return () => {
    ignore = true; // 修改的是上一次render中的scope中的ignore.如strictMode
  };
}, [userId]);
```