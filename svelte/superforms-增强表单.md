# 疑问和实现
## dataType为***json***
在 SvelteKit 中使用 sveltekit-superforms 并将 dataType 设置为 'json' 时? 

它能够让表单数据以 JSON 格式提交，而不是浏览器默认的 application/x-www-form-urlencoded 或 multipart/form-data 格式。
这种行为修改并不是直接改变浏览器的默认行为，而是通过客户端脚本（特别是 use:enhance 动作）***接管表单提交***过程，并在 JavaScript 中将数据转换为 JSON 格式发送给服务器。下面我会详细解释它的工作原理。(传统开发中, html中的原始form支持吗, 它有哪些enctype?已回答. 原始不支持, 需要手工处理)

这依赖于客户端 JavaScript。如果禁用 JavaScript，表单会***退回到默认***行为（FormData 提交）

- preventDefault
- 自定义fetch
- 请求的 Content-Type 通常仍为 multipart/form-data, 但是做特别处理, 服务端反向处理
     chunked: `__superform_json`  | `__superform_file_` | `__superform_files_`
- 服务端解析
  服务端接收到的数据（无 superValidate）, 需要特别处理 `__superform**`
 ```js 
 __superform_json: '{"name":"John", ....'
 __superform_json: '"age":30}'
 __superform_file_avatar: <File object>
 ```
 你需要手动合并分块并调用 JSON.parse。文件（如果有）以单独的键存储。

核心代码
```js
if (options.dataType === 'json') {
  const postData = clone(jsonData ?? validation.data); // 从 $form 获取数据
  const submitData = new FormData(); // 创建 FormData 用于传输

  // 处理文件
  traversePaths(postData, (data) => {
    if (data.value instanceof File) {
      const key = '__superform_file_' + mergePath(data.path);
      submitData.append(key, data.value);
      return data.set(undefined);
    }
  });

  // 将 JSON 数据分块并存入 FormData
  const chunks = chunkSubstr(stringify(postData), options.jsonChunkSize ?? 500000);
  for (const chunk of chunks) {
    submitData.append('__superform_json', chunk);
  }

// 发送请求
fetch(submitParams.action/path/to/backend, { method: 'POST', body: submitData }); // formdata
```


## 与 SPA 的 AJAX 对比

在传统的 SPA（单页应用）中，AJAX 直接发送 JSON（Content-Type: application/json），而 Superforms 仍使用 FormData 作为载体。这是为了兼容 SvelteKit 的 actions 机制（基于 `<form>` 和 FormData），同时支持文件上传和嵌套数据。


## AJAX 模式和“Full Page”
这里的“full page”模式，通常指的是传统的表单提交导致页面刷新（SvelteKit 中称为**“非增强表单提交”**或**“全页刷新”**）。让我们对比这两种模式：
###  AJAX 模式使用 fetch

- **定义**：通过 JavaScript（如 fetch 或 XMLHttpRequest）发起异步请求，不刷新页面。
- **特点**：
    - 完全由客户端控制，可以自定义请求头（如 Content-Type: application/json）、请求体等。
    - 不依赖 `<form>` 的原生提交机制。
    - 响应通常由 ***JavaScript 处理***，更新 DOM 或状态。
- **Superforms 中的实现**：
    - 使用 use:enhance ***拦截***表单提交。
    - 将数据封装为 FormData（含 JSON），通过 fetch 发送。
    - 不触发页面刷新，客户端***保持控制***。

### Full Page 模式（全页刷新）

- **定义**：浏览器原生的 `<form>` 提交，导致页面刷新或导航到新页面。
- **特点**：
    - 数据由浏览器自动序列化为 application/x-www-form-urlencoded 或 multipart/form-data。
    - 请求头和格式受限于 HTML 表单的 enctype 和 method。(text/plain, application/x-www-form-urlencoded 或 multipart/form-data)
    - 服务端处理后返回新页面或重定向，客户端***无法直接控制***响应。
- **SvelteKit 中的默认行为**：
    - 如果不使用 use:enhance，SvelteKit 会让表单提交触发全页刷新。
    - 服务端返回的响应（HTML 或重定向）会***重新渲染***页面。

