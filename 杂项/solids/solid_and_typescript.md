typescript在 *typescript\lib\lib.dom.d.ts* 中定义了基本类型
# DOM
## DomElement
```ts
// 它告诉TS编译器，Element实体存在于运行时环境中(全局变量var), 在浏览器中，Element是内置的构造函数，用于创建和表示 HTML元素。
declare var Element: {
    prototype: Element;
    new(): Element;
};
// 这是 Element 接口 的定义。它描述了 Element 类型对象应该具有的属性和方法（如 className、id、addEventListener 等）。
interface Element extends Node, ARIAMixin, Animatable, ChildNode, NonDocumentTypeChildNode, ParentNode, Slottable {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/attributes) */
    readonly attributes: NamedNodeMap;
    readonly classList: DOMTokenList;
    className: string;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientHeight) */
    readonly clientHeight: number;    
    id: string;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/innerHTML) */
    innerHTML: string;
    readonly ownerDocument: Document;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/part) */
    readonly part: DOMTokenList;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollHeight) */
    readonly scrollHeight: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollLeft) */
    scrollLeft: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollTop) */
    scrollTop: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollWidth) */
    readonly scrollWidth: number;
    /** Returns element's shadow root, if any, if the root's mode is "open", and null otherwise.
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/shadowRoot) */
    readonly shadowRoot: ShadowRoot | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/slot) */
    slot: string;
    readonly tagName: string;
    /** Creates a shadow root for element and returns it.
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/attachShadow) */
    attachShadow(init: ShadowRootInit): ShadowRoot;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/checkVisibility) */
    checkVisibility(options?: CheckVisibilityOptions): boolean;
    /* Returns the first (starting at element) inclusive ancestor that matches selectors, and null otherwise.
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/closest) */
    closest<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
    closest<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K] | null;
    closest<K extends keyof MathMLElementTagNameMap>(selector: K): MathMLElementTagNameMap[K] | null;
    closest<E extends Element = Element>(selectors: string): E | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/computedStyleMap) */
    computedStyleMap(): StylePropertyMapReadOnly;
    /* Returns element's first attribute whose qualified name is qualifiedName, and null if there is no such attribute otherwise.
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttribute) */
    getAttribute(qualifiedName: string): string | null;
    getAttributeNames(): string[];
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttributeNode) */
    getAttributeNode(qualifiedName: string): Attr | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getBoundingClientRect) */
    getBoundingClientRect(): DOMRect;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getClientRects) */
    getClientRects(): DOMRectList;
    getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getElementsByTagName) */
    getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
    getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
    getElementsByTagName<K extends keyof MathMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
    /** @deprecated */
    getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
    getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getElementsByTagNameNS) */
    getElementsByTagNameNS(nsURI: "//www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
    getElementsByTagNameNS(nsURI: "//www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
    getElementsByTagNameNS(nsURI: "//www.w3.org/1998/Math/MathML", localName: string): HTMLCollectionOf<MathMLElement>;
    getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollectionOf<Element>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getHTML) */
    getHTML(options?: GetHTMLOptions): string;
    hasAttribute(qualifiedName: string): boolean; 
    hasAttributeNS(namespace: string | null, localName: string): boolean;   
    hasAttributes(): boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/hasPointerCapture) */
    hasPointerCapture(pointerId: number): boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentElement) */
    insertAdjacentElement(where: InsertPosition, element: Element): Element | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML) */
    insertAdjacentHTML(position: InsertPosition, string: string): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentText) */
    insertAdjacentText(where: InsertPosition, data: string): void;
    /* Returns true if matching selectors against element's root yields element, and false otherwise.
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/matches)  */
    matches(selectors: string): boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/releasePointerCapture) */
    releasePointerCapture(pointerId: number): void;
    removeAttribute(qualifiedName: string): void;
    removeAttributeNS(namespace: string | null, localName: string): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/removeAttributeNode) */
    removeAttributeNode(attr: Attr): Attr;
    requestFullscreen(options?: FullscreenOptions): Promise<void>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/requestPointerLock) */
    requestPointerLock(options?: PointerLockOptions): Promise<void>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scroll) */
    scroll(options?: ScrollToOptions): void;
    scroll(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollBy) */
    scrollBy(options?: ScrollToOptions): void;
    scrollBy(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollIntoView) */
    scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollTo) */
    scrollTo(options?: ScrollToOptions): void;
    scrollTo(x: number, y: number): void;
    setAttribute(qualifiedName: string, value: string): void;
    setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttributeNode) */
    setAttributeNode(attr: Attr): Attr | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttributeNodeNS) */
    setAttributeNodeNS(attr: Attr): Attr | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setHTMLUnsafe) */
    setHTMLUnsafe(html: string): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setPointerCapture) */
    setPointerCapture(pointerId: number): void;  
    toggleAttribute(qualifiedName: string, force?: boolean): boolean;
    webkitMatchesSelector(selectors: string): boolean;
    
    // K extends keyof ElementEventMap // ListnerFun: (this: Element, ev: ElementEventMap[K]) => any    
    addEventListener<K>(type: K, listener: ListnerFun, ops?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, ops?: boolean | AddEventListenerOptions): void;
    
    removeEventListener<K>(type: K, listener: ListnerFun, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, ops?: boolean | EventListenerOptions): void;
}
```
# Solidjs 
## Solid主要ts类型
它实现了自己的一套JSX命名空间, 包括 *HtmlElementTags*, *SVGElementTags*
### DOM 和 事件
```js
export namespace JSX{
	type Element = Node | ArrayElement | (string & {}) | number | boolean | null | undefined;
	
	interface ElementClass {}  // empty, libs can define requirements downstream	
	interface ElementAttributesProperty {} // empty, libs can define requirements downstream
	
	interface ElementChildrenAttribute { children: {}; }
    
    // 事件目标, 包含输入型和通用型
    type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;	
	
	// 事件处理, 注意这里面的 DOMElement 是重写之前的Element即内置的 typescript\lib\lib.dom.d.ts
	type ElementEventWithTarget<E extends Event, T extend DOMElement=default> = E &{ currentTarget: Target; target: DOMElement})
	
	interface EventHandler<Target, E extends Event> {
		(e: ElementEventWithTarget<E, Target>): void// 通用dom事件, DOMElement 是 ts内置的 Element
	}
	interface BoundEventHandler<T extends DOMElement, E extends Event> {
	    0: (data: any, e: ElementEventWithTarget<E, T>) => void; 
	    1: any; // params or params wrapper
	}
	type EventHandlerUnion<T extends DOMElement, E extends Event> = EventHandler<T, E> | BoundEventHandler<T, E>;

	// 输入类型事件处理. 注意这里面没有特别指出是哪种事件类型	
	type EventWithInputTarget<E extends Event, T> = ElementEventWithTarget<E, T extends InputElement? T: DOMElement>
	
	interface InputEventHandler<T, E extends InputEvent/builtin> { 
		(e: EventWithInputTarget<T, E>): void; // 输入元素事件 InputEvent是ts内置的InputEvent
	}
  
	interface BoundInputEventHandler<T, E extends InputEvent> {  
	    0: (data: any, e: EventWithInputTarget<E, T>) => void;
	    1: any;  
	}  
	type InputEventHandlerUnion<T, E extends InputEvent> = InputEventHandler<T, E> | BoundInputEventHandler<T, E>;

	// 输入或选项型, change, focus
	interface [Focus/Change]EventHandler<T, E extends Event> {
	    (e: EventWithInputTarget<T, E>): void;
    }
	
	interface Bound[Focus/Change]EventHandler<T, E extends Event> {
	    0: (data: any, e: EventWithInputTarget<T, E>) => void;
	    1: any;
	}
	type [Focus/Change]EventHandlerUnion<T, E> = [Focus/Change]EventHandler<T, E> | Bound[Focus/Change]EventHandler<T, E>;
	
	interface HTMLElementTags {
		a: AnchorHTMLAttributes<HTMLAnchorElement>;
	    abbr: HTMLAttributes<HTMLElement>;
	    address: HTMLAttributes<HTMLElement>;
	    area: AreaHTMLAttributes<HTMLAreaElement>;
	    article: HTMLAttributes<HTMLElement>;
	    aside: HTMLAttributes<HTMLElement>;
	}
}
```
### 其他的定义
```typescript
const SERIALIZABLE: unique symbol;
interface SerializableAttributeValue {
	toString(): string;
    [SERIALIZABLE]: never;
}

interface IntrinsicAttributes {
	ref?: unknown | ((e: unknown) => void);
}
interface CustomAttributes<T> {
    ref?: T | ((el: T) => void);
    classList?: {
      [k: string]: boolean | undefined;
    };
    $ServerOnly?: boolean;
}
// Directive 指令
type Accessor<T> = () => T; // 通常用于表示响应式信号的 getter
interface Directives {}
interface DirectiveFunctions {
    [x: string]: (el: DOMElement, accessor: Accessor<any>) => void;
}
//占位符接口. 提供了扩展 SolidJS JSX 类型定义的机制。可通过declaration merging向其添加属性，来定义自定义指令、属性、特性和事件
interface ExplicitProperties {}
interface ExplicitAttributes {}
interface CustomEvents {}
interface CustomCaptureEvents {}

type UseKey<Key> = `use:${Key}`;   // 用于指令 (directives)
type PropKey<Key> = `prop:${Key}`; // 用于显式属性 (explicit properties)
type AttrKey<Key> = `attr:${Key}`; // 用于显式特性 (explicit attributes)
type OnKey<Key> = `on:${Key}`;     // 用于事件 (event handlers)
type OnCaptureKey<Key> = `oncapture:${Key}`; // 用于捕获阶段的事件 (capture event handlers)

// 映射类型 (Mapped Types) 和条件类型 (Conditional Types)
// 若你通过`声明合并`向Directives接口添加了属性，那么 DirectiveAttributes类型就会包含这些属性，且键名会带有use: 前缀。见附录示例
type DirectiveAttributes = {
    // 这允许你在 JSX 中这样使用指令：<div use:myDirective={true} />
	[Key in keyof Directives as UseKey<Key>]?: Directives[Key];
};
/*
这个的作用是, 限制use:指令绑定的必须是一个函数. 并且函数的第一个参数是绑定的元素, 函数接受的第二个参数类型必须是Accessor<T>类型, 如果没有传入第二个参数, 则类型为true (因为没有传入Accessor, 视为不需要响应式更新, 只需要运行一次.)    
*/
type DirectiveFunctionAttributes<T> = {
	[K in keyof DirectiveFunctions as string extends K ? never : UseKey<K>]?: DirectiveFunctions[K] extends (
		el: infer E, // will be unknown if not provided
		...rest: infer R // use rest so that we can check whether it's provided or not
	) => void
	? T extends E // everything extends unknown if E is unknown
		? R extends [infer A] // check if has accessor provided
			? A extends Accessor<infer V>
				? V // it's an accessor
				: never // it isn't, type error
			: true // no accessor provided
		: never // T is the wrong element
	: never; // it isn't a function
};
// PropAttributes、AttrAttributes、OnAttributes<T>、OnCaptureAttributes<T>类型定义结构与 DirectiveAttributes 类似，只是它们分别处理显式属性、显式特性和事件。OnAttributes 和 OnCaptureAttributes 还使用了 EventHandler 类型来表示事件处理函数。
type PropAttributes = {
    [Key in keyof ExplicitProperties as PropKey<Key>]?: ExplicitProperties[Key];
};
type AttrAttributes = {
	[Key in keyof ExplicitAttributes as AttrKey<Key>]?: ExplicitAttributes[Key];
};
type OnAttributes<T> = {
	[Key in keyof CustomEvents as OnKey<Key>]?: EventHandler<T, CustomEvents[Key]>;
};
type OnCaptureAttributes<T> = {
    [Key in keyof CustomCaptureEvents as OnCaptureKey<Key>]?: EventHandler<T, CustomCaptureEvents[Key]>;
};
```

