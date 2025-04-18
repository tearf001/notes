# 编写一个 CSV 导入插件

我们将通过编写一个实际案例，来学习如何编写一个 Univer 插件。

学习本案例，你可以学习如下内容：

- 如何创建一个 Univer 插件
- 如何将插件***挂载***到 Univer 实例中
- 如何使用插件的生命周期
- 如何使用 Univer 依赖注入系统
- 如何定制 Univer 的 UI
- 如何访问和使用 Univer 底层 API
## 案例介绍

这个插件允许用户导入 CSV 格式的文件到 Univer 表格中。

我们先来体验一下这个插件的效果：
```js
import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets' // from shit
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core'

import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN'
import '@univerjs/presets/lib/styles/preset-sheets-core.css'

import ImportCSVButtonPlugin from './import-csv-button'

const { univerAPI } = createUniver({
  locale: LocaleType.ZH_CN,
  locales: {
    [LocaleType.ZH_CN]: merge(
      {},
      sheetsCoreZhCN,
    ),
  },
  theme: defaultTheme,
  presets: [
    UniverSheetsCorePreset(),
  ],
  plugins: [
    ImportCSVButtonPlugin,
  ],
})

univerAPI.createWorkbook({})
```

## 需求拆解

插件需要完成以下功能：

1. 通过 Univer API 向工具栏追加一个***菜单按钮***，定义菜单按钮的图标、文本等属性。
2. 响应菜单按钮的点击事件，点击菜单按钮后弹出浏览器的***文件选择框***，选择 CSV 文件。
3. 将 CSV 内容转换成 Univer 的数据结构。
4. 通过 Univer API 将数据设置到当前表格的单元格中。

## 准备工作

### 1. 创建插件

我们在 `src/plugins` 目录下创建 `ImportCSVButton.ts` 文件，代码如下：
```js
import { Inject, Injector, Plugin } from '@univerjs/core'

class ImportCSVButtonPlugin extends Plugin {
  static override pluginName = 'import-csv-plugin';
  constructor(
    // inject injector, required
    @Inject(Injector) override readonly _injector: Injector
  ) {
    super()
  }
  /** Plugin onStarting lifecycle */
  onStarting() {
    console.log('onStarting') // todo something
  }
}
 
export default ImportCSVButtonPlugin
```

插件需要继承 `Plugin` 类，该类提供了插件的基础功能，***如插件的生命周期、插件的依赖注入***等。

插件名称通过 `override` 来定义，该名称用于标识插件，在实例中必须是***唯一***的。

我们在插件的构造函数中，通过装饰器 `@Inject` 注入了 `Injector` 对象，该对象可以用于*获取 Univer 的其他对象*。

如果我们需要使用 Univer 的其他对象，可以通过 `@Inject` 装饰器注入的方式来获取，后面还会讲到。

我们在插件的 `onStarting` 生命周期中，输出了一段日志，该生命周期会在插件挂载到 Univer 实例时执行，我们在该生命周期中初始化插件的内部模块。

