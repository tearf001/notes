Dark 属于变体

默认情况下，这将使用 `prefers-color-scheme` CSS 媒体功能，
## 手工切换
但您也可以通过覆盖深色变体来构建支持[手动切换深色模式](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually)的网站。
`&:where(`_selector_`)` 表示 当前位于 _selector_

### 官方推荐写法
```js
@import "tailwindcss";

// &:where(.dark) 表示当前有; 
// ".dark *" 表示处于 .dark元素之中; 类似的 .dark > * 表示一级子元素有; 
@custom-variant dark (&:where(.dark, .dark *));
// 语法同上. 要么当前有[], 要么处于[]选择器之下
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```
### 第三方写法枚举
#### solid-ui的写法
```js
 darkMode: ["variant", [".dark &", '[data-kb-theme="dark"] &']],
 //css 生成的
 @custom-variant dark (.dark &,[data-kb-theme="dark"] &);
```
### chadcn-solid 的写法
```js
darkMode: ["class", '[data-kb-theme="dark"]'],
//css
@custom-variant dark (&:is([data-kb-theme="dark"] *));
```
## 脚本触发
通过脚本来触发
```js
// On page load or when changing themes, best to add inline in `head` to avoid FOUC

// 调用形式. 用于页面加载, 或者changing themes. 最好是inline到`head`标签中, 避免FOUC
() => document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);

// Whenever the user explicitly chooses light mode
localStorage.theme = "light";
// Whenever the user explicitly chooses dark mode
localStorage.theme = "dark";
// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem("theme");
```

## 注意技巧
> FOUC (Flash of Unstyled Content) 是指在网页加载过程中，由于样式表 (CSS) 加载延迟或未正确应用，导致页面短暂地显示无样式（或样式不完整）的原始 HTML 内容，然后突然“闪现”到正确样式的现象。>