## AJAX vs Full Page 的区别总结

| 特性                | AJAX 模式 (fetch)     | Full Page 模式 (表单提交)        |     |
| ----------------- | ------------------- | -------------------------- | --- |
| **页面刷新**          | 无刷新                 | 刷新或导航                      |     |
| **数据格式**          | 灵活（JSON、FormData 等） | 固定（urlencoded 或 multipart） |     |
| **客户端控制**         | 高（可自定义请求和响应处理）      | 无（依赖浏览器和服务端）               |     |
| **依赖 JavaScript** | 是                   | 否                          |     |
| **Superforms**    | use:enhance + fetch | 无增强时退化                     |     |
### AJAX 和全页请求的误解

可能把 AJAX 和全页请求区分得过于清晰。实际上，它们都是 HTTP 请求，区别在于**执行方式**和**客户端处理**：
#### **共同点**

- 都是 HTTP 请求，可能返回 HTML、JSON 或重定向。
- *服务端无感知*：服务端只关心请求的 method、headers 和 body，不区分客户端是 AJAX 还是全页提交。
#### **区别**

- **AJAX（异步）**：
    - 由 JavaScript如 fetch发起,不触发页面刷新,客户端手动处理响应。可以请求 HTML片段、JSON，***触发重定向***(res.redirected)（需客户端处理href)
- **全页请求（同步）**：
    - 由浏览器原生表单提交触发, 默认刷新页面或导航, 服务端返回 HTML 或重定向，浏览器***自动处理***。
    - 全页请求也可以返回 ***JSON***（但浏览器不会处理）。

#### SvelteKit 的融合
- use:enhance 将两者融合：
    - 使用 AJAX 发送请求（异步）。
    - 如果服务端返回重定向，客户端路由接管（不刷新）。
    - 如果返回数据，客户端可更新 UI（类似 SPA）。
- 这模糊了 AJAX 和全页请求的界限：本质上是 HTTP 请求，但客户端行为更灵活。
# enhance
## Sveltekit:enhance 的***升级***：

这与 SPA 的 AJAX 模式类似，但依托于 SvelteKit 的框架支持。

- use:enhance 拦截表单提交，阻止默认的全页刷新。
- 使用 fetch 异步发送请求（AJAX 风格），但仍符合 SvelteKit 的 actions 机制。
- 服务端仍然通过 actions 处理请求，但客户端可以选择不刷新页面，而是根据返回的数据更新 UI。
- 如果设置了 dataType: 'json'（如 ***Superforms***），请求体可以包含 JSON 数据，但实际上仍封装在 FormData 中，服务端看到的仍然是 multipart/form-data（除非你自定义 fetch 发送纯 JSON）。
- SvelteKit 会自动处理重定向，客户端导航到新页面（仍然不刷新整个页面，而是通过客户端路由更新）。
- use:enhance 的回调接收结果，更新本地变量(Svelte 的***响应式机制***自动重新渲染 UI)

## superforms的enhance
D:\npmjs-sources\sveltekit-superforms-next\sveltekit-superforms-next\src\lib\client\superForm.ts 1547~2076
```js
const { form, errors, enhance, delayed, message, constraints, reset } = superForm(data.form, {
  resetForm: false,
  onUpdated() {
    if (!data.form.data.id) {
      reset({ keepMessage: true }); // 新建用户时候, 保留原有内容. 其他的则重读
    }
  }
});
```
 - constraints 是表单原始的原始内容, id,name, maxlength ..等, 由 validator shema 提供

#### 特殊情况: 
load阶段服务端验证失败时的行为

- 用户进入页面时，表单可能立即显示错误（如果字段为空且有验证规则）。
- 服务端***不会“报错”***（抛出异常），只是返回带有错误信息的 form 对象。
- 使用 tainted 检查字段是否被用户修改过. ***将错就错***  
 ```html
  {#if $tainted.name && $errors.name}
	  <span>{$errors.name}</span>
  {/if}
  ```

> 是否正常这取决于设计意图。Superforms 默认在初始化时运行验证，但这可能不是最佳 UX。

## SvelteKit 和 Superforms 的 enhance 区别

#### 概述

