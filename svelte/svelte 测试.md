# 目录结构
项目`tests`根, 包含测试套件, `suit.ts` 位于 _packages\svelte\tests\suite.ts_  还有些测辅代码, 比如html_equal, helpers.js, animation-helpers.js

然后 分功能(每个功能划分在一个次级目录中, 如 runtime_runes)

## 次级目录
每个次级目录中包含test.ts 文件.  *比如 packages\svelte\tests\runtime-runes\test.ts.*
```ts
包含 # samples/+test.ts的目录
├── # compiler-errors
├── # css 
├── # hydration
├── # migrate
├── motion 只有 `test.ts`
├── # parser-legacy
├── # parser-modern
├── # preprocess 预处理
├── # runtime-browser 除了以上, 还包括其他的目录和文件.
├── # runtime-legacy  + shared.js
├── # runtime-runes
├── # server-side-rendering
├── signals 只有 `test.ts`
├── # snapshot
├── # sourcemaps + `helpers.js`
├── store 只有 `test.ts`
├── types 与众不同, 因为它是 typescript的测试
├── # validator
//////////////////////////////////
├── helpers.js
├── animation-helpers.js
├── html_equal.js
└── suite.ts
```

因为兼容性的关系, 很多代码仍然使用遗留的逻辑, 比如`运行时测试套装`
_packages\svelte\tests\runtime-runes\test.ts_ 内容
```ts
// @vitest-environment jsdom
import { runtime_suite, ok } from '../runtime-legacy/shared';
const { test, run } = runtime_suite(runes: true); // 测试套件 返回调用 suite_with_variants()
export { test, ok }; // test函数 和 检验函数
await run(__dirname); // 运行目录
```

```js
return suite_with_variants(
		['dom','hydrate','ssr'], // 第一个参数: variants
		(variant, config) => {
			if (variant === 'hydrate') // 水合阶段
				if (config.mode && !config.mode.includes('hydrate')) return 'no-test'; // 不包含水合. 返无测试
				if (config.skip?.includes('hydrate')) return true; // 跳过
			
			if (variant=='dom' && (config.skip?.includes('client') || (config.mode&&!config.mode.includes('client')))) 
				return 'no-test'; // DOM时: 跳过, 或者不包含, 返无测试;

			if (variant === 'ssr') { // SSR 服务器渲染
				if ((config.mode && !config.mode.includes('server')) || 
					(!config.test_ssr && !config.html && config.ssrHtml &&	!config.error && !config.runtime_error &&
						!config.mode?.includes('server'))
				) return 'no-test';
				if (config.skip_mode?.includes('server')) return true;
			}
			return false; // 不跳过
		}, // 第2个参数, 根据变体和配置,返回是否跳过
		(config, cwd) => {
			return common_setup(cwd, runes, config); // 通用设置, 支持runes
		}, // 第3个参数should_skip_variant, 设置
		async (config, cwd, variant, common) => {
			await run_test_variant(cwd, config, variant, common, runes);
		}  // 第4个参数, 运行测试
	);
```

## 根测试套件
`./suit.ts` 主要提供一个 ***suite*** 函数, 和 ***suite_with_variants***, 比如提供给 `runtime-legacy/shared.js / runtime_suite`调用

