本文档描述了 Univer Sheets 中使用的主要数据结构：`IWorkbookData` 和 `IWorksheetData`。

## [IWorkbookData](https://reference.univer.ai/zh-CN/interfaces/IWorkbookData) 


`IWorkbookData` 表示 Univer Sheets 中工作簿的快照。
#IWorkbookData

### 属性

| 属性         | 类型                                               | 描述                    |
| ---------- | ------------------------------------------------ | --------------------- |
| id         | `string`                                         | Univer Sheets 的唯一标识符。 |
| name       | `string`                                         | Univer Sheets 的名称。    |
| appVersion | `string`                                         | Univer 模型定义的版本。       |
| locale     | `LocaleType`                                     | 文档的语言环境。              |
| styles     | `Record<string, Nullable<IStyleData>>`           | 工作簿的样式引用。             |
| sheetOrder | `string[]`                                       | 表示工作表顺序的工作表 ID 数组。    |
| sheets     | `{ [sheetId: string]: Partial<IWorksheetData> }` | 包含每个工作表数据的记录。         |
| resources? | `IResources`                                     | 存储***插件***的数据。        |

### 示例
```ts
const workbookData: IWorkbookData = {  
  id: 'unique-workbook-id',  
  name: '我的工作簿',  
  appVersion: '1.0.0',  
  locale: LocaleType.ZH_CN,  
  styles: { /* 样式定义 */ },  
  sheetOrder: ['sheet1', 'sheet2'],  
  sheets: {  
    sheet1: { /* 工作表数据 */ },  
    sheet2: { /* 工作表数据 */ }  
  }  
};
```


### 使用
#IWorkbookData 是 Univer Sheets 存储数据的对象。主要用于
#### 创建表格

1. [使用 IWorkbookData 创建 Univer Sheets](https://docs.univer.ai/zh-CN/guides/sheets/features/core/sheet-api#create-worksheet)
#### 保存表格
    
2. [从 Univer Sheets 中保存 IWorkbookData](https://docs.univer.ai/zh-CN/guides/sheets/features/core/sheet-api#get-workbook-data)
    
### 插件设置

`resources` 属性用于存储插件的数据。见[[插件自定义模型]], 官方文档 前往  [插件自定义模型](https://docs.univer.ai/guides/sheets/advanced/custom-model)

## [IWorksheetData](https://reference.univer.ai/zh-CN/interfaces/IWorksheetData) 

#IWorksheetData 表示 Univer Sheets 中工作表的快照。

### 属性

|属性|类型|描述|
|---|---|---|
|id|`string`|工作表的唯一标识符。|
|name|`string`|工作表的名称。|
|tabColor|`string`|工作表标签的颜色。|
|hidden|`BooleanNumber`|工作表是否隐藏。默认值：`BooleanNumber.FALSE`。|
|freeze|`IFreeze`|冻结窗格设置。|
|rowCount|`number`|总行数。|
|columnCount|`number`|总列数。|
|defaultColumnWidth|`number`|列的默认宽度，单位 `px`。|
|defaultRowHeight|`number`|行的默认高度，单位 `px`。|
|mergeData|`IRange[]`|合并单元格范围的数组。|
|cellData|`IObjectMatrixPrimitiveType<ICellData>`|单元格内容的矩阵。[详情](https://docs.univer.ai/guides/sheets/getting-started/cell-data)|
|rowData|`IObjectArrayPrimitiveType<Partial<IRowData>>`|行数据对象的数组。|
|columnData|`IObjectArrayPrimitiveType<Partial<IColumnData>>`|列数据对象的数组。|
|rowHeader|`{ width: number; hidden?: BooleanNumber; }`|行标题配置。|
|columnHeader|`{ height: number; hidden?: BooleanNumber; }`|列标题配置。|
|showGridlines|`BooleanNumber`|是否显示网格线。|
|rightToLeft|`BooleanNumber`|工作表是否为从右到左模式。|
|[defaultStyle](https://docs.univer.ai/guides/sheets/features/core/default-style)?|`Nullable<IStyleData>`|默认工作表样式|

### 示例

const worksheetData: IWorksheetData = {  
  id: 'sheet1',  
  name: '工作表 1',  
  tabColor: '#FF0000',  
  hidden: BooleanNumber.FALSE,  
  freeze: { xSplit: 1, ySplit: 1, startRow: 1, startColumn: 1 },  
  rowCount: 1000,  
  columnCount: 26,  
  defaultColumnWidth: 100,  
  defaultRowHeight: 25,  
  mergeData: [],  
  cellData: {  
    '0': {  
      '0': {  
        v: 123  
      }  
    }  
  },  
  rowData: [],  
  columnData: [],  
  rowHeader: { width: 40 },  
  columnHeader: { height: 20 },  
  showGridlines: BooleanNumber.TRUE,  
  rightToLeft: BooleanNumber.FALSE  
};

这个结构提供了工作表数据的全面表示，包括布局、内容和显示设置。

## 完整示例
```js
const workbook: IWorkbookData = {  
  "id": "gyI0JO",  
  "sheetOrder": [  
    "RSfWjJFv4opmE1JaiRj80"  
  ],  
  "name": "",  
  "appVersion": "0.5.0",  
  "locale": "zhCN",  
  "styles": {},  
  "sheets": {  
    "RSfWjJFv4opmE1JaiRj80": {  
      "id": "RSfWjJFv4opmE1JaiRj80",  
      "name": "测试",  
      "tabColor": "",  
      "hidden": 0,  
      "rowCount": 30,  
      "columnCount": 10,  
      "zoomRatio": 1,  
      "freeze": {  
        "startRow": -1,  
        "startColumn": -1,  
        "ySplit": 0,  
        "xSplit": 0  
      },  
      "scrollTop": 0,  
      "scrollLeft": 0,  
      "defaultColumnWidth": 73,  
      "defaultRowHeight": 23,  
      "mergeData": [],  
      "cellData": {},  
      "rowData": {},  
      "columnData": {  
        "0": {  
          "w": 125,  
          "hd": 0  
        },  
        "1": {  
          "w": 125,  
          "hd": 0  
        },  
        "2": {  
          "w": 125,  
          "hd": 0  
        },  
        "3": {  
          "w": 125,  
          "hd": 0  
        },  
        "4": {  
          "w": 125,  
          "hd": 0  
        },  
        "5": {  
          "w": 125,  
          "hd": 0  
        },  
        "6": {  
          "w": 125,  
          "hd": 0  
        },  
        "7": {  
          "w": 125,  
          "hd": 0  
        },  
        "8": {  
          "w": 125,  
          "hd": 0  
        },  
        "9": {  
          "w": 125,  
          "hd": 0  
        }  
      },  
      "showGridlines": 1,  
      "rowHeader": {  
        "width": 46,  
        "hidden": 0  
      },  
      "columnHeader": {  
        "height": 20,  
        "hidden": 0  
      },  
      "selections": [  
        "A1"  
      ],  
      "rightToLeft": 0  
    }  
  },  
  "resources": [  
    {  
      "name": "SHEET_DEFINED_NAME_PLUGIN",  
      "data": ""  
    }  
  ]  
}
```