SvelteKit 提供了一个叫 use:enhance 的指令，用于增强表单提交，让页面不刷新，适合动态更新。Superforms 则是一个基于 SvelteKit 的库，专门处理表单验证和状态管理，它也提供了一个 enhance 函数，但它是用来和 SvelteKit 的 use:enhance 配合使用的。

#### SvelteKit 的 use:enhance

- **是什么**：SvelteKit 的 use:enhance 是一个指令，可以添加到 `<form>` 元素上，拦截表单提交，使用 JavaScript 发送请求，防止页面刷新。
- **功能**：它允许你自定义提交后的行为，比如更新页面部分内容，而不依赖全页加载。它可以单独使用，也可以搭配自定义函数处理结果。
- **使用场景**：适合任何 SvelteKit 应用中需要动态表单提交的情况，比如简单的表单更新，***不需要复杂***的验证或状态管理。
##### 源代码
D:\npmjs-sources\sveltekit-main\kit-main\packages\kit\src\runtime\app\forms.js
```ts
type MP<T> = T | Promise<T>
// @param {import('@sveltejs/kit').SubmitFunction<Success, Failure>} submit Submit callback
type SubmitInput = {
	action: URL;
	formData: FormData;
	formElement: HTMLFormElement;
	controller: AbortController;
	submitter: HTMLElement | null;
	cancel: () => void;
};

// 决定 submission 之后的行为选项
type UpdateFn = (options?: { reset?: boolean; invalidateAll?: boolean } => Promise<void>;

export type SubmitFunction<Success extends Record,Failure extends Record> = (input: SubmitInput) => 
	MP<(void | (opts: {formData, formElement, action: URL, result: ActionResult<S, F>, update: UpdateFn }) => MP<void>)
>;

export function enhance(formElement, submit: SubmitFunction = () => {}) {	
    // Url, ActionResult
	const fallback_callback = async ({action, result, reset = true, invalidateAll: shouldInvalidateAll = true }) => {
		if (result.type === 'success') {
			reset && HTMLFormElement.prototype.reset.call(formElement); // 原生调用
			shouldInvalidateAll && await invalidateAll();
		}
		// For success/failure results 结果仅在当前页生效, 否则 `form` will be updated erroneously
		( location.origin + location.pathname === action.origin + action.pathname 
		  || result.type === 'redirect' || result.type === 'error') && await applyAction(result);
	};

	/** @param {SubmitEvent} event.submitter is @type {HTMLButtonElement | HTMLInputElement} */
	async function handle_submit(event) {
		const method = event.submitter?.hasAttribute('formmethod')
			? event.submitter.formMethod
			: HTMLElement.prototype.cloneNode.call(formElement).method;
		if (method !== 'post') return; // 直接返回, dev会报警
		event.preventDefault(); // 阻止刷新
		const action = new URL(
			event.submitter?.hasAttribute('formaction')
				? event.submitter.formAction
				: HTMLElement.prototype.cloneNode.call(formElement).action
		);

		const enctype = event.submitter?.hasAttribute('formenctype')
			? event.submitter.formEnctype
			: HTMLElement.prototype.cloneNode.call(formElement).enctype;

		const formData = new FormData(formElement); // 全是克隆的
		// 如果 触发器或form的序列化方法不是多段的,但是包含了文件, 报告错误. 必须明确指定!
		if (DEV && enctype !== 'multipart/form-data') {
			for (const value of formData.values())
				value instanceof File && throw new Error('https://github.com/sveltejs/kit/issues/9819'));
		}

		const submitter_name = event.submitter?.getAttribute('name'); // 放入触发器的名称和值. FORM没有
		(submitter_name) && formData.append(submitter_name, event.submitter?.getAttribute('value') ?? '');
		
		const controller = new AbortController();
		let cancelled = false;
		const cancel = () => (cancelled = true);
		// 此处调用 回调函数. 作用是 更新之后的钩子函数, 提供了一个默认实现. 如果你想置入逻辑, 就把上下文带过去, 生成你的函数
		// callback 是提交后的执行: async ({action, result, reset = true, invalidateAll: shouldInvalidateAll = true })
		const callback = await submit({action,cancel,controller,formData,formElement,submitter}) ?? fallback_callback;
		if (cancelled) return; // 如果你修改了cancelled. 通过调用cancel();
				
		let result; //ActionResult
		try {
			const headers = new Headers({accept: 'application/json', 'x-sveltekit-action': 'true'});

			// 发送FormData时不要明确设定ContentType, 否则会干扰浏览器头设置 mozilla XMLHttpRequest Using_FormData_Objects#sect4
			if (enctype !== 'multipart/form-data')
				headers.set('Content-Type',	isNative(enctype) ? enctype : 'application/x-www-form-urlencoded');
			
			// @ts-expect-error `URLSearchParams(formDdata)` is kosher, but typescript doesn't know that
			const body = enctype === 'multipart/form-data' ? formData : new URLSearchParams(formData);// 重绑?
			// 关键点!还是 fetch. 但是接受要求是 application/json!!!!
			const response = await fetch(action, {POST, headers, cache: 'no-store', body, signal: controller.signal});

			result = deserialize(await response.text()); // 反序列化,JSON.parse, devalue.parse// 通常是后者
			if (result.type === 'error') result.status = response.status;
		} catch (error) {
			if (error?.name === 'AbortError') return;
			result = { type: 'error', error };
		}
		/* 实际 use:enhance={  (whatis) => { 
			  beforeFn()
			  return async ({ update }) => {
	              await update({});// 等待更新完成. 通常是默认选项. reset, invalidateAll
	              deleting = deleting.filter((id) => id !== todo.id);// 退出删除状态. 由重查询接管
			  };
	     }}*/
		await callback({
			action,	formData, formElement, result, // 其他的参数可能不关心
			update: (opts) => fallback_callback({action, result, reset: opts?.reset, invalidateAll: opts?.invalidateAll	})
		});
	}

	// @ts-expect-error
	HTMLFormElement.prototype.addEventListener.call(formElement, 'submit', handle_submit);

	return {
		destroy() {
			// @ts-expect-error
			HTMLFormElement.prototype.removeEventListener.call(formElement, 'submit', handle_submit);
		}
	};
}

```
##### 前后参数观察
![[kit-enhance-hook.png]]
##### 乐观更新实例
```ts
// 输入表单. 承接 actions/create返回的内容. 在load的时候, 这个对象为undefined
let { data, form } = $props();//data 可能是load之后的todos

let creating = $state(false); // 创建action的UX变量
let deleting = $state([]); // 删除action的UX变量

{#if form?.error} // sveltekit 通过响应机制置入
	<p class="error">{form.error}</p>
{/if}
<form method="POST"	action="?/create"
	use:enhance={() => {
		creating = true
		// 返回一个回调函数, 回调函数接受update参数进行执行
		return async ({ update }) => {
			await update();
			creating = false;
		};
	}}>		
	<label> Add a todo: 在回程之间 置入 UX
		<input disabled={creating}	name="description" value={form?.description ?? ''} required	/>
	</label>	
</form>
/////////////////////////////////////////////////显示区///////////////////////////////////////////////
<ul class="todos"> 
	{#each data.todos.filter((todo) => !deleting.includes(todo.id)) as todo (todo.id)}
	<li in:fly={{ y: 20 }} out:slide>
		<form
			method="POST"
			action="?/delete"
			use:enhance={() => {
				deleting = [...deleting, todo.id]; // 乐观更新. 增加了"筛"除
				return async ({ update }) => {
					await update();
					deleting = deleting.filter((id) => id !== todo.id); // 成功之后.它不处于列表中
				};
			}}>
			<input type="hidden" name="id" value={todo.id} />
			<span>{todo.description}</span>
			<button aria-label="Mark as complete"></button>
		</form>
	</li> 
	{/each} 
</ul>
{#if creating} <span class="saving">saving...</span> {/if}
```
#### Superforms 的 enhance

