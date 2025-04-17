见 [[Univer Sheet Api]]
### 修改数据[](https://docs.univer.ai/zh-CN/guides/sheets/getting-started/installation)

你可以通过调用 `univerAPI` 的方法来使用 Univer 了，例如获取当前激活的，并在指定的范围更新值：
```js
const sheet = univerAPI.getActiveWorkbook().getActiveSheet(); 
const range = sheet.getRange('A1');
range.setValue(1);
```
🚨

Univer 基于 [命令系统](https://docs.univer.ai/zh-CN/introduction/architecture/univer#command-system) 对状态和数据进行操作和更新，因此你**必须**使用 Facade API（或其对应的命令）来更新数据，任何直接对数据进行修改以更新视图的操作都不会生效。

### 存储数据[](https://docs.univer.ai/zh-CN/guides/sheets/getting-started/installation)

通过调用 `workbook` 的 `save` 方法，可以得到 `IWorkbookData` 对象，包含表格内部的最新数据。

```js
const savedData = univerAPI.getActiveWorkbook().save();
```