```js
// string & {} 扩展了 string, 限制比 {} 和 string 都多, 是两者的结合. 字符串是合法的组件, 非空类型也是, div 也是 组件也是
export type ValidComponent = keyof JSX.IntrinsicElements | Component<any> | (string & {});
export namespace JSX{
	interface IntrinsicElements extends HTMLElementTags, HTMLElementDeprecatedTags, SVGElementTags {}
} 
```

```js
type ElementOf<T> = T extends HTMLElement
	? T
	: T extends keyof HTMLElementTagNameMap // ts 内置所有的html tag 类型
		? HTMLElementTagNameMap[T]
		: any; // 这里面不是递归, 也不是never
```

## Solid Utils
关于 splitProps 和 mergeProps 见*packages\solid\src\server\rendering.ts* 前端 *packages\solid\src\render\component.ts*
测试代码见 *packages\solid\test\component.spec.ts*
### mergeProps

### splitProps

# 附录
## typescript 精通
这段 `DirectiveFunctionAttributes<T>` 的 TypeScript 代码确实展示了一些高级的类型技巧。 让我们拆解其中用到的技巧：

**1. *映射*类型 (Mapped Types):**

*   **基础语法:** `[K in keyof SomeType]`
*   **作用:** 遍历 `SomeType` 类型的所有键（key），并将每个键赋值给类型变量 `K`。
*   **在此处的使用:** `[K in keyof DirectiveFunctions ...]` 遍历 `DirectiveFunctions` 接口的所有键。

