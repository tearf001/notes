# 基本知识
```js
const imageData = canvas.getContext('2d').getImageData(0, 0, 32, 32);
```
从一个 2D 渲染上下文中获取一个 32x32 像素矩形区域的图像数据。  `getImageData()` 方法返回一个 `ImageData` 对象。

下面详细解释 `ImageData` 对象及其包含的数据：

**1. `ImageData` 对象**

`ImageData` 对象代表一个矩形区域内像素的原始数据。它有三个只读属性：

*   **`width`**:  图像数据的宽度（以像素为单位）。在这个例子中，`width` 是 32。
*   **`height`**: 图像数据的高度（以像素为单位）。在这个例子中，`height` 是 32。
*   **`data`**:  一个 `Uint8ClampedArray` 类型的一维数组，包含了图像的像素数据。  **这是最关键的部分**。

**2. `Uint8ClampedArray` (imageData.data)**
`imageData.data` 是一个非常重要的属性，它存储了所有像素的颜色信息。  数组中的每个元素都是一个 8 位无符号整数。"Clamped" 意味着如果尝试将值设置到这个范围之外，它会被***钳制***到 0~ 255整型。

*  **一维数组**:  尽管图像是二维的 (32x32)，但 `data` 数组是一维的。  像素数据是按行优先的顺序存储的。
* **像素总数和数组长度**
	*   像素总数：$width * height$ 个像素。
	*   `data` 数组长度：$width * height * 4$。
* **RGBA 值**:  每个像素由四个值表示：
    *   **R (Red)**:  红色通道值 (0-255)。
    *   **G (Green)**: 绿色通道值 (0-255)。
    *   **B (Blue)**:  蓝色通道值 (0-255)。
    *   **A (Alpha)**:  Alpha 通道值 (0-255)，表示透明度 (0 是完全透明，255 是完全不透明)。
* **排列规则**
    ```ruby
    [
      R1, G1, B1, A1, # 第一个像素 坐标(0, 0) 0, 1, 2, 3
      R2, G2, B2, A2, # 第二个像素 坐标(1, 0) 4, 5, 6, 7
      R3, G3, B3, A3, # 第三个像素 坐标(2, 0) 8, 9, 10, 11
      ...
      Rn, Gn, Bn, An  # 最后一个像素 坐标(31, 31) 1024*4-4, 1024*4-3, 1024*4-2 ,1024*4-1
    ]
    ```
$$其中 R1, G1, B1, A1 是第一个像素,左上角，坐标 (0, 0),的RGBA值。  R2, G2, B2, A2 是第二个像素,坐标(1, 0),的值，依此类推 $$

**3. 如何访问特定像素的颜色值**

要访问特定像素 (x, y) 的颜色值，你需要计算它在 `data` 数组中的偏移量：

```javascript
function getPixel(imageData, x, y) {
  const width = imageData.width; // 数据的模
  const offset = (y * width + x) * 4; // 每个像素 4 个值 (RGBA)

  return {
    r: imageData.data[offset],
    g: imageData.data[offset + 1],
    b: imageData.data[offset + 2],
    a: imageData.data[offset + 3],
  };
}

// 示例：获取像素 (5, 10) 的颜色值. 原点(0,0)
const pixel = getPixel(imageData, 5, 10); // 输出: { r: 0~255, g: 0~255, b: 0~255, a: 0~255}

// 示例：将像素 (2,3) 设置为红色 (255, 0, 0, 255)
function setPixel(imageData, x, y, {r, g, b, a}) {
    const width = imageData.width;
    const offset = (y * width + x) * 4;
    imageData.data[offset] = r;
    imageData.data[offset + 1] = g;
    imageData.data[offset + 2] = b;
    imageData.data[offset + 3] = a;
}
setPixel(imageData, 2, 3, {r:255, g:0, b:0, a:255});
```
# 浏览器的 frame

`requestAnimationFrame` 的行为与浏览器的渲染机制密切相关。 你说得对，它通常的目标是 60 FPS，但这受到多种因素的影响。

**1. 浏览器渲染流程**