- **是什么**：Superforms 提供一个 enhance ***函数***，不是指令，而是要传递给 SvelteKit 的 use:enhance 使用的函数。
- **功能**：这个函数专门为 Superforms 设计，处理表单提交时与 Superforms 的表单状态和验证同步。它会自动管理表单的错误、消息和验证状态。
- **使用场景**：当你使用 Superforms 来管理表单（比如需要复杂的验证、错误处理或状态同步），它wrap了kitEnhance。
   `const enhanced = kitEnhance(FormElement, async (submitParams) => {...}`
##### superform 源代码 root
- FormOptions 多达20~的选项
- SuperFormEvents 抽取5大事件选项
    ```ts
    <T extends Record, M> = Pick<FormOptions<T, M>,'onError' | 'onResult' | 'onSubmit' | 'onUpdate' | 'onUpdated'>
	```
- enhance代码继续
源代码
![[superforms.png]]

##### superform/enhance
use：enhance发生
- 绑定时， push到 formOptions(来自***superForm的参数***).***onXXX***数组的尾部
- 生成`htmlForm(FormElement, { submitting: Submitting, delayed: Delayed, timeout: Timeout }, options)`函数集
- 调用kit的增强处理， 传入回调函数， 继续
![[superforms-enhance.png]]
##### wrap kitEnhance
- wrap kit的enhance, 传入回调函数， 回调函数返回一个闭包函数
```js
	// event can be a record if an external request was returning JSON,
	// or if it failed parsing the expected JSON.
	async function validationResponse(event: { result: Record<string, unknown> }) {...}
```
回调函数， 继续 关键点: submit 扩展了***submitParams***, 并提供了 3 个扩展函数
```ts
type SubmitParams = {
	action: URL;
	formData: FormData;
	formElement: HTMLFormElement;
	controller: AbortController;
	submitter: HTMLElement | null;
	cancel: () => void;
};
```
关键部分
```ts
			submit.cancel = cancel; // 重写 默认的cancel
			if (htmlForm.isSubmitting() && options.multipleSubmits == 'prevent') {
				cancel({ resetTimers: false }); // 正在提交? 阻止? 取消
			} else {
				if (htmlForm.isSubmitting() && options.multipleSubmits == 'abort') {
					if (currentRequest) currentRequest.abort(); // 中止? 中止当前
				}
				htmlForm.submitting(); //启动计时器 交互设计中的 3 个响应时间限制
				currentRequest = submit.controller; //指向当前句柄
				// 处理每个onSubmit事件in管道 
				for (const event of formEvents.onSubmit) {
					try {
						await event(submit);// 处理每个提交事件. 不返回值
					} catch (error) {
						cancel();
						triggerOnError({ type: 'error', error }, 500);
					}
				}
			}
			// 此时提交了没有? 没有, 确保没有取消,才继续. 事件可以先处理
			// Client validation
			// 预装数据分两种情况,SPA, 和 json
```
![[superforms-wrap.png]]
##### 传给kitenhanc的回调函数分析


