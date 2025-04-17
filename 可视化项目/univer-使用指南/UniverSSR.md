# 在 Node.js 上运行 Univer

Univer 的同构特性使得它不仅可以在浏览器中运行，并且可以在 Node.js 上运行 🎉。
你可以基于 ***Univer on Node*** 开发数据处理服务，在服务器端生成电子表格，或执行电子表格的公式、透视表等运算，并通过熟悉的 Facade API [[Facade Api]] 和 Univer [[Univer]] 交互，而这一切仅需要调整所加载的插件。


## Presets[](https://docs.univer.ai/zh-CN/guides/sheets/getting-started/node#presets)

如果你使用 Presets 加载 Univer on Node，可参考如下代码：
```ts
import { createUniver, LocaleType, merge } from '@univerjs/presets';
import { UniverSheetsNodeCorePreset } from '@univerjs/presets/preset-sheets-node-core'; //SSR
import sheetsNodeCoreZhCN from '@univerjs/presets/preset-sheets-node-core/locales/zh-CN'; //SSR
 
async function run(): Promise<void> {
  const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
      locales: {
        [LocaleType.ZH_CN]: merge(
          {},
          sheetsNodeCoreZhCN,
        ),
      },
    presets: [
      UniverSheetsNodeCorePreset(),
    ],
  });
}
 
run();

// SSR生成的快照
const ssr = JSON.stringify({
  "id": "yw2Amw",
  "sheetOrder": ["uz45c8hbklChSplbzY1Ew"],
  "name": "",
  "appVersion": "0.6.9",
  "locale": "zhCN",
  "styles": {},
  "sheets": {
    "uz45c8hbklChSplbzY1Ew": {
      "id": "uz45c8hbklChSplbzY1Ew",
      "name": "Sheet1",
      "tabColor": "",
      "hidden": 0,
      "rowCount": 1000,
      "columnCount": 20,
      "zoomRatio": 1,
      "freeze": { "xSplit": 0, "ySplit": 0, "startRow": -1, "startColumn": -1 },
      "scrollTop": 0,
      "scrollLeft": 0,
      "defaultColumnWidth": 88,
      "defaultRowHeight": 24,
      "mergeData": [],
      "cellData": {},
      "rowData": {},
      "columnData": {},
      "showGridlines": 1,
      "rowHeader": { "width": 46, "hidden": 0 },
      "columnHeader": { "height": 20, "hidden": 0 },
      "rightToLeft": 0
    }
  },
  "resources": [
    { "name": "SHEET_UNIVER_THREAD_COMMENT_PLUGIN", "data": "{}" },
    { "name": "SHEET_RANGE_PROTECTION_PLUGIN", "data": "" },
    { "name": "SHEET_AuthzIoMockService_PLUGIN", "data": "{}" },
    { "name": "SHEET_WORKSHEET_PROTECTION_PLUGIN", "data": "{}" },
    { "name": "SHEET_WORKSHEET_PROTECTION_POINT_PLUGIN", "data": "{}" },
    { "name": "SHEET_HYPER_LINK_PLUGIN", "data": "{}" },
    { "name": "SHEET_DRAWING_PLUGIN", "data": "{}" },
    { "name": "SHEET_DEFINED_NAME_PLUGIN", "data": "" },
    { "name": "SHEET_RANGE_THEME_MODEL_PLUGIN", "data": "{}" },
    { "name": "SHEET_DATA_VALIDATION_PLUGIN", "data": "{}" },
    { "name": "SHEET_FILTER_PLUGIN", "data": "{}" }
  ]
});
Loading...
```

## 手动组合安装方式[](https://docs.univer.ai/zh-CN/guides/sheets/getting-started/node#%E6%89%8B%E5%8A%A8%E7%BB%84%E5%90%88%E5%AE%89%E8%A3%85%E6%96%B9%E5%BC%8F)

可参考如下代码启动 Univer on Node：

```ts
import { Univer, FUniver } from '@univerjs/core';

import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsDrawingPlugin } from '@univerjs/docs-drawing';

import { UniverDrawingPlugin } from '@univerjs/drawing';

import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCNodeMainPlugin } from '@univerjs/rpc-node';

import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsDrawingPlugin } from '@univerjs/sheets-drawing';
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsHyperLinkPlugin } from '@univerjs/sheets-hyper-link';
import { UniverSheetsSortPlugin } from '@univerjs/sheets-sort';


import { UniverSheetsConditionalFormattingPlugin } from '@univerjs/sheets-conditional-formatting';

import { UniverDataValidationPlugin } from '@univerjs/data-validation';
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';

import { UniverThreadCommentPlugin } from '@univerjs/thread-comment';
 
import '@univerjs/sheets/facade';
import '@univerjs/sheets-data-validation/facade';
import '@univerjs/engine-formula/facade';
import '@univerjs/sheets-filter/facade';
import '@univerjs/sheets-formula/facade';
 
export function createUniverOnNode(): Univer {
  const univer = new Univer();
 
  registerBasicPlugins(univer);
  registerSharedPlugins(univer);
  registerRPCPlugin(univer);
  registerDocPlugins(univer);
  registerSheetPlugins(univer);
 
  return univer;
}
// 基础
function registerBasicPlugins(univer: Univer): void {
  univer.registerPlugin(UniverFormulaEnginePlugin); // 基本的
}
// 共享
function registerSharedPlugins(univer: Univer): void {
  univer.registerPlugin(UniverThreadCommentPlugin);
  univer.registerPlugin(UniverDrawingPlugin);
}
// 文档
function registerDocPlugins(univer: Univer): void {
  univer.registerPlugin(UniverDocsPlugin);
  univer.registerPlugin(UniverDocsDrawingPlugin);
}
// 表格
function registerSheetPlugins(univer: Univer): void {
  univer.registerPlugin(UniverSheetsPlugin);
  univer.registerPlugin(UniverSheetsFormulaPlugin);
  univer.registerPlugin(UniverSheetsConditionalFormattingPlugin);
  univer.registerPlugin(UniverDataValidationPlugin);
  univer.registerPlugin(UniverSheetsDataValidationPlugin);
  univer.registerPlugin(UniverSheetsFilterPlugin);
  univer.registerPlugin(UniverSheetsHyperLinkPlugin);
  univer.registerPlugin(UniverSheetsDrawingPlugin);
  univer.registerPlugin(UniverSheetsSortPlugin);
}
 
async function run(): Promise<void> {
  const univerAPI = FUniver.newAPI(createUniverOnNode());
}
 
run();
```

可以看到，Univer on Node 基本上就是一个移除了和 ***UI*** 相关的插件的 Univer！