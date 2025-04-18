[文档](https://docs.univer.ai/zh-CN/guides/sheets/features/core/general-api)


在 Univer 中，根据***文档***的不同类型，所能调用的 Facade API 也有所不同。

本章节将介绍在所有类型文档都适用的通用 *Facade API*。

## 概念

### 命令

Univer 中大多数的操作都会注册到命令系统，并通过命令系统来触发。这种统一的操作方式使得 Univer 可以很容易的实现撤销、重做、协同等功能。

   如需了解更多设计细节请阅读 [Univer 命令系统](https://docs.univer.ai/zh-CN/introduction/architecture/univer#command-system) 。

## 命令系统

Univer 为用户提供了统一的命令系统，通过命令系统用户可以实现各种定制化的功能。

   每一个命令对应了一个唯一的 ID。如果你正在寻找某个特定的命令 ID，可以参考 [如何查找命令 ID](https://docs.univer.ai/guides/sheets/tutorials/find-the-command-id)。

### 监听命令

Univer 设计了两种监听命令的方式，分别是在命令执行前和在命令执行后：

- `onBeforeCommandExecute`：在命令执行前执行自定义逻辑。
- `onCommandExecuted`：在命令执行后执行自定义逻辑。

#### 监听命令执行前

在命令执行之前，我们向 `FUniver.onBeforeCommandExecute` API 传入一个回调函数来注册自定义的预处理监听器。

当命令执行前，预处理监听器内逻辑会被执行。
```ts
const univerAPI = FUniver.newAPI(univer); 
const disposable = univerAPI.onBeforeCommandExecute((command) => {
  const { id, type, params } = command;
  // 在命令执行前执行自定义逻辑
})

//如果你想在命令执行前阻止命令执行，可以在监听器回调中 `throw` 一个异常。

const univerAPI = FUniver.newAPI(univer); 
univerAPI.onBeforeCommandExecute((command) => {  
   throw new Error('禁止编辑')
})
// 取消监听
return () => disposable.dispose()

```

#### 监听命令执行后

在命令执行之后，我们也可以向 `FUniver.onCommandExecuted` API 传入一个回调函数来注册自定义的后处理监听器。

当命令执行后，后处理监听器内逻辑会被执行。
```ts
const univerAPI = FUniver.newAPI(univer); 
univerAPI.onCommandExecuted((command) => {
  const { id, type, params } = command;
  // 在命令执行后执行自定义逻辑
})
```

### 执行命令

如果你知道命令 ID 和所需要传递的参数，也可以通过 `FUniver.executeCommand` 方法来执行命令。

例如，我们可以通过 `sheet.command.set-range-values` 命令来设置单元格 A1 的值：
```ts
const univerAPI = FUniver.newAPI(univer); 
// 执行命令
univerAPI.executeCommand('sheet.command.set-range-values', {
  value: { v: "Hello, Univer!" },
  range: { startRow: 0, startColumn: 0, endRow: 0, endColumn: 0 } // 1x1
});
```

## 事件系统
Univer 提供了一个完整的事件系统，允许你监听和响应电子表格中的各种变化。事件可以分为多个类别，包括剪贴板操作、选区变化、单元格交互、表格修改等。

### 事件类别[](https://docs.univer.ai/zh-CN/guides/sheets/features/core/general-api#%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%88%AB)

完整事件列表请参考：[https://reference.univer.ai/zh-CN/classes/FEventName](https://reference.univer.ai/zh-CN/classes/FEventName) 

1. **剪贴板事件**
    
    - `BeforeClipboardChange`: 在剪贴板内容改变前触发，可以通过设置 `params.cancel = true` 来阻止改变
    - `BeforeClipboardPaste`: 在粘贴内容前触发，可以通过设置 `params.cancel = true` 来阻止粘贴
    - `ClipboardChanged`: 在剪贴板内容改变后触发，可以获取新的剪贴板内容
    - `ClipboardPasted`: 在内容粘贴后触发，可以获取粘贴的内容
2. **选区事件**
    
    - `SelectionChanged`: 在选区改变时触发，提供新的选区范围信息
    - `SelectionMoveStart`: 在选区开始移动时触发，可用于实现自定义选区效果
    - `SelectionMoveEnd`: 在选区结束移动时触发，提供最终的选区范围
    - `SelectionMoving`: 在选区移动过程中触发，可用于实时更新UI
    - `DragOver`: 在拖动经过单元格时触发
    - `Drop`: 在放置选区内容时触发
3. **单元格事件**
    
    - `CellClicked`: 在单元格被点击时触发，提供单元格的位置和内容信息
    - `CellHover`: 在鼠标悬停在单元格上时触发，可用于显示提示信息
    - `CellPointerDown`: 在单元格上按下指针时触发，用于开始拖动或选择操作
    - `CellPointerUp`: 在单元格上释放指针时触发，用于完成操作
    - `CellPointerMove`: 在指针在单元格上移动时触发
4. **表格事件**
    
    - `SheetValueChanged`: 在表格值改变时触发，提供变更的范围和新值
    - `SheetZoomChanged`: 在缩放级别改变时触发，可获取新的缩放比例
    - `SheetSkeletonChanged`: 在表格结构改变时触发，如行列的插入删除
    - `BeforeSheetEditStart`: 在单元格开始编辑前触发，可用于控制是否允许编辑
    - `SheetEditStarted`: 在单元格开始编辑时触发，可用于自定义编辑器行为
    - `BeforeSheetEditEnd`: 在单元格结束编辑前触发，可用于验证编辑内容
    - `SheetEditEnded`: 在单元格结束编辑时触发，提供编辑后的值
    - `SheetEditChanging`: 在单元格编辑过程中触发，可用于实时验证或格式化
    - `Scroll`: 在表格滚动时触发，提供滚动位置信息
    - `CrosshairHighlightColorChanged`: 在十字光标高亮颜色改变时触发
    - `CrosshairHighlightEnabledChanged`: 在启用或禁用十字光标高亮时触发
5. **表头事件**
    
    - `RowHeaderClick`: 在行表头被点击时触发
    - `RowHeaderHover`: 在鼠标悬停在行表头时触发
    - `ColumnHeaderClick`: 在列表头被点击时触发
    - `ColumnHeaderHover`: 在鼠标悬停在列表头时触发
6. **数据验证事件**
    
    - `BeforeSheetDataValidationAdd`: 在添加数据验证规则前触发
    - `SheetDataValidationChanged`: 在数据验证规则改变时触发
    - `SheetDataValidatorStatusChanged`: 在数据验证状态改变时触发
7. **评论事件**
    
    - `BeforeCommentAdd`: 在添加评论前触发
    - `CommentAdded`: 在评论添加后触发
    - `BeforeCommentUpdate`: 在更新评论前触发
    - `CommentUpdated`: 在评论更新后触发
    - `BeforeCommentDeleted`: 在删除评论前触发
    - `CommentDeleted`: 在评论删除后触发
8. **数据处理事件**
    
    - `SheetBeforeRangeSort`: 在范围排序前触发
    - `SheetRangeSorted`: 在范围排序后触发
    - `SheetBeforeRangeFilter`: 在范围筛选前触发
    - `SheetRangeFiltered`: 在范围筛选后触发
    - `BeforePivotTableAdd`: 在添加数据透视表前触发
    - `PivotTableAdded`: 在数据透视表添加后触发

### 使用事件
你可以使用 `univerAPI` 的 `addEvent` 方法来监听事件。以下是基本模式：
```ts
const disposable = univerAPI.addEvent(univerAPI.Event.事件名称, (params) => {
  // 处理事件参数
});
```
#### 示例：监听单元格点击
```ts
const disposable = univerAPI.addEvent(univerAPI.Event.CellClicked, (params) => {
  const { worksheet, workbook, row, column, value } = params;
  console.log(`单元格被点击，行：${row}，列：${column}`);
});
```

#### 示例：监控剪贴板操作
```ts
const disposable = univerAPI.addEvent(univerAPI.Event.BeforeClipboardPaste, (params) => {
  const { text, html } = params;
  // 如果要取消粘贴操作
  params.cancel = true;
});
```
#### 示例：跟踪选区变化
```ts
const disposable = univerAPI.addEvent(univerAPI.Event.SelectionChanged, (params) => {
  const { worksheet, workbook, selections } = params;
  console.log('选区已改变:', selections);
});
```

## 撤销和重做
### 撤销
`await univerAPI.undo();`
### 重做
`await univerAPI.redo();`

## 系统剪切板

从 `0.2.12` 开始，使用 [`FUniver.copy()`](https://reference.univer.ai/zh-CN/classes/FUniver#copy) 和 [`FUniver.paste()`](https://reference.univer.ai/zh-CN/classes/FUniver#paste) 方法读取和写入系统剪贴板。

复制与粘贴依赖浏览器原生 API ，当[环境条件或者权限](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard/writeText) 不满足时复制与粘贴功能将无法工作。

```ts
// 防止在控制台中执行复制粘贴代码时因失去焦点而失败，
// 此示例监听单元格点击事件并执行复制粘贴代码。
univerAPI.addEvent(univerAPI.Event.CellClicked, async (params) => {
  const fWorkbook = univerAPI.getActiveWorkbook();
  const fWorksheet = fWorkbook.getActiveSheet();
     
  // 将范围 A1:B2 复制到剪贴板
  const fRange = fWorksheet.getRange('A1:B2');
  fRange.activate().setValues([
    [1, 2],
    [3, 4]
  ]);
  await univerAPI.copy();
     
  // 将复制的内容粘贴到范围 C1:D2
  const fRange2 = fWorksheet.getRange('C1');
  fRange2.activate();
  await univerAPI.paste();
 
  // 检查粘贴的内容
  console.log(fWorksheet.getRange('C1:D2').getValues()); // [[1, 2], [3, 4]]
});
```

# UI
请参考下面文档来拓展 Univer 的 UI :

- [扩展 Canvas](https://docs.univer.ai/guides/sheets/advanced/custom-canvas)
- [自定义主题](https://docs.univer.ai/guides/sheets/advanced/custom-theme)

# WebSocket

Facade 提供了一个便捷的 API `createSocket` 来创建 WebSocket，传入一个 URL 即可。 然后可以监听 open、message、close、error 事件，以及主动发送消息 send 方法和主动关闭 close 方法。

使用 Presets 安装，可以直接使用 `univerAPI.createSocket(url)`。 使用手动组合安装，需要安装 [`@univerjs/network`](https://www.npmjs.com/package/@univerjs/network) 依赖包，并注册 `UniverNetworkPlugin` 插件。

```ts
// ... 省略其他插件引入
import { UniverNetworkPlugin } from '@univerjs/network'; 
// ... 省略其他 facade 引入
import '@univerjs/network/facade'; 
// ... 省略其他插件注册
univer.registerPlugin(UniverNetworkPlugin);

以下是一个简单的示例：
以下是一个简单的示例：
以下是一个简单的示例：
// URL 换成你自己 WebSocket 服务的地址
const ws = univerAPI.createSocket("ws://47.100.177.253:8449/ws");
 
ws.open$.subscribe(() => { // 监听连接事件
  console.log('websocket opened')
  ws.send('hello')
})
 
ws.message$.subscribe((message) => { // 监听消息
  console.log('websocket message', message)
  const content = JSON.parse(message.data).content
  if (!content.includes('command')) {
    return
  }
 
  const commandInfo = JSON.parse(content);
  const { command, options } = commandInfo;
  const { id, params } = command;
 
  // 接受到协同数据，本地落盘
  univerAPI.executeCommand(id, params, options)
});
// 其他事件
ws.close$.subscribe(() => {
  console.log("websocket closed");
});
// 错误捕获
ws.error$.subscribe((error) => {
  console.log("websocket error", error);
});
// 监听命令, 和 WS 通信
univerAPI.onCommandExecuted((command, options) => {
  // 仅同步本地 mutation
  if (command.type !== 2 || options?.fromCollab || options?.onlyLocal || command.id === 'doc.mutation.rich-text-editing') {
    return;
  }
  // 发送 ws
  const commandInfo = JSON.stringify({ command, options: { fromCollab: true } })
  ws.send(commandInfo);
})
```

## 注册公式 
使用 Facade API，可以方便快速的在当前 Univer 实例中注册自定义公式。

如下案例所示，使用 [`registerFunction`](https://reference.univer.ai/zh-CN/classes/FFormula#registerfunction) 将一个 `CUSTOMSUM` 公式所需要的算法、名称、描述一次性注册到公式插件，执行之后就可以使用公式了。在任一空白单元格输入 `=CUSTOMSUM` 可以看到提示。

```ts
// 注册公式支持 lambda 函数
const formulaEngine = univerAPI.getFormula();
// 求和
const disposable = formulaEngine.registerFunction(
  'CUSTOMSUM',
  (...variants) => {
    let sum = 0;    
    const last = variants.at(-1);
    if (last.isLambda && last.isLambda()) {
      const lambda = variants.pop();
      const vars = variants.map((variant) => Array.isArray(variant) ? variant[0][0]: variant);
      sum += lambda.executeCustom(...vars.map(v=>Number(v) || 0)).getValue();
    }
    // 普通情况
    for (const variant of variants) {
      sum += Number(variant) || 0;
    } 
    return sum;
  },
  '求参数的和'
);
 
// Use the function in a cell
const fWorkbook = univerAPI.getActiveWorkbook();
const fWorksheet = fWorkbook.getActiveSheet();
const cellA1 = fWorksheet.getRange('A1');
cellA1.setValue(1);
const cellA2 = fWorksheet.getRange('A2');
cellA2.setValue(2);
const cellA3 = fWorksheet.getRange('A3');
cellA3.setValue({ f: '=CUSTOMSUM(A1,A2,LAMBDA(x,y,x*y))' });
 
// A3 will display: 5
formulaEngine.calculationEnd((functionsExecutedState) => {
  if (functionsExecutedState === 3) {
    console.log(cellA3.getValue()); // 5
  }
})
```


## 枚举类型 API 

Facade API 提供了一些常用的枚举类型，可以在开发过程中使用。例如：

```ts
console.log(univerAPI.Enum);
console.log(univerAPI.Enum.UniverInstanceType.UNIVER_SHEET);
console.log(univerAPI.Enum.LifecycleStages.Rendered);
```

## 工具方法 API 

Facade API 提供了一些常用的工具方法，可以在开发过程中使用。例如：

```ts
console.log(univerAPI.Util);
console.log(univerAPI.Util.tools.chatAtABC(10));
console.log(univerAPI.Util.tools.ABCatNum('K'));
```