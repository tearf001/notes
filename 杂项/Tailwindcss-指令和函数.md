## 指令([Directives](https://tailwindcss.com/docs/functions-and-directives#directives))

Directives are custom Tailwind-specific [at-rules](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule) you can use in your CSS that offer special functionality for Tailwind CSS projects.
### @import

Use the `@import` directive to **inline import** CSS files, 包括tailwind自己

```css
@import "tailwindcss";
```

### @theme

Use the `@theme` to **define** your project's #design-tokens, like **fonts, colors, and breakpoints**:

```css
@theme {  
	--font-display: "Satoshi", "sans-serif";
	--breakpoint-3xl: 1920px;
	--color-avocado-100: oklch(0.99 0 0);
	--color-avocado-200: oklch(0.98 0.04 113.22);
	--color-avocado-300: oklch(0.94 0.11 115.03);
	--color-avocado-400: oklch(0.92 0.19 114.08);
	--color-avocado-500: oklch(0.84 0.18 117.33);
	--color-avocado-600: oklch(0.53 0.12 118.34);
	--ease-fluid: cubic-bezier(0.3, 0, 0, 1);
	--ease-snappy: cubic-bezier(0.2, 0, 0, 1);
	/* ... */
}
```

Learn more about customizing your theme in the [theme variables documentation](https://tailwindcss.com/docs/theme).

### @source

Use the `@source` directive to **explicitly** specify source files that aren't picked up by Tailwind's automatic content detection: #开发体验

```CSS
@source "../node_modules/@my-company/ui-lib";
```

Learn more about automatic content detection in the [detecting classes in source files documentation](https://tailwindcss.com/docs/detecting-classes-in-source-files).

### @utility
除tw之外,添加自己的实用类(that Tailwind doesn't include utilities for out of the box)
以下是一些 基本式和函数式(--value(...)), 负数, 修改符, 分数形式 等

```css
@utility scrollbar-hidden { 
	&::-webkit-scrollbar { 
		display: none; 
}}
/* 函数式 */
@theme { --tab-size-github: 8;}
@utility tab-* { 
	tab-size: --value(--tab-size-*); /* Matching values --value(--key-*)`语法*/	
	tab-size: --value(integer);      /* bare values 用到了 --value(type} 语法*/
	tab-size: --value([integer]);    /* 任意 values 用到了 --value([type]) 语法*/
}
/* 另一个例子 */
@utility opacity-* { 
	opacity: --value([percentage]);
	opacity: calc(--value(integer) * 1%);
	opacity: --value(--opacity-*);
}
/* 函数式的多参数形式 */
@utility tab-* {
	tab-size: --value(--tab-size-*, integer, [integer]);
}
@utility opacity-* { 
	opacity: --value(--opacity-*, [percentage]);
	opacity: calc(--value(integer) * 1%);
}
/* 负值. [length] 表示可选的`单位`*/
@utility inset-* { 
	inset: calc(var(--spacing) * --value([percentage], [length]));
}
@utility -inset-* { 
	inset: calc(var(--spacing) * --value([percentage], [length]) * -1);
}
/* 修饰(改)符函数 --modifier() 和 --value()函数一模一样.*/
@utility text-* { 
	font-size: --value(--text-*, [length]);
	line-height: --modifier(--leading-*, [length], [*]); /*修饰符: 表示text-*声明时, line-height仅在指明时生成.*/
}
/* 分数形式 match utilities like `aspect-square`, `aspect-3/4`.*/
@utility aspect-* {  aspect-ratio: --value(--aspect-ratio-*, ratio, [ratio]);}
```

### @variant

Use the `@variant` directive to **apply** a Tailwind variant to styles in your CSS:

```css
.my-element {  
	background: white;  
	@variant dark {    
		background: black;  
	}
}
```

Learn more about variants in the [hover, focus, and other states documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### @custom-variant

使用指令 `@custom-variant` to add a 自定义变体 in your project:
就像任意值([arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values))允许你在工具类中使用自定义值一样，**任意变体**允许你直接在 HTML 中编写`自定义选择器`变体。
#### 任意变体
任意变体 只是一些格式字符串, 用来表达[方框]选择器, 比如说, `[&.is-dragging]:cursor-grabbing` 就是当元素拥有`class=is-dragging`(即`.is-dragging`选中)时, 应用实用类`cursor-grabbing`.
初步印象: 
- `&.` 表示当前作用域
  例 `dragging(动态的) [&.dragging]:cursor-grabbing`
- `&_š` 表示 `& š`  (`š` 是选择器)
- 其他 `[@supports(display:grid)]:grid`
#### 注册自定义变体
   如果相同自定义变体多次出现, 就值得创建一个 #自定义变体 #自定义变体简写形式
```css
@custom-variant pointer-coarse { 
	@media (pointer: coarse) { 
		@slot; 
}}
/* 当不需要嵌套的时候, 可用使用简写形式 */
@custom-variant pointer-coarse (@media (pointer: coarse));

@custom-variant any-hover { 
	@media (any-hover: hover) { 
		&:hover { 
			@slot; 
}}}
```
更多的见[[Custom variants]]深入
### @apply

Use the `@apply` directive to inline any existing utility classes into your own custom CSS:


```css
.select2-dropdown {  
	@apply rounded-b-lg shadow-md;
}
.select2-search {  
	@apply rounded border border-gray-300;
}
.select2-results__group { 
	@apply text-lg font-bold text-gray-900;
}
```

This is useful when you need to write `custom` CSS (like to override the styles in a third-party library) but `still` want to work with your `design tokens` 

### @reference

If you want to use `@apply` or `@variant` in the `<style>` block of a Vue or Svelte component, or within `CSS modules`, you will need to import your theme variables, custom utilities, and custom variants to make those values available in that context.

To do this without duplicating any CSS in your output, use the `@reference` directive to import your main stylesheet for reference without actually including the styles:

```vue
<template>  
	<h1>Hello world!</h1>
</template>
<style>  
	@reference "tailwindcss"; /*引用, 而不是重复导入*/
	@reference "../../app.css"; /*引用, 而不是重复导入*/	
	h1 {
		@apply text-2xl font-bold text-red-500;
	}
</style>
```

## [Functions](https://tailwindcss.com/docs/functions-and-directives#functions)

build-time functions to make working with colors and the spacing scale easier.

### --alpha()

Use the `--alpha()` function to adjust the opacity of a color:

```css
.my-element {  color: --alpha(var(--color-lime-300) / 50%);}
```

编译之后

```css
.my-element {  
	color: color-mix(in oklab, var(--color-lime-300) 50%, transparent);
}
```

### --spacing()

Use the `--spacing()` function to generate a spacing value based on your theme:

```css
.my-element {  
	margin: --spacing(4); /* 生成的 calc(var(--spacing) * 4); */
}
```

This can also be useful in arbitrary values, especially in combination with `calc()`:

```html
<div class="py-[calc(--spacing(4)-1px)]"> 
	<!-- ... -->
</div>
```

## [Compatibility](https://tailwindcss.com/docs/functions-and-directives#compatibility)

以下指令和函数仅(solely)用于与 Tailwind CSS v3.x 兼容。

### @config

Use the `@config` directive to load a legacy JavaScript-based configuration file:
```css
@config "../../tailwind.config.js";
```

但是 `corePlugins`, `safelist` and `separator` options from the **JavaScript-based** config are not supported in v4.0.

### @plugin

Use the `@plugin` directive to load a legacy **JavaScript-based** plugin:

CSS

```
@plugin "@tailwindcss/typography";
```

The `@plugin` directive accepts either a `package name` or a local `path`.

### ~~theme()~~

Use the `theme()` function to access your Tailwind theme values using dot notation:

```css
.my-element { 
	margin: theme(spacing.12);
}
```

This function is `deprecated`, and we recommend [using CSS theme variables](https://tailwindcss.com/docs/theme#using-your-theme-variables) instead.