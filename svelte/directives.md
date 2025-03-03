# directives
**指令** 指令是一个更广泛的概念，涵盖了多种类型的指令，包括：
    
- ~~事件指令 (on:click)~~         now: raw event like onclick
- ~~类指令 (class:active)~~	now is ***[clsx](https://github.com/lukeed/clsx)*** like  *class={["string array", "", {x: !!value}]}*
- 绑定指令 (bind:value)
- 样式指令 (style:color)	*style*:***raw-propty--or-variable***:*number-or-instring*  不推荐 无*style指令*的 ***--variable***
- 过渡指令 (transition:fade)	
- 动作指令 (use:action)	use:yourAction={arg} `{yourAction = (node,arg) => {$effect mount和unmount清理}`
- ...其他A
# Bind
**bind 是 一种特殊的指令** 从技术上讲，bind 实际上是 Svelte 提供的一种内置指令（binding directive）。它符合指令的基本定义：它是附加到 HTML 元素上的特殊属性，用于指示 Svelte 如何处理这个元素（在这种情况下，是建立双向数据绑定）。
## Bind built-in
select | input.input | textarea:  `bind:value={state}`
input.checkbox (no group ):    `bind:checked={state}`
input.radio | input.checkbox:   `bind:group={state}`
## Bind this

# Action
Actions are essentially ***element-level lifecycle*** functions. They’re useful for things like:
- interfacing with ***third-party*** libraries
- lazy-loaded images
- tooltips
- adding ***custom*** event handlers
- ...

**Actions 与指令和 bind 的关系：**
    
- Actions 通过 use: 指令来使用。所以 actions 依赖于 指令机制。        
- Actions 通常用于实现更复杂的、与生命周期相关的行为，而这些行为很难或不适合用其他类型的指令（如 class:）来实现。        
- Actions 目的是提供对 DOM 元素的***直接访问***和***生命周期管理***，而 bind 的主要目的是双向数据绑定。它们可以在同一个元素上协同工作。

## use
`trapFocus` 通常在外部定义, 而且文件应包含 `.svelte` 以能用 ***$effect***, effect通常包含mount和unmount清理. 它会***跟踪*node生命周期**

```tsx
<div class="menu" use:trapFocus>
```
