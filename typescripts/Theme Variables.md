
[Overview](https://tailwindcss.com/docs/theme#overview)
## 定义

Tailwind is a framework for building custom designs, and different designs need different `typography`, `colors`, `shadows`, `breakpoints`, and more.

这些样式称为低水平 `low-level` 设计决定(_design decisions_), 行业中经常称之为 _design tokens_, and in **Tailwind** projects you store those values in _theme variables_. 

## 为什么不是 `:root`？
`ThemeVariables` 不仅仅是 _CSS变量_ , 它们还*指示* Tailwind 可以在 HTML 中使用的`实用`类。1+1

由于它们比`常规 CSS 变量`做得**更多**，因此 Tailwind 使用特殊语法，以便定义 #ThemeVariables  始终是**显式**的。_主题变量_ 也需要定义为`顶级变量`，而不是嵌套在其他选择器或媒体查询下，使用`特殊`语法可以`强制`执行这一点。

使用 `：root` 定义常规 CSS 变量在 Tailwind 项目中`仍然`很有用[...:var(--from-root)]。但使用 `：root` 定义`无相应实用类类`的`常规CSS 变量`。 _设计令牌_ 映射到实用类类时，使用 `@theme`

## [与实用类类的关系](https://tailwindcss.com/docs/theme#relationship-to-utility-classes)
`静态的, 直接驱动`

Tailwind 中的一些工具类（如 `flex` 和 `object-cover`）是静态的，并且每个项目总是相同的。但许多其他类是由 #ThemeVariables 驱动的，并且 _只是因为_ 你定义的 _ThemeVariables_ 而存在。

例如，在 `--font-*` 命名空间中定义的主题变量决定了项目中存在的所有 `font-family` 实用类：

```css
./node_modules/tailwindcss/theme.css
@theme {  
	--font-sans: ui-sans-serif, system-ui, sans-serif, "Apple ..";  
	--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; 
	--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,...;
	/* 在此增加 你的 --font-yourx, 直接得到 font-yourx 实用类*/
}
```

## [与变体的关系](https://tailwindcss.com/docs/theme#relationship-to-variants)
`动态的, 变体注册`

一些 _主题变量_ 用于定义`变体`，而不是`实用类`。例如，`--breakpoint-*` _命名空间_ 中的 _主题变量_ 确定项目`响应式断点变体`：
```js
@import "tailwindcss";
@theme { 
	--breakpoint-3xl: 120rem; // 并不存在 `breakpoint-3xl`
}
```
在[主题变量命名空间](https://tailwindcss.com/docs/theme#theme-variable-namespaces)文档中了解有关 _主题变量如何映射_ 到不同`实用类类`和`变体`的更多信息。

## [主题变量命名空间](https://tailwindcss.com/docs/theme#theme-variable-namespaces)
**主题变量**在 _命名空间_ 中定义，每个命名空间对应于`一个或多个`实用类类或变体 API。

| Namespace                                     | Utility classes  实用类类                                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `--color-*`                                   | 颜色实用类，如 `bg-red-500`、`text-sky-300`, 生成 [_2 *10_]                                                   |
| `--font-*`                                    | `直接`使用, _1:1_                                                                                       |
| `--text-*`                                    | `字体大小`实用类，如 `text-xl` _1:1_                                                                         |
| `--font-weight-*`                             | `字体粗细` 实用类，如 `font-bold` _1:1_≠                                                                     |
| `--tracking-*`                                | `字母间距`实用类，如 `tracking-wide` _1:1_                                                                   |
| `--leading-*`                                 | `行高`实用类，如 `leading-tight` _1:1_                                                                     |
| `--breakpoint-*`                              | 响应式断点变体，如 `sm：*` _1:1_≠≠                                                                            |
| `--container-*`<br> _--container-8xl: 96rem;_ | - 容器查询变体（如 `@sm`\| `@8xl`）_[1:1]_≠<br>- 大小实用类（如 `max-w-md`\| `max-w-8xl`） _max_width: value(=)_<br> |
| `--spacing-*`                                 | `px-4`、`max-h-16` 等间距和大小调整实用类 _[n*1]_                                                               |
| `--radius-*`                                  | border radius 实用类，如 `rounded-sm` _1:1_≠                                                             |
| `--shadow-*`                                  | Box shadow 实用类，如 `shadow-md` _1:1_                                                                  |
| `--inset-shadow-*`                            | 插入框阴影实用类，如 `inset-shadow-xs` _1:1_                                                                  |
| `--drop-shadow-*`                             | 投影滤镜实用类，如 `drop-shadow-md` _1:1_                                                                    |
| `--blur-*`                                    | 模糊滤镜实用类，如 `blur-md` _1:1_                                                                           |
| `--perspective-*`                             | 透视实用类，如 `perspective-near` _1:1_                                                                    |
| `--aspect-*`                                  | 纵横比实用类，如 `aspect-video` _1:1_                                                                       |
| `--ease-*`                                    | Transition timing 函数工具，如 `ease-out` _1:1_                                                           |
| `--animate-*`                                 | 动画实用类，如 `animate-spin` _1:1_                                                                        |
### 默认主题变量
以下是您在导入 `@import tailwindcss` 时实际导入的内容：
```js
// node_modules/tailwindcss/index.css
@layer theme, base, components, utilities;
@import "./theme.css" layer(theme);
@import "./preflight.css" layer(base);
@import "./utilities.css" layer(utilities);
```
## 自定义您的主题
### 扩展默认主题
```js
@import "tailwindcss";
@theme { 
	// put your theme variables here
	--font-add-my-font: ... // 新增 class="font-my-font"
	--breakpoint-sm: 30rem; // 重写
	--color-*: initial;     // 重置 该命名空间all默认实用类如`bg-x-500`都将被删除
	--*: initial; // 好吧, 全部重写. 无头, 只使用tailwind的结构如命名空间,和tooling
}
```

### [定义动画关键帧](https://tailwindcss.com/docs/theme#defining-animation-keyframes)
```css
@import "tailwindcss";
@theme { 
  --animate-wiggle: wiggle 1s ease-in-out 1,0,infinite;
  /* tw 不支持一个主题变量使用多个动画类
    animation-name: fadeInOut, moveLeft300px, bounce;
	animation-duration: 2.5s, 5s, 1s;
	animation-iteration-count: 2, 1, 5;
  */
  @keyframes wiggle {
    0%,
    100% {
      transform: rotate(-3deg);
    }
    50% {
      transform: rotate(3deg);
    }
  }
}
```
如果您希望自定义 `@keyframes` 规则始终包含在内，即使不添加 `--animate-*` 主题变量也是如此，请改为在 `@theme` 之外定义它们。例中, 仅在 `animate-wiggle`时才引入生效. 

### [引用其他变量](https://tailwindcss.com/docs/theme#referencing-other-variables)
定义引用其他变量的主题变量时，请使用 `inline` 选项：
```css
@theme inline { 
	--font-sans: var(--font-inter);
}
```
使用 `inline` 选项，实用类将使用 theme variable _value_，而不是`引用`实际的 `theme variable`

如果不使用 `inline`，由于 CSS 中变量的解析方式，你的工具类可能会解析为意外(_引用失败_)值。

例如，此文本将回退到 `sans-serif`，而不是像您期望的那样使用 `Inter`：
```html
<div style="--font-sans: var(--font-inter, sans-serif);"> 
	此时还没定义--font-inter, 因此得到 --font-sans => sans-serif
	<div style="--font-inter: Inter; font-family: var(--font-sans);"> 
	    This text will use the sans-serif font, not Inter. 
	</div>
</div>
```

## 使用主题变量
当你编译 CSS 时，你的所有主题变量都会变成常规的 CSS 变量, 但是`tw`会分开放置, `@layer theme :root`中定义`--变量`, 在相关的命名空间(比如动画在`--frame-*`)对应的`@layer`(utilities)上.

### [使用自定义 CSS](https://tailwindcss.com/docs/theme#with-custom-css)
```css
@import "tailwindcss";
@layer components {  /*可以使用 @layer theme :root 中定义的变量*/
	.typography {
		p { 
			font-size: var(--text-base); 
			color: var(--color-gray-700); 
		} 
		h1 { 
			font-size: var(--text-2xl--line-height); 
			font-weight: var(--font-weight-semibold); 
			color: var(--color-gray-950); 
		} 
		h2 { 
			font-size: var(--text-xl); 
			font-weight: var(--font-weight-semibold); 
			color: var(--color-gray-950); 
		} 
	}
}
```
这在设置您`无法控制`的 HTML 的样式时通常很有用，例如来自数据库或 API 并呈现为 HTML 的 Markdown 内容。

### [使用任意值](https://tailwindcss.com/docs/theme#with-arbitrary-values)

在任意值中使用主题变量可能很有用，尤其是与 `calc（）` 函数结合使用时。

```html
<div class="relative rounded-xl"> 
	<div class="absolute inset-px rounded-[calc(var(--radius-xl)-1px)]">  
		<!-- ... -->  
	</div>  
	<!-- ... -->
</div>
```
在上面的示例中，我们从嵌套 inset 元素的 `--radius-xl` 值中减去 1px，以确保它具有同心边界半径

### [在 JavaScript 中引用](https://tailwindcss.com/docs/theme#referencing-in-javascript)

大多数时候，当你需要在 JS 中引用主题变量时，你可以直接使用 CSS 变量，就像任何其他 CSS 值一样。
如果需要访问 JS 中解析的 CSS 变量值，可以使用 `getComputedStyle` 获取`文档根`上`主题变量`的值：
```js

<motion.div animate={{ backgroundColor: "var(--color-blue-500)" }} />

let styles = getComputedStyle(document.documentElement);
let shadow = styles.getPropertyValue("--shadow-xl");
```

## 完整的默认主题变量列出
```css

@theme {

  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji"";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas..;

  --color-*: 
  --color-black: #000;
  --color-white: #fff;

  --spacing: 0.25rem;

  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;
  --container-3xs: 16rem;
  --container-2xs: 18rem;
  --container-xs: 20rem;
  --container-sm: 24rem;
  --container-md: 28rem;
  --container-lg: 32rem;
  --container-xl: 36rem;
  --container-2xl: 42rem;
  --container-3xl: 48rem;
  --container-4xl: 56rem;
  --container-5xl: 64rem;
  --container-6xl: 72rem;
  --container-7xl: 80rem;
 
  --text-xs: 0.75rem;
  --text-xs--line-height: calc(1 / 0.75);
  --text-sm: 0.875rem;
  --text-sm--line-height: calc(1.25 / 0.875);
  --text-base: 1rem;
  --text-base--line-height: calc(1.5 / 1);
  --text-lg: 1.125rem;
  --text-lg--line-height: calc(1.75 / 1.125);
  --text-xl: 1.25rem;
  --text-xl--line-height: calc(1.75 / 1.25);
  --text-2xl: 1.5rem;
  --text-2xl--line-height: calc(2 / 1.5);
  --text-3xl: 1.875rem;
  --text-3xl--line-height: calc(2.25 / 1.875);
  --text-4xl: 2.25rem;
  --text-4xl--line-height: calc(2.5 / 2.25);
  --text-5xl: 3rem;
  --text-5xl--line-height: 1;
  --text-6xl: 3.75rem;
  --text-6xl--line-height: 1;
  --text-7xl: 4.5rem;
  --text-7xl--line-height: 1;
  --text-8xl: 6rem;
  --text-8xl--line-height: 1;
  --text-9xl: 8rem;
  --text-9xl--line-height: 1;
  
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  --radius-xs: 0.125rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-4xl: 2rem;
  
  --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  --inset-shadow-2xs: inset 0 1px rgb(0 0 0 / 0.05);
  --inset-shadow-xs: inset 0 1px 1px rgb(0 0 0 / 0.05);
  --inset-shadow-sm: inset 0 2px 4px rgb(0 0 0 / 0.05);
  
  --drop-shadow-xs: 0 1px 1px rgb(0 0 0 / 0.05);
  --drop-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.15);
  --drop-shadow-md: 0 3px 3px rgb(0 0 0 / 0.12);
  --drop-shadow-lg: 0 4px 4px rgb(0 0 0 / 0.15);
  --drop-shadow-xl: 0 9px 7px rgb(0 0 0 / 0.1);
  --drop-shadow-2xl: 0 25px 25px rgb(0 0 0 / 0.15);

  --blur-xs: 4px;
  --blur-sm: 8px;
  --blur-md: 12px;
  --blur-lg: 16px;
  --blur-xl: 24px;
  --blur-2xl: 40px;
  --blur-3xl: 64px;

  --perspective-dramatic: 100px;
  --perspective-near: 300px;
  --perspective-normal: 500px;
  --perspective-midrange: 800px;
  --perspective-distant: 1200px;

  --aspect-video: 16 / 9;

  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  --animate-spin: spin 1s linear infinite;
  --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-bounce: bounce 1s infinite;

  @keyframes spin {
    to { /*1s 线性旋转*/
      transform: rotate(360deg);
    }
  }

  @keyframes ping {
    75%, /*1s cubic , 在最后2个1/4节拍 增大到消失 */
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes pulse {
    50% { /*中程变暗*/
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }

    50% {
      transform: none;
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
}

```
