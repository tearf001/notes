
# 符文
## $state
符文, 是单向的

```html
<script>
	let name = $state('inital');
</script>
<!-- 单向数据流 -->
<input value={name} onkeypress={(v)=>name=v.target.value} />
<!-- 双向绑定 -->
<input bind:value={name} />
<h1>Hello {name}!</h1>
```
## $props 组件符文
`$props` 符文 是跟踪父组件. 正向绑定

# bind 指令, 本质上是双向同步.
## 绑定
  - `bind:<prop>` 指令 是双向绑定 . **Svelte takes care of it for *BUILT-IN* 和 *自定义* Components**, 而且会对built-in***强制类型转换(coerce)***
### 内置组件绑定
```tsx
input type="number" bind:value={a}
input type="range" bind:value={a}
input type="checkbox" bind:checked={check}
textarea bind:value={value}
input type="radio|checkbox" name="scoops" value={each/number} bind:group={scoops} // radio: string, checkbox: string[]

select bind:value={selected}
select bind:value={flavours} multiple

```
## 组件绑定
  - `$bindable` 符文 是自定义组件,绑定到父组件. 反向绑定. 通常要配合 *$bindable*符文用
就像你可以绑定到 DOM 元素的属性一样，你也可以绑定到组件的 props。
我们可以像绑定表单元素一样绑定到此组件v的 prop

首先，我们需要将 prop 标记为bindable。在里面Keypad.svelte，更新$props() 声明以使用$bindable 符文：

键盘
```ts
let { v = $bindable(''), onsubmit } = $props();
```

然后，在中App.svelte添加一个bind:指令：
```tsx
<Keypad bind:v={pin} {onsubmit} />
```

现在，当用户与键盘交互时，pin父组件中的值会立即更新。

> 谨慎使用组件绑定。如果组件绑定过多，则很难跟踪应用程序周围的数据流，尤其是在没有“单一事实来源”的情况下。


## 明确方式和 bind方式对比
```html
<script>
	let a = $state(1);
	let b = $state(2);
</script>

<label>
	<input type="number" value={a} min="0" max="10" onchange={(v)=>a=parseInt(v.target.value)}/>
	<input type="range" value={a} min="0" max="10" onpointermove={(v)=>a=parseInt(v.target.value)} />
</label>


<label>
	<input type="number" bind:value={b} min="0" max="10" />
	<input type="range" bind:value={b} min="0" max="10" />
</label>
```