# 核心概念与实现机制byAI

## 1. 增强版的 enhance 函数
```ts
function superFormEnhance(FormElement: HTMLFormElement, events?: SuperFormEvents<T, M>) {
  // 设置表单行为
  if (options.SPA !== undefined && FormElement.method == 'get') FormElement.method = 'post';
  // ...  
  const enhanced = kitEnhance(FormElement, async (submitParams) => {
    // ... 自定义处理逻辑
  });  
  return {
    destroy: () => { /* ... */ }
  };
}
```

## 2. 单程数据修改 (Single Flight Mutation)

SuperForms 实现了单程数据修改模式，这意味着：

1. 服务器处理表单提交

2. 更新数据并生成新状态

3. 在同一个请求-响应周期内返回更新后的表单状态

```ts
// 服务器端验证后，直接更新客户端状态
async function Form_updateFromValidation(form: SuperValidated<T, M, In>, successResult: boolean) {
  // ...处理表单状态
  // ...触发 onUpdated 事件
}
```
## 3. 无刷新表单提交 + 渐进增强

SuperForms 保留了 SvelteKit 的渐进增强特性：如果 JavaScript 不可用，表单依然可以通过传统方式提交。
```ts
// 检测是否是非 JavaScript 的表单提交
if (!browser && _currentPage.form && typeof _currentPage.form === 'object') {
  const postedData = _currentPage.form;
  for (const postedForm of Context_findValidationForms(postedData).reverse()) {
    if (postedForm.id == _initialFormId && !initialForms.has(postedForm)) {
      // 处理非 JS 表单提交
    }
  }
}
```
## 4. SPA 模式