**2. *键名重映射* (Key *Remapping* via *as*):**

*   **基础语法: *[K in keyof SomeType as NewKeyType]**
*   **作用:** 在映射类型中，可以使用 `as` 子句将原来的键名 `K` 映射到一个新的键名类型 `NewKeyType`。
*   **在此处的使用:** `[K in keyof DirectiveFunctions as string extends K ? never : UseKey<K>]`
    *   `string extends K ? never : UseKey<K>` 这部分是一个条件类型。K 在运行时的类型, 如果推断出是字符串, 那么不允许
        *   `string extends K`: 检查 `K` 是否是string的超类(>=) 类型。这实际上是在检查 `K` 是否是一个字面量类型（如 `'myDirective'`）还是一个更宽泛的类型（如 `string`）。如果 `K` 是 `string` 类型，这意味着 `DirectiveFunctions` 接口可能使用了字符串索引签名（如 `[x: string]: ...`），这不是我们想要的。
        *   `never`: 如果 `K` 是 `string` 类型，则将键名映射到 `never` 类型。`never` 类型表示一个永远不会有值的类型，这实际上会从结果类型中排除这个键。
        *   `UseKey<K>`: 如果 `K` 不是 `string` 类型（而是一个字面量类型），则使用 `UseKey<K>` 将其转换为 `use:` 前缀的形式。

