# 核心概念
## 实用类 
Constrained set of Primitive Utilities
## Hover, focus, and other states
### 伪类
- 行为伪类 :hover :focus :active 
- 定位伪类 :first :even
- 表单 :required :disabled
- 上下文伪类: context of parent & sibling
### 伪元素
- ::before ::after
- ::placeholder
- ::file
- ::marker
- ::selection
- ::first-line ::first-letter
- ::backdrop
### 媒体和特性查询
- breakpoint
- prefers color theme, reduced-motion, constrast 
- orientation +
- print 
- @support @starting-style
### 属性选择器
- Aria
- Data-attr
- RTL
- Open/close
- Styling inert elements 不活跃的 `inert` 相对的, `active`
### Child selector
- Direct children (`*:`) `.\*\:bg-sky-50 {:is(& > *) {})`
- 所有的后代 `**:`
### Custom variants
就像任意值([arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values))允许你在工具类中使用自定义值一样，**任意变体**允许你直接在 HTML 中编写`自定义选择器`变体。
任意变体 只是一些格式字符串, 用来表达[方框]选择器, 
> 比如说, `[&.is-dragging]:cursor-grabbing` 就是当元素拥有`class=is-dragging`(即`.is-dragging`选中)时, 应用实用类`cursor-grabbing`.

当任意值重复出现时, 你应该`注册自定义变体`
#### 注册自定义变体
   如果相同自定义变体多次出现, 就值得创建一个 #自定义变体 #自定义变体简写形式, 背后语法见[csv指令和函数](Tailwindcss-指令和函数.md#@custom-variant)
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
## 响应式
### 基础 min, max
- max-size 当小于size时候, 适用**移动设备**
  例如: `max-2xl` = `@media (width < 96rem) { ... }`
- min-size 当大于size时候适用. 通常适用**Desktop**
	比如 `md sm xs lg xl ...`
### 移动优先 
####  定位移动屏幕 
   通常适用`max set`(小于某尺寸时候适用).一般不用`min set`
- Use the **unprefixed** utility, **NOT** the **prefixed** version like `sm:`. 
- `sm:` ≠ "**on** small **screens**", `sm:` ===  "**at** the small **_breakpoint_**".
 ```html
  <!-- only center text on screens 640px+, not on smaller-->
  <div class="sm:text-center"></div>
  <!-- center on mobile,left align on screens 640px+-->
  <div class="text-center sm:text-left"></div>
```
#### 定位断点范围
同时 `at` 两个断点
```html
<div class="md:max-xl:flex"> <!-- ... --></div>
```
#### [限定断点范围](https://tailwindcss.com/docs/responsive-design#targeting-a-single-breakpoint)
如果 at两个断点相邻, 就限定了断点.
`断点●:max-下一个断点⬤:样式`, 如 `md:max-lg:样式`
```html
<div class="md:max-lg:flex"> <!-- ... --></div>
```

### 自定义断点
#### [作为them自定义](https://tailwindcss.com/docs/responsive-design#customizing-your-theme)
```css
@import "tailwindcss";
@theme { 
	--breakpoint-xs: 30rem; 
	--breakpoint-2xl: 100rem; 
	--breakpoint-3xl: 120rem;
}
```
使用
```html
<div class="grid xs:grid-cols-2 3xl:grid-cols-6">...</div>
```
#### [移除默认的断点](https://tailwindcss.com/docs/responsive-design#removing-default-breakpoints)

```css
@theme { 
	--breakpoint-*/spec to remove: initial;
	--breakpoint-xs: 30rem; 
	--breakpoint-2xl: 100rem;
	--breakpoint-tablet: 40rem; 
	--breakpoint-laptop: 64rem; 
	--breakpoint-desktop: 80rem;
	...
}
```
 #### 随意值
  `max-[600px]:bg-sky-300 min-[320px]:text-center`
### 容器查询
#### 定义
  容器查询时现代的CSS特征, 即基于父元素, 而不是整个视口. 使得组件更容易迁移和重用. 因为组件基于实际可用空间.
