# 面板（Facade） API

为了应对复杂的需求，Univer 的架构也较为复杂，这可能会给使用造成一些困难，为此我们提供了一个更加简单易用的面板 API（Facade API）。

本小节将详细介绍如何在应用中添加 Facade API，后续的 “功能” 章节中，我们将列出每个功能的主要 Facade API，如果你想查看所有的 Facade API，请参考各个插件的 API 文档

从 0.5.0 开始版本，`@univerjs/facade` 包被标记为***废弃***，并计划在 0.6.0 版本中移除。如果你是 0.5.0 之前版本的用户，请参考下文中的 “手动组合安装” 部分修改引入 Facade API 的方式。

注意 Univer 当中部分 API 是**异步**的，特别是修改数据的 API，它们大多会返回一个 `Promise`。如果你需要再修改数据后立即获取数据，请使用 `await` 或者 `.then()`，否则可能会获取到不符合预期的结果。想要了解具体有哪些 API 会返回 `Promise`，请查看对应的 API 参考手册。

## Presets 安装[](https://docs.univer.ai/zh-CN/guides/sheets/getting-started/facade#presets-%E5%AE%89%E8%A3%85)

如果你使用 *Presets*，它会***自动引入***所含功能的 Facade API，并在你创建 Univer 实例时返回一个对应的 Facade API 实例 `univerAPI`，直接使用即可。

## 手动组合安装[](https://docs.univer.ai/zh-CN/guides/sheets/getting-started/facade#%E6%89%8B%E5%8A%A8%E7%BB%84%E5%90%88%E5%AE%89%E8%A3%85)

### 安装[](https://docs.univer.ai/zh-CN/guides/sheets/getting-started/facade#%E5%AE%89%E8%A3%85)
#全局FacadeAPI根对象

从 0.5.0 版本开始，Facade API 的实现被***分散***到各个插件中，并挂载到***全局的 Facade API 根对象***上，这意味着对于那些提供了 Facade API 的插件，你需要引入他们对应的 Facade API 实现。

我们会在每个功能的页面介绍它是否提供了 Facade API 实现，你需要按照你***实际使用的功能***来引入它们对应的 Facade API：

```js
import '@univerjs/sheets/facade';
import '@univerjs/ui/facade';
import '@univerjs/docs-ui/facade';
import '@univerjs/sheets-ui/facade';
 
import '@univerjs/sheets-data-validation/facade';
import '@univerjs/engine-formula/facade';
import '@univerjs/sheets-filter/facade';
import '@univerjs/sheets-formula/facade';
import '@univerjs/sheets-numfmt/facade';
import '@univerjs/sheets-hyper-link-ui/facade';
```

如果你使用了 Univer 的高级功能，也不需要再使用 `@univerjs-pro/facade`，引入高级功能的 Facade API 的方式现在与引入开源功能的方式相同，例如：
```js
import '@univerjs-pro/sheets-pivot/facade';
import '@univerjs-pro/exchange-client/facade';
```

### 使用[](https://docs.univer.ai/zh-CN/guides/sheets/getting-started/facade#%E4%BD%BF%E7%94%A8)

Facade API 是对 `Univer` 实例的封装，因此你需要在创建了 `Univer` 实例之后，再用 `FUniver` 包裹这个实例：
```js
import { FUniver } from "@univerjs/core/facade"; 
const univerAPI = FUniver.newAPI(univer);
```

0.6.0 之前，`FUniver` 从 `@univerjs/core` 中引入。
0.6.0 版本开始，`FUniver` 从 `@univerjs/core/facade` 中引入。