**3. 条件类型 (Conditional Types):**

*   **基础语法:** `SomeType extends OtherType ? TrueType : FalseType`
*   **作用:** 类似于 JavaScript 中的三元运算符，根据 `SomeType` 是否可赋值给 `OtherType` 来决定返回 `TrueType` 还是 `FalseType`。
*   **在此处的使用:**
    *   `string extends K ? never : UseKey<K]` (上面已解释)
    *   `DirectiveFunctions[K] extends (el: infer E, ...rest: infer R) => void ? ... : never`: 检查 `DirectiveFunctions[K]`（即指令函数的类型）是否是一个函数类型，并且这个函数接受至少一个参数（`el`），并且可能有剩余参数（`...rest`）。如果不是函数类型，则整个类型解析为 `never`。
    *   `T extends E ? ... : never`: 检查泛型参数 `T`（代表 JSX 标签的类型，如 `HTMLDivElement`）是否可以赋值给指令函数的第一个参数的类型 `E`。这确保了指令函数可以用在正确的 HTML 元素上。
    *    `R extends [infer A] ? ... : true`: 检查指令函数是否有第二个参数. 因为使用了`...rest`, 所以第二个参数成为一个数组, 如果有, 那么提取数组的元素类型为`A`
    *   `A extends Accessor<infer V> ? V : never`: 检查第二个参数 `A` 是否是 `Accessor` 类型。如果是，则提取 `Accessor` 中的值类型 `V`；否则，类型解析为 `never`。

