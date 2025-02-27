颜色体系 属于 @themes
## 调色板
Here's a full list of utilities that use your color palette:

|Utility|Description|
|---|---|
|`bg-*`|Sets the [background color](https://tailwindcss.com/docs/background-color) of an element|
|`text-*`|Sets the [text color](https://tailwindcss.com/docs/text-color) of an element|
|`decoration-*`|Sets the [text decoration color](https://tailwindcss.com/docs/text-decoration-color) of an element|
|`border-*`|Sets the [border color](https://tailwindcss.com/docs/border-color) of an element|
|`outline-*`|Sets the [outline color](https://tailwindcss.com/docs/outline-color) of an element|
|`shadow-*`|Sets the color of [box shadows](https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color)|
|`inset-shadow-*`|Sets the color of [inset box shadows](https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color)|
|`ring-*`|Sets the color of [ring shadows](https://tailwindcss.com/docs/box-shadow#setting-the-ring-color)|
|`inset-ring-*`|Sets the color of [inset ring shadows](https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color)|
|`accent-*`|Sets the [accent color](https://tailwindcss.com/docs/accent-color) of form controls|
|`caret-*`|Sets the [caret color](https://tailwindcss.com/docs/caret-color) in form controls|
|`fill-*`|Sets the [fill color](https://tailwindcss.com/docs/fill) of SVG elements|
|`stroke-*`|Sets the [stroke color](https://tailwindcss.com/docs/stroke) of SVG elements|
## + 自定义
```css
<div class="bg-pink-500/[71.37%]"><!-- ... --></div>
<div class="bg-cyan-400/(--my-alpha-value)"><!-- ... --></div>
```

## Targeting
Dark Mode  #light-dark函数

```html
<div class="bg-[light-dark(var(--color-white),var(--color-gray-950))]">
	<!-- ... -->
</div>
```

## 被引用
Colors are exposed as CSS variables in the `--color-*` namespace
```css
@import "tailwindcss";
@layer components {
  .typography {
    color: var(--color-gray-950);
    a {
      color: var(--color-blue-500);
      &:hover {
        var(--color-blue-800);
      }
    }
  }
}
```

## 定义, 引用和重写
```js
@import "tailwindcss";

:root {
  --acme-canvas-color: oklch(0.967 0.003 264.542);
}

[data-theme="dark"] {
  --acme-canvas-color: oklch(0.21 0.034 264.665);
}

@theme {
  --color-*: initial; // 重写
  --color-white-*: initial; // 重写
  --color-white: #eee; // 定义
  --color-purple: #3f3cbb;
  --color-midnight: #121063;
  --color-tahiti: #3ab7bf;
  --color-bermuda: #78dcca;
}
@theme inline {
  --color-canvas: var(--acme-canvas-color);
}
```

## 函数
#--alpha函数 仅在 css 文件中可用. 在html可用直接使用. 比如 `/75` `/[81.1]` `/(--my-alpha-value)`
```css
@import "tailwindcss";
@layer components {
  .DocSearch-Hit--Result {
    background-color: --alpha(var(--color-gray-950) / 10%); // 不支持斜杠语法
  }
}
```

## 默认色
使用 #oklch