SuperForms 提供了完全的 SPA 模式支持，在这种模式下，表单提交不会触发页面刷新，而是在客户端处理表单验证和更新状态：
```ts
if (Form_isSPA()) {
  if (!validation) validation = await validateForm();
  cancel({ resetTimers: false });
  clientValidationResult(validation);
}
```
## 5. 客户端验证与服务器验证的无缝衔接
```ts
async function Form_clientValidation( event: FullChangeEvent | null, force = false, adapter?: ValidationAdapter<Partial<T>>){
  // ...客户端验证逻辑
  const result = await Form_validate({ adapter });
  // ...处理验证结果
  return result;
}
```
## 6. 表单状态管理
整个库通过精心设计的状态管理，处理了表单的各种状态：
```ts
// 核心状态管理
const __data = {
  formId: form.id,
  form: clone(form.data),
  constraints: form.constraints ?? {},
  posted: form.posted,
  errors: clone(form.errors),
  message: clone(form.message),
  tainted: undefined as TaintedFields<T> | undefined,
  valid: form.valid,
  submitting: false,
  shape: form.shape
};
```
## 特殊功能解析

### 1. 自动表单验证

SuperForms 提供了多种表单验证方式，包括：
- 提交时验证 (onsubmit)
- 输入时验证 (oninput)
- 失焦时验证 (onblur)

```ts
// fun Form_clientValidation(event: FullChangeEvent, force = false, adapter?: ValidationAdapter<Partial<T>>)
if (options.validationMethod == 'onsubmit' || options.validationMethod == 'submit-only') {
  skipValidation = true;
} else if (options.validationMethod == 'onblur' && event?.type == 'input')
  skipValidation = true;
else if (options.validationMethod == 'oninput' && event?.type == 'blur')
  skipValidation = true;
```
### 2. "脏"状态检测

SuperForms 追踪表单的"脏"状态 (tainted)，当表单内容被修改但尚未提交时，它能够检测并提供适当的用户体验：
```ts
function Tainted_checkUnload(e: BeforeUnloadEvent) {
  if (!Tainted_isEnabled()) return;
  // 提示用户未保存的更改
  e.preventDefault();
  e.returnValue = '';
  // ...
}
```
### 3. JSON 数据提交
SuperForms 支持 JSON 数据提交，这使得复杂的嵌套数据结构变得可能：
### 4. 文件处理
```ts
// 处理文件上传
traversePaths(postData, (data) => {
  if (data.value instanceof File) {
    const key = '__superform_file_' + mergePath(data.path);
    submitData.append(key, data.value);
    return data.set(undefined);
  } else if (
    Array.isArray(data.value) &&
    data.value.length &&
    data.value.every((v) => v instanceof File)
  ) {
    const key = '__superform_files_' + mergePath(data.path);
    for (const file of data.value) {
      submitData.append(key, file);
    }
    return data.set(undefined);
  }
});
```

## superform 事件时序
让我们详细分析这些事件的调用顺序和与 SvelteKit 的 submit 回调的关系：
### 1. 事件流程的时间顺序

完整的事件流程按时间顺序为：

1. onSubmit：表单提交初始阶段
2. SvelteKit 的 submit callback：SvelteKit 增强表单的回调
3. onResult：服务器返回结果，但尚未应用
4. onUpdate：准备更新表单数据
5. onUpdated：表单数据已更新完成
6. onError：处理服务器返回的错误（如果有）


### 2. 时机
#### onSubmit
   表单提交初始阶段，在 SvelteKit 的 submit 回调之前

- 功能：预处理表单数据，可以修改提交行为，如添加额外字段

- 参数：带有 `{jsonData, validators, customRequest}` 扩展的 submit 对象

- 可以做什么：取消提交、修改提交数据、更改验证行为
#### onResult
服务器返回时处理
#### onUpdate
- 时机：准备更新表单数据前 https://superforms.rocks/concepts/events#onupdate SPA中常用.

- 功能：在应用表单数据前修改它