**4. 类型推断 (Type Inference in Conditional Types) - `infer`:**

*   **基础语法:** `SomeType extends GenericType<infer U> ? ... : ...`
*   **作用:** 在条件类型中，可以使用 `infer` 关键字声明一个类型变量（如 `U`），TypeScript 编译器会尝试推断出 `U` 的具体类型。
*   **在此处的使用:**
    *   `el: infer E`: 推断指令函数的第一个参数的类型，并将其赋值给类型变量 `E`。
    *   `...rest: infer R`: 推断指令函数剩余参数的类型，并将其赋值给类型变量 `R`。
    *   `R extends [infer A]`: 检查 `R`是否为数组, 并且推断数组内元素的类型, 赋值给`A`
    *   `Accessor<infer V>`: 推断 `Accessor` 类型中的值类型，并将其赋值给类型变量 `V`。

**5. 泛型 (Generics):**

*    **`DirectiveFunctionAttributes<T>`:** 这里的 `<T>` 定义了一个泛型参数。泛型允许你编写可以适用于多种类型的代码，而无需为每种类型都写一份单独的代码。在此处，`T` 代表使用指令的 JSX 元素的类型（例如, `HTMLDivElement`, `HTMLButtonElement`等）。

**代码逻辑总结 (用更通俗的语言):**
这个复杂的类型定义 `DirectiveFunctionAttributes<T>` 做了以下几件事情：

1.  **遍历 `DirectiveFunctions` 接口:** 找出所有已定义的指令函数。
2.  **确保键名格式正确:** 只处理那些键名是字面量类型（如 `'myDirective'`）的指令，忽略那些使用字符串索引签名（如 `[x: string]: ...`）的指令, 并将键名加上 `use:` 前缀。
3.  **检查指令函数类型:**
    *   确保它是一个函数。
    *   确保它的第一个参数的类型与 JSX 元素的类型 `T` 兼容。
    *   检查它是否接受第二个参数 (可选的 `Accessor`)
    *   如果接受第二个参数, 确保第二个参数是 `Accessor` 类型，并提取 `Accessor` 中的值类型。
    *   如果不接受第二个参数, 类型解析为 `true`.
4. **返回结果类型:** 将所有符合条件的指令函数及其类型，以 `use:` 前缀的形式，组合成一个新的类型。

这段代码充分展示了 TypeScript 类型系统的强大功能，通过这些技巧，可以在编译时对 JSX 中的指令使用进行严格的类型检查，确保代码的正确性和可维护性。


这段代码充分展示了 TypeScript 类型系统的强大功能，通过这些技巧，可以在编译时对 JSX 中的指令使用进行严格的类型检查，确保代码的正确性和可维护性。
## 扩展solidjs的指令示例
```ts
// 用户代码
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      myDirective: boolean; // 添加自定义指令
    }
  }
}
// 经过 DirectiveAttributes 处理后，相当于：
type DirectiveAttributes = {
   'use:myDirective'?: boolean;
}
```