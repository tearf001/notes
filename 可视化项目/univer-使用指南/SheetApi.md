
# Univer Sheets API

## 概念[](https://docs.univer.ai/zh-CN/guides/sheets/features/core/sheet-api#%E6%A6%82%E5%BF%B5)

Univer 表格相关概念会尽可能与 Excel 保持一致。

## 工作簿 Workbook[](https://docs.univer.ai/zh-CN/guides/sheets/features/core/sheet-api#%E5%B7%A5%E4%BD%9C%E7%B0%BF-workbook)

一个工作簿里包含多个工作表，可以看作是一个 Excel 文件。

`unitId` 可用作工作簿的唯一标识。

### 创建工作簿[](https://docs.univer.ai/zh-CN/guides/sheets/features/core/sheet-api#%E5%88%9B%E5%BB%BA%E5%B7%A5%E4%BD%9C%E7%B0%BF)

[`univerAPI.createWorkbook(data, options)`](https://reference.univer.ai/zh-CN/classes/FUniver#createworkbook) 方法会创建并返回 `FWorkbook` 实例。

[`IWorkbookData`](https://docs.univer.ai/guides/sheets/getting-started/workbook-data) 是一个对象，包含了工作簿的配置信息。

```ts
// makeCurrent 默认true
const fWorkbook = univerAPI.createWorkbook({ id: 's1', name: 's1' }, { makeCurrent: false });
// 3s 后如果想切换到此工作簿
setTimeout(() => { 
	univerAPI.setCurrent(fWorkbook.getId());
}, 3000);
```

### 获取工作簿数据
```ts
const fWorkbook = univerAPI.getActiveWorkbook();
const snapshot = fWorkbook.save();
console.log(snapshot);
```

### 销毁工作簿
```ts
const fWorkbook = univerAPI.getActiveWorkbook();
const unitId = fWorkbook?.getId();
if(unitId) {
  univerAPI.disposeUnit(unitId)
}
```

当 Univer 实例挂载的整个页面被销毁或路由被卸载时，务必调用 `univer.dispose()` 方法进行清理，而不是使用 `univerAPI.disposeUnit`。 

`univer` 和 `univerAPI` 是两个不同的实例，关于如何获取它们的实例，请参考 [安装和基本使用](https://docs.univer.ai/zh-CN/guides/sheets/getting-started/installation)。

### 获取工作簿 ID
```ts
const workbook = univerAPI.getActiveWorkbook();
workbook?.getId()
```
## 工作表 Worksheet 
工作表中存储着表格数据，工作表属于工作薄，

一个工作薄可以包含多个工作表，同一个工作薄中工作表的名称不能重复。

`subUnitId` 可用作在工作薄中工作表的唯一标识。

### 获取工作表 

获取工作薄中所有工作表, 当前激活的工作表
```ts
const fWorkbook = univerAPI.getActiveWorkbook();
const sheets = fWorkbook.getSheets();
const activeSheet = fWorkbook.getActiveSheet();
const sheets[0].getSheetId()); // 获取ID
```

### 获取工作表数据
```ts
const fWorkbook = univerAPI.getActiveWorkbook();
const fWorksheet = fWorkbook.getActiveSheet();
const sheetSnapshot = fWorksheet.getSheet().getSnapshot();
```

### 创建工作表
下面例子展示通过 [`FWorkbook.create`](https://reference.univer.ai/zh-CN/classes/FWorkbook#create) 方法创建一个工作表。
```ts
const fWorkbook = univerAPI.getActiveWorkbook(); 
// 创建一个名为 'Sheet2' 的工作表，包含 10 行和 10 列
const newSheet = fWorkbook.create('Sheet2', 10, 10);
```
### 删除工作表 

通过传入工作表实例或工作表 ID 来删除工作表
```ts
// 删除第二个工作表
const fWorkbook = univerAPI.getActiveWorkbook();
const sheet = fWorkbook.getSheets()[1];
fWorkbook.deleteSheet(sheet); 
fWorkbook.deleteSheet(sheet.getSheetId());
```

### 激活工作表 

通过传入工作表实例或工作表 ID 来激活工作表, 或者通过 `FWorksheet.activate()` 方法激活工作表

```ts
// 激活第二个工作表
const fWorkbook = univerAPI.getActiveWorkbook();
const sheet = fWorkbook.getSheets()[1];
fWorkbook.setActiveSheet(sheet);
 
// 通过 id 激活指定的工作表
fWorkbook.setActiveSheet(sheet.getSheetId());
 
// 通过 FWorksheet.activate() 方法激活工作表
sheet.activate();
sheet.refreshCanvas();  // ### 刷新工作表
```

### 工作表缩放
```ts
fWorksheet.zoom(2);
const zoomRatio = fWorksheet.getZoom();
```

### 滚动到指定位置 

```ts
const fWorkbook = univerAPI.getActiveWorkbook();
const fWorksheet = fWorkbook.getActiveSheet();
 
// 滚动到 D10 单元格
const fRange = fWorksheet.getRange('D10');
const row = fRange.getRow();
const column = fRange.getColumn();
fWorksheet.scrollToCell(row, column);
 
// 获取滚动状态
const scrollState = fWorksheet.getScrollState();
const { offsetX, offsetY, sheetViewStartColumn, sheetViewStartRow } = scrollState;
console.log(scrollState); // sheetViewStartRow: 9, sheetViewStartColumn: 3, offsetX: 0, offsetY: 0
```
## 核心功能[](https://docs.univer.ai/zh-CN/guides/sheets/features/core/sheet-api#%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BD)

### [[权限控制]]

### [[公式]]

### [[行列操作]]

### [[范围Range]]

### [[选区Selection]]

### [[单元格Cell]]

### [[冻结]]

### [[集成自定义组件]]