#### 基本例子
使用`@container` class 标记一个元素为容器, 使用变体 `@sm` and `@md` 来定义子元素的断点, 基于容器的尺寸.

```html
<div class="|mark-as-container| @container size-81 border-1 bg-amber-50">
  <!--xs 是大于20rem就可用. 81尺寸就flex-row了-->
  <div class="|@container-sized| flex flex-col @xs:flex-row">
    当容器尺寸>xs是flex-row, 否则是默认flex-col
  </div>
</div>
```
![[container.png]]
就像断点变体一样，容器查询在 Tailwind CSS 中是移动优先的，并且适用于目标容器大小及以上。
#### 容器查询范围
将常规容器查询变体与最大宽度容器查询变体堆叠在一起，以定位特定范围：
```html
<div class="@container">
	<div class="flex flex-row @sm:@max-md:flex-col"> 
	<!-- 当 sm <= 容器尺寸 <md 应用flex-col --> 
	</div>
</div>
```
#### 命名容器

When having multiple nested containers, using `@container/{name}` and target specific containers with variants like `@sm/{name}` and `@md/{name}`:

HTML

```html
<div class="@container/main"> 
	<!-- 其他内容 -->  
	<div class="flex flex-row @sm/main:flex-col">   
		 <!-- 当main容器 > sm, 使用 flex-col... --> 
	</div>
</div>
```

Style things based on the size of a **distant** container, **rather** than just the **nearest** by name.
#### 使用自定义的容器尺寸

Use the `--container-*` theme variables to customize your container sizes:

```css
@import "tailwindcss";
@theme {  --container-8xl: 96rem;}
```

This adds a new `8xl` container query variant that can be used in your markup:

```html
<div class="@container"> 
	<div class="flex flex-col @8xl:flex-row">   
	<!-- ... -->  
	</div>
</div>
```
#### 任意值

```html
<div class="@container">  
	<div class="flex flex-col @min-[475px]:flex-row">   
		 <!-- 支持rem,但是不支持预置数字... -->  
	</div>
	<div class="|size the child at 50% container query width| w-[50cqw]">
	  计算容器尺寸的50%, 这个和 w-1/2不同, 后者是相对于 parent-width
	</div>
  </div>
</div>
```
#### 容器尺寸表
|Variant|Minimum width|CSS|
|---|---|---|
|`@3xs`|16rem _(256px)_|`@container (width >= 16rem) { … }`|
|`@2xs`|18rem _(288px)_|`@container (width >= 18rem) { … }`|
|`@xs`|20rem _(320px)_|`@container (width >= 20rem) { … }`|
|`@sm`|24rem _(384px)_|`@container (width >= 24rem) { … }`|
|`@md`|28rem _(448px)_|`@container (width >= 28rem) { … }`|
|`@lg`|32rem _(512px)_|`@container (width >= 32rem) { … }`|
|`@xl`|36rem _(576px)_|`@container (width >= 36rem) { … }`|
|`@2xl`|42rem _(672px)_|`@container (width >= 42rem) { … }`|
|`@3xl`|48rem _(768px)_|`@container (width >= 48rem) { … }`|
|`@4xl`|56rem _(896px)_|`@container (width >= 56rem) { … }`|
|`@5xl`|64rem _(1024px)_|`@container (width >= 64rem) { … }`|
|`@6xl`|72rem _(1152px)_|`@container (width >= 72rem) { … }`|
|`@7xl`|80rem _(1280px)_|`@container (width >= 80rem) { … }`|
# tailwind结构
```css
@layer theme, base, components, utilities;

@layer theme{ /*指令 @theme{}*/
	:root{
		 --font-sans | --font-mono | --font-family | --color-..:slot
	}
}

@layer base{ /*基本样式. 低于具体项目*/
	*,::after, ::before,::backdrop, ::file-selector-button{
		...
	}
	html, :host{
		...
	}
	body:{
		line-height: inherit; 
		...
	}
}
@layer components{
	/*web 组件*/
}

@layer utilities{
	/*实用工具类, 单列出在用和tw生成的*/
}
```