- 参数：`{ form, formEl, formElement, cancel, result }`

- 可以做什么：修改要应用的表单数据、取消更新
#### onUpdated
```ts
for (const event of formEvents.onUpdated) {
  event({ form });
}
```

- 时机：表单数据已更新完成

- 功能：在表单更新后执行操作

- 参数：{ form }（***只读***）

- 可以做什么：执行表单更新后的操作，如***显示通知***
#### onError
```ts
for (const onErrorEvent of formEvents.onError) {
  if (onErrorEvent !== 'apply' && (onErrorEvent != defaultOnError || !options.flashMessage?.onError)) 
    await onErrorEvent(event);
}
```

- 时机：处理服务器返回的错误

- 功能：自定义错误处理

- 参数：*{ result, message, form }*

- 可以做什么：显示***错误消息、修改错误处理行为***
```ts
const defaultFormOptions = {
	applyAction: true,
	invalidateAll: true,
	resetForm: true,
	autoFocusOnError: 'detect',
	scrollToError: 'smooth',
	errorSelector: '[aria-invalid="true"],[data-invalid]',
	selectErrorText: false,
	stickyNavbar: undefined,
	taintedMessage: false,
	onSubmit: undefined,
	onResult: undefined,
	onUpdate: undefined,
	onUpdated: undefined,
	onError: defaultOnError,
	dataType: 'form',
	validators: undefined,
	customValidity: false,
	clearOnSubmit: 'message',
	delayMs: 500,
	timeoutMs: 8000,
	multipleSubmits: 'prevent',
	SPA: undefined,
	validationMethod: 'auto'
} satisfies FormOptions;
Form_updateFromActionResult() > Form_updateFromValidation()
							    Form_updateFromValidation
```
### 3. 与 SvelteKit submit 回调的关系

SuperForms 的 enhance 函数是 SvelteKit enhance 的封装：
```ts
const enhanced = kitEnhance(FormElement, async (submitParams) => {
  // ... SuperForms 的逻辑  
  // 准备 SuperForms 特有的 submit 对象
  const submit = {
    ...submitParams,
    jsonData(data: Record<string, unknown>) { /* ... */ },
    validators(adapter: Exclude<ValidatorsOption<T>, 'clear'>) { /* ... */ },
    customRequest(request: typeof customRequest) { /* ... */ }
  };  
  // 先执行 SuperForms 的 onSubmit 事件
  for (const event of formEvents.onSubmit) {
    await event(submit);
  }  
  // 然后是 SvelteKit 的常规流程
  // ...  
  // 返回 SvelteKit 的 ActionResult 处理函数
  return validationResponse;
});
```
1. SuperForms 的 onSubmit 先执行，可以修改提交参数
2. SvelteKit 的提交处理是其核心，SuperForms 在其上层添加功能
3. SuperForms 的后续事件 (onResult, onUpdate 等) 在 SvelteKit 的 action 执行完成后触发

### 4. 完整的事件流程示例

假设表单提交过程如下：
```
用户点击提交按钮
↓
SuperForms.onSubmit 事件触发
↓
SvelteKit 提交处理逻辑执行
↓
表单数据发送到服务器
↓
服务器处理并返回响应
↓
SuperForms.onResult 事件触发
↓
SuperForms.onUpdate 事件触发 // SPA可能
↓
表单状态更新
↓
SuperForms.onUpdated 事件触发 // SPA 可能
```
SuperForms.onUpdated 事件触发

如果出现错误：
```
服务器返回错误
↓
SuperForms.onResult 事件触发 (result.type 为 'error')
↓
SuperForms.onError 事件触发
```



## 总结

SuperForms 通过精心设计的机制实现了：

1. 完整的二进制文件处理：

- 保留原始 File 对象

- 路径映射确保嵌套结构的完整性

- 表单重置和更新时保留文件引用

1. 客户端和服务器验证的无缝衔接：

- 统一的验证适配器

- 灵活的验证时机控制

- 统一的错误展示逻辑

- SPA 和传统模式的完美支持

1. 清晰的事件流程：

- 按逻辑顺序执行的生命周期钩子

- 与 SvelteKit 原生事件的紧密集成