理解 `requestAnimationFrame` 如何工作，需要先了解浏览器渲染一个页面的大致流程（简化版）：

   a. **构建 *DOM*** 文档对象模型树,       by **解析 *HTML*:**  浏览器解析 HTML 代码。
   b. **构建** ***CSSOM*** CSS 对象模型树  by **解析 *CSS*:**  解析 CSS 代码。
   c. **构建*渲染树* (Render Tree):**       by **结合** DOM 树和 CSSOM 树。渲染树**只包含**需要显示的***节点***以及它们的***样式***信息。
   d. **布局 (*Layout*/*Reflow*):**             by **计算**渲染树中每个节点在屏幕上的***确切位置和大小***。
   e. **绘制 (*Paint*):**                              by 将渲染树中的每个节点**转换**为屏幕上的**实际*像素***。这包括绘制文本、颜色、边框、阴影、图像等。
   f. **合成 (Composite):**                     by 将绘制好的各个层（***Layer***）按照正确的顺序合并起来，形成最终的页面图像，并显示在屏幕上。

**2. `requestAnimationFrame` 的作用**

`requestAnimationFrame` 的作用是告诉浏览器：“在下一次重绘 *之前*，请调用我指定的这个回调函数。”  这有几个关键的好处：

*   **与浏览器的刷新率同步：** 浏览器会*尽量*在每次frame刷新时执行 `requestAnimationFrame` 的回调。使得动画与frame保持周期同步，从而平滑。
*   **优化性能：**
    *  **当标签页不可见时，浏览器会暂停 `requestAnimationFrame` 回调的执行。** 因为用户看不到的动画没有必要运行。
    *  浏览器可以对多个 `requestAnimationFrame` 回调进行合并和优化，减少不必要的计算和重绘。
    *  浏览器会尽量避免在布局和绘制阶段之间执行回调，因为这可能导致强制同步布局（forced synchronous layout），严重影响性能。
*  **避免不必要的重绘：** 如果你在一个 `requestAnimationFrame` 回调中修改了 DOM，浏览器会在下一次***重绘***时一次性处理这些修改。  
*  如果你不使用 `requestAnimationFrame`，而是直接在短时间内多次修改 DOM，可能会导致浏览器进行多次不必要的重绘，降低性能。

**3. 影响 `requestAnimationFrame` 频率的因素**
*   **屏幕刷新率：** 大多数显示器的刷新率是 60 Hz，但 `requestAnimationFrame` 会尝试与显示器的***实际***刷新率同步。
*   **系统负载：** 如果 CPU 或 GPU 负载过高，浏览器可能无法及时完成每一帧的渲染，导致帧率下降（掉帧）。
*   **浏览器优化：** 浏览器会尽力优化 `requestAnimationFrame` 的执行，但具体的实现细节可能会因浏览器而异。
*   **代码复杂性：** 如果 `requestAnimationFrame` 回调函数中的代码执行时间过长（比如超过16.67毫秒），那么浏览器就无法达到平滑的目标。
*   **节流（Throttling）：** 浏览器可能会对 `requestAnimationFrame` 进行节流，降低其触发频率。 例如，当标签页处于后台时，或者电量不足时。
*   **硬件加速** 如果动画可以利用GPU加速（通过CSS transforms、opacity 等），那么通常可以获得更流畅的性能和更高的帧率。

**4. 如何监测和优化动画性能**

*   **浏览器开发者工具：** 现代浏览器提供开发者工具(如DevTools/Performance). 可以看到每一帧的耗时、布局和绘制的次数、JavaScript 执行时间等。
*   **`performance.now()`:**  可以使用 `performance.now()` 来测量代码块的执行时间，帮助你找到耗时的操作。
*    **避免强制同步布局（Forced Synchronous Layout）**
   * 尽量在一次 `requestAnimationFrame` 回调中批量修改DOM属性。避免在循环中交替读取和修改DOM属性。
   * 如果要获取元素的布局信息（如 `offsetWidth`, `offsetTop` 等），尽量先读取所有需要的值，然后再进行统一的修改。

# canvas动画
#创建平滑、高效动画循环的常见且推荐的技巧
```js
	import { paint } from './gradient.js';
	
	let canvas; // binded when mount like svelte( bind:this={canvas} ) then its constant
	$effect(() => { // 实际上只执行1次
		const context = canvas.getContext('2d');
		let frame = requestAnimationFrame(function loop(t) {
			frame = requestAnimationFrame(loop);
			paint(context, t); // 随事件变化, 色彩刷canvas 2d 区域的像素色
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	});
```

- **requestAnimationFrame(callback):** 这是一个浏览器 API，用于优化动画。它告诉浏览器你希望执行动画，并请求浏览器在***下一次重绘之前***调用指定的 callback 函数。 callback 函数会接收一个参数 t，表示当前的时间戳（***DOMHighResTimeStamp***）。
    
- **loop(t) 函数:** 这是一个递归函数。
    
    - frame = requestAnimationFrame(loop); 在 loop 函数内部，再次作为回调函数, 请求执行动画 requestAnimationFrame(loop)。这确保了 loop 函数会在每一帧都被调用，从而创建动画循环。frame 这里可以不需要, 但是只是追踪***请求AnimationFrame***手柄, 用于**绘制canvas**.
        
    - paint(context, t);: 调用 paint 函数，传入上下文和时间戳，在 Canvas 上绘制当前帧。
        
    - let frame = ...: requestAnimationFrame 会返回一个整数 ID，表示这个动画帧的请求。这个 ID 可以用来取消动画帧（见下文）。将返回值赋给 frame 变量，用于后续取消动画。
        
- **递归赋值 frame：** 是的，frame = requestAnimationFrame(loop) 看起来是递归赋值，但这正是创建平滑、高效动画循环的常见且推荐的技巧。
    
    - 每次 loop 函数运行时，它都会调度 下一次 loop 函数的执行。        
    - frame 变量始终保存着 最新 的 requestAnimationFrame 请求 ID。        
    - 这样做的好处是，如果需要停止动画，你只需要调用 cancelAnimationFrame(frame) 一次，就可以取消 最后一次 安排的帧，从而有效地停止整个循环。 如果你不保存 frame 的最新值，你可能会取消一个***已经执行过的帧*，或者无法正确*停止循环***。
    