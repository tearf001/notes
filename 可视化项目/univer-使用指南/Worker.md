
# Worker 使用示例

以下示例展示了 Univer 中使用 Worker 的基本用法。

## Presets 示例 

`UniverSheetsCorePreset` 配置参数中的 `workerURL` 选项可以指定 Worker 的 URL 地址并启用 Worker 模式。
```ts
new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
```

### sheets-core-with-worker 示例 

此处示例引入了 sheets-filter 的 preset 包，是因为公式 SUBTOTAL 计算时受到 sheets-filter 筛选隐藏行的影响。当公式计算在 Worker 中执行时，sheets-filter 也需要在 Worker 中执行。

```ts
// main.ts
import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import UniverPresetSheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsFilterPreset } from '@univerjs/presets/preset-sheets-filter';
import UniverPresetSheetsFilterZhCN from '@univerjs/presets/preset-sheets-filter/locales/zh-CN';
 
import '@univerjs/presets/lib/styles/preset-sheets-core.css'
import '@univerjs/presets/lib/styles/preset-sheets-filter.css'
 
const { univerAPI } = createUniver({
  locale: LocaleType.ZH_CN,
  locales: {
    [LocaleType.ZH_CN]: merge(
      {},
      UniverPresetSheetsCoreZhCN,
      UniverPresetSheetsFilterZhCN 
    ),
  },
  theme: defaultTheme,
  presets: [
    UniverSheetsCorePreset({
      workerURL: new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
    }),
    UniverSheetsFilterPreset({
	    // ...
    }),
  ],
});
 
univerAPI.createWorkbook({ name: 'Test Sheet' });
```

直接使用worker插件
```ts
// worker.ts
import { createUniver, LocaleType } from '@univerjs/presets';

import { UniverSheetsCoreWorkerPreset } from '@univerjs/presets/preset-sheets-core/worker';
import { UniverSheetsFilterWorkerPreset } from '@univerjs/presets/preset-sheets-filter/worker';


import UniverPresetSheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import UniverPresetSheetsFilterZhCN from '@univerjs/presets/preset-sheets-filter/locales/zh-CN';
 
createUniver({
  locale: LocaleType.ZH_CN,
  locales: {
    [LocaleType.ZH_CN]: merge(
      {},
      UniverPresetSheetsCoreZhCN,
      UniverPresetSheetsFilterZhCN 
    ),
  },
  presets: [
    UniverSheetsCoreWorkerPreset(),
    UniverSheetsFilterWorkerPreset(),
  ],
});
```
### sheets-collaboration-with-worker 示例

```ts
// main.ts
import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets';

import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import { UniverSheetsAdvancedPreset } from '@univerjs/presets/preset-sheets-advanced';

import { UniverSheetsCollaborationPreset } from '@univerjs/presets/preset-sheets-collaboration';
import { UniverSheetsDrawingPreset } from '@univerjs/presets/preset-sheets-drawing'
 
 
const { univerAPI } = createUniver({
  locale: LocaleType.ZH_CN,
  theme: defaultTheme,
  collaboration: true, // 开关
  presets: [
    UniverSheetsCorePreset({
      workerURL: new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
    }),
    UniverSheetsDrawingPreset({
      collaboration: true, // 绘画协作
    }),
    UniverSheetsAdvancedPreset({
      useWorker: true, // 高级中激活
      // 如果您想使用无限制商业功能，可以从 https://univer.ai/zh-CN/license 获取 30 天试用许可证
      license: process.env.UNIVER_CLIENT_LICENSE || 'your license.txt',
    }),
    UniverSheetsCollaborationPreset({
      universerEndpoint: 'http://localhost:3010', // 自定义: 服务端点
    }),
  ],
});
```


## 手动组合 PLUGINS 示例
可以参考 Univer 开源版中的示例代码：

- [`main.ts`](https://github.com/dream-num/univer/blob/dev/examples/src/sheets/main.ts)
- [`worker.ts`](https://github.com/dream-num/univer/blob/dev/examples/src/sheets/worker.ts)