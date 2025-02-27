
`<image>`数据类型描述的是 2D 图形。在 CSS 中有两种类型的图像：
- 简单的静态图像，经常被一个在使用的 URL 引用
- 动态生成的图像，比如 DOM 树的部分元素样式渐变或者计算样式产生。

# CSS 图像类型：

- 具有***固有尺寸***（大小）的图像，即图像具有自己的原始尺寸（大小），比如一个 jpeg 格式的图像有他自己的固有尺寸
- 图像具有***多个***固定尺寸，可在一个文件中存在多个不同版本的*尺寸* 比如有些.ico 格式的图像。
	在这种情况下，图像表现出来的固有尺寸将是这些***尺寸较大***的一个，也就是最接近*外层包含它的容器纵横比*的那个图像；
- 没有固定大小, 但有***固定纵横比***的图像，像一些***矢量图形***，比如 SVG 格式的图像
- 没有固定大小, 也没有固定宽高比的图像，比如 CSS ***渐变***(图像)


# CSS 确定图像实际尺寸依据
1. 图像的原始尺寸；
2. 用 CSS 属性指定的宽和高，比如[`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width), [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height) or [`background-size`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)中
3. 图像对象默认大小，由图像使用用途的属性类型决定

| 图像***对象类型***                                                                                                                                                                                                                            | 默认的图像对象尺寸                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| [`background-image`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-image)                                                                                                                                                 | DOM 元素的***背景定位***的范围尺寸（大小） |
| [`list-style-image`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style-image)                                                                                                                                                 | 字符的 `1em` 尺寸（大小）           |
| [`border-image`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-image)                                                                                                                                                         | DOM 元素的***边框图像范围***尺寸（大小）  |
| [`cursor`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)                                                                                                                                                                     | 浏览器定义的光标尺寸匹配在使用OS常规的光标尺寸   |
| 用 CSS [`content`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content)属性，伪元素 [`::after`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::after) 和 [`::before`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::before)替换元素内容 | 一个 `300px × 150px` 矩形      |
**几个关键概念：**

- ***specified* size:** 指定的尺寸（通常指通过 CSS 的 width 或 height 属性设置的尺寸）
- ***intrinsic* ratio:** 内在比例 (指的是元素本身固有的宽高比，例如图片的原始宽高比)。
- ***intrinsic* dimensions:** 内在尺寸 (指的是元素本身固有的宽度和高度，例如图片的原始宽度和高度)。
- ***default* object size:** 默认对象尺寸 (若无法由***内在比例***或***内在尺寸***确定，则由渲染引擎决定。如替换元素若未设置width和height，默认的 300x150
# 图像对象的实际尺寸计算算法

- 如果宽度和高度都被指定了，则使用这些值会作为图像对象实际尺寸(***concrete*** object size)；
- 如果指定的尺寸仅定义了宽度或仅定义了高度，则缺失的值将通过以下方式确定：使用内在比例(如有)；如果指定值与内在尺寸匹配(相同)，则使用内在尺寸；否则使用该缺失值的***默认对象尺寸***；
- 如果指定的尺寸既没有定义宽度也没有定义高度，则计算出的具体对象尺寸将满足以下条件：它会匹配图像的内在纵横比（宽高比），但不会在任何维度上超过默认对象尺寸。如果图像没有内在纵横比，则使用它所***应用到***对象(it applies to)的内在纵横比；如果该对象也没有内在纵横比，则缺失的宽度或高度将从默***认对象尺寸***中获取。