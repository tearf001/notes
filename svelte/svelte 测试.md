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
################
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
return suite_with_variants(['dom','hydrate','ssr'],
		(variant, config) => {
			if (variant === 'hydrate')
				if (config.mode && !config.mode.includes('hydrate')) return 'no-test';
				if (config.skip_mode?.includes('hydrate')) return true;
			
			if (variant=='dom' && (config.skip_mode?.includes('client') || (config.mode&&!config.mode.includes('client')))) 
				return 'no-test';

			if (variant === 'ssr') {
				if ((config.mode && !config.mode.includes('server')) || 
					(!config.test_ssr && !config.html && config.ssrHtml &&	!config.error && !config.runtime_error &&
						!config.mode?.includes('server'))
				) return 'no-test';
				if (config.skip_mode?.includes('server')) return true;
			}

			return false;
		},
		(config, cwd) => {
			return common_setup(cwd, runes, config);
		},
		async (config, cwd, variant, common) => {
			await run_test_variant(cwd, config, variant, common, runes);
		}
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
	variants: Variants[],
	should_skip_variant: (variant: Variants, config: Test) => boolean | 'no-test',
	common_setup: (config: Test, test_dir: string) => Promise<Common> | Common,
	fn: (config: Test, test_dir: string, variant: Variants, common: Common) => void
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
					const skip = config.skip || should_skip_variant(variant, config);
					const solo = config.solo;
					let it_fn = skip ? it.skip : solo ? it.only : it;

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
		created_test = true;
		const config = (fs.existsSync(file) ? (await import(file)).default : {}) as Test;
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