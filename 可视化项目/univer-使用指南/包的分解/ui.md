依赖于 [[core]] [[engine-render]] [[design]] 
pnpm 依赖
```js
pnpm show @univerjs/ui 
// dependencies:
@univerjs/core: 0.6.9          @univerjs/icons: ^0.2.31       rc-notification: ^5.6.2
@univerjs/design: 0.6.9        @wendellhu/redi: 0.17.1
@univerjs/engine-render: 0.6.9 localforage: ^1.10.0
```

@univerjs/ui 提供了一些配置项，可用于基础布局的配置。
```js
univer.registerPlugin(UniverUIPlugin, {
  container?: string | HTMLElement; 
  header?: boolean;
  toolbar?: boolean;
  footer?: boolean;
  contextMenu?: boolean;
 
  disableAutoFocus?: true;
  override?: DependencyOverride;
  menu?: MenuConfig;
});
```

- `container` - 容器元素，可以是字符串或者 DOM 元素。
- `header` - 是否显示头部。
- `toolbar` - 是否显示头部工具栏。 0.2.0+
- `footer` - 是否显示底部。
- `contextMenu` - 是否显示右键菜单。
- `disableAutoFocus` - 是否禁用自动聚焦。
- `override` - 依赖注入的覆盖配置。
- `menu` - 菜单配置，详见[定制菜单项（隐藏菜单项）](https://docs.univer.ai/zh-CN/guides/sheets/advanced/custom-ui#customizing-menu-items-hiding-menu-items)

## Univer on Node.js 手动组合安装
```ts
pnpm add @univerjs/core @univerjs/design @univerjs/engine-render @univerjs/engine-formula @univerjs/docs @univerjs/sheets @univerjs/sheets-formula @univerjs/sheets-numfmt
```