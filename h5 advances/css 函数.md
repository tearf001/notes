# 渐变
**`radial-gradient()`** [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) [函数](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Values_and_Units/CSS_Value_Functions)创建一个图像，该图像由从***原点辐射***的两种或多种颜色之间的*渐进过渡*组成，其形状可以是圆形或椭圆形。
函数的结果是 #gradient

## gradient
**`<gradient>`** [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) [数据类型](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Values_and_Units/CSS_data_types) 是 [`<image>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/image) 的一种特殊类型，包含两种或多种颜色的过渡转变。

CSS 渐变[没有内在尺寸](https://developer.mozilla.org/zh-CN/docs/Web/CSS/image#%E6%8F%8F%E8%BF%B0)，也就是说，它没有固有或首选的尺寸，也没有首选的比例，其实际大小取决于所应用的元素的大小。
```css
background: linear-gradient([direction], #f69d3c[ at], ..[tween].., #3f87a6[ at]); // 上右下左
background: radial-gradient(#f69d3c[ at], ..[tween].., #3f87a6[ at]); // 中心辐射 
background: repeating-linear-gradient(red, #3f87a6 50px); // 在方向(未提供默认)重复， 给定进尺,没有平分
background: repeating-radial-gradient(#f69d3c, #3f87a6 50px); //重复 中心辐射  给定进尺
background: conic-gradient(#f69d3c, #3f87a6); // 圆锥梯度
```

## 线性渐变
```css
selector{
	background: linear-gradient(
	    to right, // 方向 默认 上->下
	    red,
	    orange,
	    yellow,
	    green,
	    blue,
	    indigo,
	    violet
  );
}
```
# CSS 基本数据类型

**CSS** 基本数据类型是一种[组合值类型](https://www.w3.org/TR/css3-values/#component-types)。用于定义 CSS 属性和函数可以接受的变量（关键字和单位）的种类。

数据类型由放置在不等式符号 "<" 和 ">" 之间的关键字表示：

## [参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Values_and_Units/CSS_data_types#%E5%8F%82%E8%80%83)

- [`<angle>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/angle) 
	表示以度（degrees）百分度（gradians 100=90deg）弧度（radians）或圈数（turns）表示的角度值。例如，它在 [`<gradient>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient) 和 [`transform`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform) 
- [`<basic-shape>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape)  
    数据类型用于创建形状，包括[容器 inset](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape#%E9%80%9A%E8%BF%87%E5%AE%B9%E5%99%A8_inset_%E5%AE%9A%E4%B9%89%E7%9F%A9%E5%BD%A2%E7%9A%84%E8%AF%AD%E6%B3%95)、通过[坐标距离](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape#%E9%80%9A%E8%BF%87%E8%B7%9D%E7%A6%BB%E5%AE%9A%E4%B9%89%E7%9F%A9%E5%BD%A2%E7%9A%84%E8%AF%AD%E6%B3%95)，或通过[设定尺寸](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape#%E5%85%B7%E6%9C%89%E5%B0%BA%E5%AF%B8%E7%9A%84%E7%9F%A9%E5%BD%A2%E8%AF%AD%E6%B3%95)、[圆形](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape#%E5%9C%86%E5%BD%A2%E8%AF%AD%E6%B3%95)、[椭圆形](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape#%E6%A4%AD%E5%9C%86%E5%BD%A2%E8%AF%AD%E6%B3%95)、[多边形](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape#%E5%A4%9A%E8%BE%B9%E5%BD%A2%E8%AF%AD%E6%B3%95)、[路径](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape#%E8%B7%AF%E5%BE%84%E8%AF%AD%E6%B3%95)以及[自定义](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape#%E5%BD%A2%E7%8A%B6%E8%AF%AD%E6%B3%95)
- [`<blend-mode>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/blend-mode)
     normal multiply screen overlay darken lighten color-dodge color-burn hard-light soft-light ifference exclusion hue saturation color luminosity
- [`<color>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value)
- [`<custom-ident>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/custom-ident)          用户自定义字符串标识符, 区分大小写，值不能有任何歧义
- [`<filter-function>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter-function)    代表可以改变输入图像外观的图形效果。它可以用于[`filter`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter) 和 [`backdrop-filter`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/backdrop-filter) 属性。
- [`<flex>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex_value)                         1fr   使用整型  2.5fr  使用浮点 
- [`<frequency>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/frequency)               频率维度，例如语音的音高。目前它未在任何 CSS 属性中被使用
- [`<gradient>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient)                 是`<image>`特殊类型，包含两种或多种颜色的过渡转变。
- [`<image>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/image)
	   数据类型描述的是 2D 图形。在 CSS 中有两种类型的图像：简单的静态图像，经常被一个在使用的 URL 引用，动态生成的图像，比如 DOM 树的部分元素样式渐变或者计算样式产生。
- [`<integer>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/integer)  整型
- [`<length>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length)   长度
- [`<number>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/number)   数字
- [`<percentage>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/percentage)  百分比
- [`<position>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position_value)  位置
- [`<ratio>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/ratio) 比例 1/3 95%
- [`<resolution>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/resolution)
- [`<shape-box>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/shape-box)
- [`<single-transition-timing-function>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/single-transition-timing-function)
- [`<string>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/string)
- [`<time>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/time)
- [`<transform-function>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function)
- [`<url>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/url_value)