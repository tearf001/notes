依赖于
[[core]]
[[design]]
[[ui]]

[[engine-render]]
[[engine-numfmt]]
[[engine-formula]]

[[sheets]]
[[sheets-ui]]
[[sheets-numfmt]]

#icons

```c
dependencies:
@univerjs/core: 0.6.9           @univerjs/engine-render: 0.6.9  @univerjs/sheets: 0.6.9
@univerjs/design: 0.6.9         @univerjs/icons: ^0.2.31        @univerjs/ui: 0.6.9
@univerjs/engine-formula: 0.6.9 @univerjs/sheets-numfmt: 0.6.9
@univerjs/engine-numfmt: 0.6.9  @univerjs/sheets-ui: 0.6.9
```


Providing editing/rendering capabilities around `number format`, such as edit panels, toolbar buttons, real-time previews, row/column variations, etc.

> [!NOTE] Numerical format is one of the core functions of electronic spreadsheets, and therefore, parsing and handling of numerical format is done within `@univerjs/sheets`.