```ts
import fs from 'node:fs';
import { it } from 'vitest';

export interface BaseTest {	skip?: boolean;	solo?: boolean;} // 测试接口

// 测试过滤参数. 作为 pnpm test的命令参数
/**FILTER=my-test | /feature/ pnpm test (runs only | all tests matching that FILTER ARG) */
const filter = !process.env.FILTER ? '/./'
	: new RegExp(
			process.env.FILTER.startsWith('/') // 正则表达式 /.../转义所有的修饰符
				? process.env.FILTER.slice(1, -1).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
				: `^${process.env.FILTER.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`
		);

export function suite<Test extends BaseTest>(fn: (config: Test, test_dir: string) => void) {
	return {
		test: (config: Test) => config,
		run: async (cwd: string, samples_dir = 'samples') => {
			await for_each_dir<Test>(cwd, samples_dir, (config, dir) => {
				let it_fn = config.skip ? it.skip : config.solo ? it.only : it;
				it_fn(dir, () => fn(config, `${cwd}/${samples_dir}/${dir}`));
			});
		}
	};
}

export function suite_with_variants<Test extends BaseTest, Variants extends string, Common>(
	variants: Variants[], //变体
	should_skip_variant: (variant: Variants, config: Test) => boolean | 'no-test', // 跳过
	common_setup: (config: Test, test_dir: string) => Promise<Common> | Common, // 配置
	fn: (config: Test, test_dir: string, variant: Variants, common: Common) => void // 测试
) {
	return {
		test: (config: Test) => config,
		run: async (cwd: string, samples_dir = 'samples') => {
			await for_each_dir<Test>(cwd, samples_dir, (config, dir) => {
				let called_common = false;
				let common: any = undefined;
				for (const variant of variants) {
					if (should_skip_variant(variant, config) === 'no-test') {
						continue;
					}
					// TODO unify test interfaces
					const skip = config.skip;
					const solo = config.solo;
					let it_fn = skip ? it.skip : solo ? it.only : it;
					// it.skit() it.only() it()
					it_fn(`${dir} (${variant})`, async () => {
						if (!called_common) {
							called_common = true;
							common = await common_setup(config, `${cwd}/${samples_dir}/${dir}`);
						}
						return fn(config, `${cwd}/${samples_dir}/${dir}`, variant, common);
					});
				}
			});
		}
	};
}

// If a directory only contains these children, it's a sign that it's leftover
// from a different branch, and we can skip the test
const ignored = ['_output', '_actual.json'];

async func for_each_dir<Test>(cwd: string, samples_dir='samples', fn: (config: Test, test_dir: string) => void) {
	cwd = cwd.replace(/\\/g, '/');
	let created_test = false;

	for (const dir of fs.readdirSync(`${cwd}/${samples_dir}`)) {
		if (dir[0] === '.' || !filter.test(dir)) continue;

		if (fs.readdirSync(`${cwd}/${samples_dir}/${dir}`).every((file) => ignored.includes(file))) {
			continue;
		}
		const file = `${cwd}/${samples_dir}/${dir}/_config.js`; // 读取配置
		const config = (fs.existsSync(file) ? (await import(file)).default : {}) as Test; // 无文件, 则为{}
		created_test = true;
		fn(config, dir);
	}
	if (!created_test) {
		// prevent vitest from polluting the console with a "no tests found" message
		it.skip(`[SKIP] ${cwd}`, () => {});
	}
}

export function assert_ok(value: any): asserts value {
	!value && throw new Error(`Expected truthy value, got ${value}`);
}
```

测试配置
```js
export default test({
	get props() { return { ... }; },
	html: `<h1>...</h1>`,
	async test({ assert, target, window }) { // 来自
		const header = target.querySelector('h1');
		ok(header);
		const click = new window.MouseEvent('click');
		await header.dispatchEvent(click);
		assert.htmlEqual(
			target.innerHTML,`<h1>Hello World!</h1>`
		);
	}
});
```

## 小结
如果从 `pnpm test` 运行

示例
```js
// tests/accessor-props/_config.js
import { ok, test } from '../../test';
import { flushSync } from 'svelte';
// as config
export default test({
	html: `<p>0</p>`,

	async test({ assert, target, instance }) {
		const p = target.querySelector('p');
		ok(p);
		flushSync(() => {
			instance.count++;
		});
		assert.equal(p.innerHTML, '1');
	}
});
// 
import 'svelte/internal/disclose-version';
import * as $ from 'svelte/internal/client';
var root = $.template(`<p> </p>`);
export default function Main($$anchor, $$props) {
	$.push($$props, true);
	let count = $.prop($$props, 'count', 7, 0);
	var p = root();
	var text = $.child(p, true);
	$.reset(p);
	$.template_effect(() => $.set_text(text, count()));
	$.append($$anchor, p);
	return $.pop({
		get count() {
			return count();
		},
		set count($$value) {
			count($$value);
		}
	});
}
import * as $ from 'svelte/internal/server';

export default function Main($$payload, $$props) {
	let { count = 0 } = $$props;

	$$payload.out += `<p>${$.escape(count)}</p>`;
	$.bind_props($$props, { count });
}

```


```js
// _config.js 转换成字符串
async test({ assert, target, instance }) {
		const p = target.querySelector('p');
		__vite_ssr_import_0__.ok(p);
		__vite_ssr_import_1__.flushSync(() => {
			instance.count++;
		});
		assert.equal(p.innerHTML, '1');
	}
```

```js
/**
 * An effect root whose children can transition out
 * @param {() => void} fn
 * @returns {(options?: { outro?: boolean }) => Promise<void>}
 */
export function component_root(fn) {
	const effect = create_effect(ROOT_EFFECT, fn, true);

	return (options = {}) => {
		return new Promise((fulfil) => {
			if (options.outro) {
				pause_effect(effect, () => {
					destroy_effect(effect);
					fulfil(undefined);
				});
			} else {
				destroy_effect(effect);
				fulfil(undefined);
			}
		});
	};
}
// fn 
() => {
		var anchor_node = anchor ?? target.appendChild(__vite_ssr_import_1__.create_text());
		__vite_ssr_import_5__.branch(() => {
			if (context) {
				__vite_ssr_import_4__.push({});
				var ctx = /** @type {ComponentContext} */ (__vite_ssr_import_4__.component_context);
				ctx.c = context;
			}
			if (events) {
				// We can't spread the object or else we'd lose the state proxy stuff, if it is one
				/** @type {any} */ (props).$$events = events;
			}
			if (__vite_ssr_import_6__.hydrating) {
				__vite_ssr_import_12__.assign_nodes(/** @type {TemplateNode} */ (anchor_node), null);
			}

			should_intro = intro;
			// @ts-expect-error the public typings are not what the actual function looks like
			component = Component(anchor_node, props) || {};
			should_intro = true;
			if (__vite_ssr_import_6__.hydrating) {
				/** @type {Effect} */ (__vite_ssr_import_3__.active_effect).nodes_end = __vite_ssr_import_6__.hydrate_node;
			}

			if (context) {
				__vite_ssr_import_4__.pop();
			}
		});

		return () => {
			for (var event_name of registered_events) {
				target.removeEventListener(event_name, __vite_ssr_import_8__.handle_event_propagation);

				var n = /** @type {number} */ (document_listeners.get(event_name));

				if (--n === 0) {
					document.removeEventListener(event_name, __vite_ssr_import_8__.handle_event_propagation);
					document_listeners.delete(event_name);
				} else {
					document_listeners.set(event_name, n);
				}
			}

			__vite_ssr_import_8__.root_event_handles.delete(event_handle);

			if (anchor_node !== anchor) {
				anchor_node.parentNode?.removeChild(anchor_node);
			}
		};
	}
// 最终代码
function create_effect(type, fn, sync, push = true) {
	var is_root = (type & ROOT_EFFECT) !== 0;
	var parent_effect = active_effect;

	if (DEV) {
		// Ensure the parent is never an inspect effect
		while (parent_effect !== null && (parent_effect.f & INSPECT_EFFECT) !== 0) {
			parent_effect = parent_effect.parent;
		}
	}

	/** @type {Effect} */
	var effect = {
		ctx: component_context,
		deps: null,
		nodes_start: null,
		nodes_end: null,
		f: type | DIRTY,
		first: null,
		fn,
		last: null,
		next: null,
		parent: is_root ? null : parent_effect,
		prev: null,
		teardown: null,
		transitions: null,
		wv: 0
	};

	if (DEV) {
		effect.component_function = dev_current_component_function;
	}

	if (sync) {
		try {
			update_effect(effect); // 更新效果
			effect.f |= EFFECT_RAN;
		} catch (e) {
			destroy_effect(effect); // 摧毁小姑
			throw e;
		}
	} else if (fn !== null) {
		schedule_effect(effect);
	}

	// if an effect has no dependencies, no DOM and no teardown function,
	// don't bother adding it to the effect tree
	var inert =
		sync &&
		effect.deps === null &&
		effect.first === null &&
		effect.nodes_start === null &&
		effect.teardown === null &&
		(effect.f & (EFFECT_HAS_DERIVED | BOUNDARY_EFFECT)) === 0;

	if (!inert && !is_root && push) {
		if (parent_effect !== null) {
			push_effect(effect, parent_effect);
		}

		// if we're in a derived, add the effect there too
		if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
			var derived = /** @type {Derived} */ (active_reaction);
			(derived.effects ??= []).push(effect);
		}
	}

	return effect;
}

// 设置符号
export function set_signal_status(signal, status) {
    signal.f = (signal.f & STATUS_MASK) | status;
}
```

D:\npmjs-sources\svelte\packages\svelte\src\internal\client\runtime.js 运行时
```js
/**
 * This function both runs render effects and collects user effects in topological order
 * from the starting effect passed in. Effects will be collected when they match the filtered
 * bitwise flag passed in only. The collected effects array will be populated with all the user
 * effects to be flushed.
 *
 * @param {Effect} root
 * @returns {Effect[]}
 */
function process_effects(root) {}

function flush_queued_root_effects() {
	try {
		var flush_count = 0;
		while (queued_root_effects.length > 0) {
			if (flush_count++ > 1000) {
				infinite_loop_guard();
			}
			var root_effects = queued_root_effects;
			var length = root_effects.length;
			queued_root_effects = [];
			for (var i = 0; i < length; i++) {
				var root = root_effects[i];

				if ((root.f & CLEAN) === 0) {
					root.f ^= CLEAN;
				}
				var collected_effects = process_effects(root); // 收集副作用, 拓扑结构, 保证按序冲刷
				flush_queued_effects(collected_effects);
			}
		}
	} finally {
		is_flushing = false;

		last_scheduled_effect = null;
		if (DEV) {
			dev_effect_stack = [];
		}
	}
}
```
```vue
<script>
	let { count=0 } = $props();
	export { //  as instance
		count
	}
</script>
<p>{count}</p>
```

```js

```