- 全面的错误处理和数据转换机制

这些特性让 SuperForms 成为一个强大而灵活的表单处理库，能够处理从简单到复杂的各种表单场景。

#### 文件处理
```ts
// 原始数据
const formData = {
  name: "年度报告",
  document: new File(["文件内容"], "report.pdf", { type: "application/pdf" }),
  gallery: [
    new File(["图片1内容"], "image1.jpg", { type: "image/jpeg" }),
    new File(["图片2内容"], "image2.jpg", { type: "image/jpeg" })
  ],
  metadata: {
    author: "张三",
    avatar: new File(["头像内容"], "avatar.png", { type: "image/png" })
  }
};

// 创建一个用于 HTTP 提交的 FormData 对象
const submitData = new FormData();

// 遍历并处理数据中的文件
traversePaths(formData, (data) => {
  if (data.value instanceof File) {
    // 例如：document 字段的文件
    const key = '__superform_file_' + mergePath(data.path);  // 结果: '__superform_file_document'
    submitData.append(key, data.value);  // 直接添加二进制文件到 FormData
    return data.set(undefined);  // 在 JSON 中设为 undefined
  } else if (Array.isArray(data.value) && data.value.every(v => v instanceof File)) {
    // 例如：gallery 字段的文件数组
    const key = '__superform_files_' + mergePath(data.path);  // 结果: '__superform_files_gallery'
    for (const file of data.value) {
      submitData.append(key, file);  // 多次添加相同键名的文件
    }
    return data.set(undefined);  // 在 JSON 中设为 undefined
  }
});

// 此时，formData 变成了：
// {
//   name: "年度报告",
//   document: undefined,
//   gallery: undefined,
//   metadata: {
//     author: "张三",
//     avatar: undefined
//   }
// }
// 将无文件的 JSON 数据序列化
const jsonString = JSON.stringify(formData);
submitData.append('__superform_json', jsonString);
// HTTP 请求最终会发送以下数据:
// FormData:
// - __superform_json: {"name":"年度报告","document":null,"gallery":null,"metadata":{"author":"张三","avatar":null}}
// - __superform_file_document: File([二进制文件对象])
// - __superform_files_gallery: File([二进制文件对象])
// - __superform_files_gallery: File([二进制文件对象])
// - __superform_file_metadata.avatar: File([二进制文件对象])


POST /form-action HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryABC123

------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="__superform_json"

{"name":"年度报告","document":null,"gallery":null,"metadata":{"author":"张三","avatar":null}}
------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="__superform_file_document"; filename="report.pdf"
Content-Type: application/pdf

[原始二进制PDF文件内容]
------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="__superform_files_gallery"; filename="image1.jpg"
Content-Type: image/jpeg

[原始二进制JPG文件内容]
------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="__superform_files_gallery"; filename="image2.jpg"
Content-Type: image/jpeg

[原始二进制JPG文件内容]
------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="__superform_file_metadata.avatar"; filename="avatar.png"
Content-Type: image/png

[原始二进制PNG文件内容]
------WebKitFormBoundaryABC123--

// 重组后的服务器端数据
{
  name: "年度报告",
  document: File,  // 原始文件对象
  gallery: [File, File],  // 原始文件数组
  metadata: {
    author: "张三",
    avatar: File  // 原始嵌套文件
  }
}

```
## 与 Base64 序列化的对比

许多库选择使用 Base64 编码来序列化二进制数据，但 SuperForms 避免了这种方法：

| 方法              | 优势                                          | 劣势                                               |
| --------------- | ------------------------------------------- | ------------------------------------------------ |
|  SuperForms 方法  | - 高效传输<br>- 不增加数据大小<br>- 保留文件元数据<br>- 支持大文件 | - 需要特殊服务器处理<br>- 代码复杂性稍高                         |
| Base64 编码       | - 简单实现<br>- 可以直接包含在 JSON 中<br>- 跨浏览器兼容性好    | - 数据膨胀约 33%<br>- 丢失文件元数据<br>- 大文件性能差<br>- 占用更多内存 |

## 实际

# 范例分析
**reset({ keepMessage: true })**
在表单重置时保留 message，避免成功或错误提示被清空。