关于插件的生命周期的更多信息，可以查看 [插件生命周期](https://docs.univer.ai/zh-CN/introduction/architecture/univer#plugin-life-cycle) 了解更多。


### 2. 挂载插件到 Univer 实例[](https://docs.univer.ai/zh-CN/guides/sheets/tutorials/csv-import-plugin#2-%E6%8C%82%E8%BD%BD%E6%8F%92%E4%BB%B6%E5%88%B0-univer-%E5%AE%9E%E4%BE%8B)

Univer 实例化后，我们可以通过实例方法 `registerPlugin` 来挂载插件到 Univer 实例中。

我们在 `src/index.ts` 中挂载插件，代码如下：
```js
import { Univer } from '@univerjs/core' // 良好的引入
import ImportCSVButtonPlugin from '../plugins/ImportCSVButton'
//  ...omit other code
 
const univer = new Univer()
//  ...omit other code
 
univer.registerPlugin(ImportCSVButtonPlugin)
```

## 开发插件

### 1. 注册菜单按钮 UI

我们在插件的 `onStarting` 生命周期中追加工具栏按钮。
追加操作栏菜单按钮使用 [`IMenuManagerService.mergeMenu`](https://reference.univer.ai/@univerjs/ui/index/classes/MenuManagerService#mergemenu) 方法。
首先，我们在插件构造函数中注入 `IMenuManagerService` 接口的类实现的实例对象，代码如下：

```js
// ...omit other code
import { FolderSingle } from '@univerjs/icons'
import { ComponentManager, IMenuManagerService, MenuItemType, RibbonStartGroup } from '@univerjs/ui'
 
class ImportCSVButtonPlugin extends Plugin {
  constructor(
    // inject injector, required
    @Inject(Injector) override readonly _injector: Injector,
    // inject menu service, to add toolbar button
    @Inject(IMenuManagerService) private readonly menuManagerService: IMenuManagerService,
    // inject component manager, to register icon component
    @Inject(ComponentManager) private readonly componentManager: ComponentManager,
  ) {
    // ...omit other code
  }
  // ...omit other code
}
// ...omit other code
```

然后在插件的 `onStarting` 生命周期中，我们需要定义一个 `menuItemFactory` 函数，该方法返回一个 `IMenuItem` 对象，该对象定义了菜单按钮的图标、文本、类型等属性。

这样，我们就可以访问 `IMenuManagerService` 的实例对象追加菜单按钮了，代码如下：
```js
// ...omit other code
onStarting () {
  // register icon component
  this.componentManager.register('FolderSingle', FolderSingle) // 图标.考虑react, svelte组件
  const cmdIdentifier = 'import-csv-button' // 这里其实是命令id
  const menuItemFactory = () => ({
    id: cmdIdentifier, // 菜单项标识 the click event command id
    title: 'Import CSV', // button text
    tooltip: 'Import CSV', // tooltip text
    icon: 'FolderSingle', // button icon name 组件管理器中名称. 图标形式
    type: MenuItemType.BUTTON, // button type 按钮类型. 提供了图标的按钮
  })
  
  this.menuManagerService.mergeMenu({
    [RibbonStartGroup.OTHERS]: { // 分组为其他 "更多菜单"
      [cmdIdentifier]: {
        order: 10, // 位置 第11个
        menuItemFactory, // 菜单项工厂(生成菜单项)
      },
    },
  })
}
// ...omit other code
```

刷新页面，可以看到工具栏中多了一个菜单按钮，但现在还不能点击，因为我们还没有定义菜单按钮的点击事件。

### 2. 注册命令来响应菜单按钮点击事件[](https://docs.univer.ai/zh-CN/guides/sheets/tutorials/csv-import-plugin#2-%E6%B3%A8%E5%86%8C%E5%91%BD%E4%BB%A4%E6%9D%A5%E5%93%8D%E5%BA%94%E8%8F%9C%E5%8D%95%E6%8C%89%E9%92%AE%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6)

在 Univer 菜单工具栏中，菜单按钮的点击会触发一个与菜单按钮 `id` 相同的命令，所以我们只需要注册同名命令即可响应菜单按钮的点击事件。

通过 [`ICommandService.registerCommand`](https://reference.univer.ai/@univerjs/core/interfaces/ICommandService#registercommand) 我们可以注册一个新命令，与 `IMenuManagerService` 同理，通过注入ID `ICommandService` 可以获取对应的对象实例，我们在插件构造函数添加如下代码：

```js
import type { IAccessor, ICommand } from '@univerjs/core'
import { CommandType, ICommandService } from "@univerjs/core";
 
// ...omit other code
constructor (
  // ...omit other code
  @Inject(ICommandService) private readonly commandService: ICommandService,
) {
  // ...omit other code
}
// ...omit other code
```

然后，我们在插件的 `onStarting` 生命周期中，注册该菜单按钮点击事件的命令，代码如下：
```ts
// ...omit other code
onStarting () {
  // ...omit other code
  const command: ICommand = {
    type: CommandType.OPERATION,
    id: cmdIdentifier,  // 识别菜单项关联的 命令id
    handler: (accessor: IAccessor) => {
      console.log('click button');   
      // todo something    
      return true;
    }
  }
  // register command handler
  this.commandService.registerCommand(command); // command是作为服务. 组件则是组件管理器
}
// ...omit other code
```

[`ICommand.handler`](https://reference.univer.ai/@univerjs/core/interfaces/ICommand#handler) 是事件处理函数，当命令被触发 *trigger* 时，该函数会被调用

>ℹ️ 函数的参数 `accessor` 是 `IAccessor` 对象，通过该对象可以访问 DI 容器中的其他对象
>    `IAccessor.get` 与 `Inject` 装饰器类似，都是依赖注入系统的一部分。

`IAccessor` 将 `Command` 与 Univer 的其他对象解耦，使组织代码可以更加灵活，提高可维护性。

刷新页面，可以看到点击按钮后，控制台输出了 `click button` 日志，说明按钮点击事件已经注册成功。

### 3. 转换 CSV 为 ICellData[](https://docs.univer.ai/zh-CN/guides/sheets/tutorials/csv-import-plugin#3-%E8%BD%AC%E6%8D%A2-csv-%E4%B8%BA-icelldata)

接下来，我们需要在点击事件中弹出文件选择框，读取用户选择的 CSV 文件，这块代码不涉 Univer，就不在本文赘述了, 可以前往 [案例介绍](https://docs.univer.ai/zh-CN/guides/sheets/tutorials/csv-import-plugin#%E6%A1%88%E4%BE%8B%E4%BB%8B%E7%BB%8D) 自行查看 `waitUserSelectCSVFile` 方法的实现源码。

我们讲下如何将 CSV 二层数组转换成 Univer 的数据结构 `ICellData` 。

[`ICellData`](https://docs.univer.ai/guides/sheets/getting-started/cell-data) 是 Univer 中的单元格数据结构，它包含了单元格的值和样式，其中值存放在 `v` 属性中，样式存放在 `s` 属性中，简化后的代码如下：
```ts
import type { ICellData } from '@univerjs/core'

function parseCSV2UniverData(csv: string[][]): ICellData[][] {
  return csv.map((row) => {
    return row.map((cell) => {
      return {
        v: cell || '',
      }
    })
  })
}
// ...omit other code
```

### 4. 设置数据到表格[](https://docs.univer.ai/zh-CN/guides/sheets/tutorials/csv-import-plugin#4-%E8%AE%BE%E7%BD%AE%E6%95%B0%E6%8D%AE%E5%88%B0%E8%A1%A8%E6%A0%BC)

将 CSV 数据设置到当前表格中，可以通过 [`ICommandService.executeCommand`](https://reference.univer.ai/@univerjs/core/interfaces/ICommandService#executecommand) 方法调用 `SetRangeValuesCommand` 命令来实现。

>ℹ️ Univer 中绝大多数的操作都注册有命令，为开发者提供统一的使用体验，方便扩展和维护。

另外，我们刚刚定义的菜单按钮点击事件，也可以被其它插件或者用户通过命令触发。

如果你想了解更多关于命令的内容，可以查看 [命令系统](https://docs.univer.ai/zh-CN/introduction/architecture/univer#command-system) 了解更多。

可以使用 `this.commandService.executeCommand` 访问 `ICommandService` 的实例对象，但为了代码的解耦，保持 Command 的独立性，这里我们还可以通过 `IAccessor.get` 来获取 `ICommandService` 的实例对象。

```ts
import { IUniverInstanceService } from '@univerjs/core'
import { SetRangeValuesCommand } from '@univerjs/sheets'
 oh Shit, java仔 名词的世界, 设计模式的殿堂
// ...omit other code
  handler: (accessor: IAccessor) => {
    // ...omit other code
    // inject univer instance service
    const univer = accessor.get(IUniverInstanceService) // DI容器中获取
    // get command service
    const commandService = accessor.get(ICommandService) // DI容器中获取命令
    // get current sheet. 通过 getUnit 即 getCurrentUnitFor(2). 返回 Workbook 对象
    const sheet = univer.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!.getActiveSheet()
 
    // wait user select csv file
    waitUserSelectCSVFile({ csv, rowsCount, colsCount }) => {
      // set sheet size
      sheet.setColumnCount(colsCount)
      sheet.setRowCount(rowsCount)
 
      // set sheet data
      commandService.executeCommand(SetRangeValuesCommand.id, {
        range: {
          startColumn: 0,  // start column index
          startRow: 0, // start row index
          endColumn: colsCount - 1, // end column index
          endRow: rowsCount - 1,  // end row index
        },
        value: parseCSV2UniverData(csv), // 解析
      });
    })
    // ...omit other code
    return true;
  }
// ...omit other code
```

至此，我们就完成了插件的开发，刷新页面，可以看到点击菜单按钮后，弹出文件选择框，选择 CSV 文件后，CSV 文件的内容就会显示在表格中。

## 总结

插件的完整代码见 [案例介绍](https://docs.univer.ai/zh-CN/guides/sheets/tutorials/csv-import-plugin#%E6%A1%88%E4%BE%8B%E4%BB%8B%E7%BB%8D)。

本插件展示了如何通过 Univer 插件系统来扩展 Univer 的 UI 和功能，希望本文可以帮助你快速上手 Univer 插件开发。

随着插件的规模增加，推荐进一步了解[模块分层](https://docs.univer.ai/zh-CN/introduction/architecture/univer#hierarchical-structure)的最佳实践。