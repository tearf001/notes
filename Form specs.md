
## 数据库返回的值: {data: form}
为什么有默认值, 见 https://github.com/ciscoheat/sveltekit-superforms/blob/main/src/tests/JSONSchema.test.ts
```js
{
    "form": {
        "id": "p1atr0",
        "valid": false,
        "posted": false,
        "errors": {},
        "data": {
            "name": "",
            "description": "",
            "category": 0,
            "subCategory": "",
            "price": 0,
            "stock": 0,
            "images": []
        },
        "constraints": {
            "name": {
                "required": true
            },
            "description": {
                "required": true
            },
            "category": {
                "required": true
            },
            "subCategory": {
                "required": true
            },
            "price": {
                "required": true
            },
            "stock": {
                "required": true
            },
            "images": {
                "required": true
            }
        },
        "shape": {
            "images": {}
        }
    }
}
```

form的值
## 用户代码 superForm=>form
```js
const form = superForm(data.form, { validators: valibotClient(productSchema), validationMethod: 'auto'});
// 
```
data.form 是 响应值 `reactive`, svelte 客户端解析data.form 的值逻辑在 `props.js` http://localhost:4000/node_modules/.pnpm/svelte@5.22.5/node_modules/svelte/src/internal/client/reactivity/props.js 得到的是getter函数. 延迟求值, 即 `数据库返回的值`
```js
	var getter;
	if (runes) {
		getter = () => {
			var value = props[key];
			if (value === undefined) return get_fallback();
			fallback_dirty = true;
			fallback_used = false;
			return value;
		};
	} else {
		// Svelte 4 did not trigger updates when a primitive value was updated to the same value.
		// Replicate that behavior through using a derived 安全获取衍生value, svelte 5 显然更简单
		var derived_getter = (immutable ? derived : derived_safe_equal)(
			() => props[key]
		);
		derived_getter.f |= LEGACY_DERIVED_PROP;
		getter = () => {
			var value = get(derived_getter);
			if (value !== undefined) fallback_value = undefined; // 定义了, 就是value 清空fb; 没定义, 则返回fallback
			return value === undefined ? fallback_value : value;
		};
	}
```
## superForm ***调用*** 得到的内容:
全部是响应的***wrappers*** sus (*set, update, subscribe*)
```js
{
    "form": {set:f, update:f, subscribe: f},
    "formId": {set, update, subscribe},
    "errors": {sus},
    "message": {sus},
    "constraints": {set: f, update:f, subscribe: f},
    "tainted": {sus}, // 污染的；感染的
    isTained: f Tainted_isTainted // 污染的；感染的
    "submitting": {subscribe: f},
    "delayed": {subscribe: f},
    "timeout": {subscribe: f},
    "options": {
        "applyAction": true,
        "invalidateAll": true,
        "resetForm": true,
        "autoFocusOnError": "detect",
        "scrollToError": "smooth",
        "errorSelector": "[aria-invalid=\"true\"],[data-invalid]", // 错误选择器
        "selectErrorText": false,
        "dataType": "form",
        "validators": {
            "superFormValidationLibrary": "valibot"
        },
        "customValidity": false,
        "clearOnSubmit": "message",
        "delayMs": 500,
        "timeoutMs": 8000,
        "multipleSubmits": "prevent",
        "validationMethod": "auto"
    },
    "allErrors": {subscribe: f},
    "posted": {set:f, subscribe: f, update:f},
    enhance:{subscribe: f, set: f},
    validateForm: async validateForm(ops={}),
    reset: f reset,
    restore: ((snapshot) => void rebind({ form: snapshot, untaint: snapshot.tainted ?? true })),
}
// sveltekit-superform.superForm()返回的源码: // sveltekit-superforms/dist/client/superForm.js
 return {
        form: Form,
        formId: FormId,
        errors: Errors,
        message: Message,
        constraints: Constraints,
        tainted: Tainted_currentState(),
        submitting: readonly(Submitting),
        delayed: readonly(Delayed),
        timeout: readonly(Timeout),
        options: options,
        capture: Form_capture,
        restore: ((snapshot) => {
            rebind({ form: snapshot, untaint: snapshot.tainted ?? true });
        }),
        async validate(path, opts = {}) {
            if (!options.validators) {
                throw new SuperFormError('options.validators must be set to use the validate method.');
            }
            if (opts.update === undefined)
                opts.update = true;
            if (opts.taint === undefined)
                opts.taint = false;
            if (typeof opts.errors == 'string')
                opts.errors = [opts.errors];
            let data;
            const splittedPath = splitPath(path);
            if ('value' in opts) {
                if (opts.update === true || opts.update === 'value') {
                    // eslint-disable-next-line dci-lint/private-role-access
                    Form.update(($form) => {
                        setPaths($form, [splittedPath], opts.value);
                        return $form;
                    }, { taint: opts.taint });
                    data = Data.form;
                }
                else {
                    data = clone(Data.form);
                    setPaths(data, [splittedPath], opts.value);
                }
            }
            else {
                data = Data.form;
            }
            const result = await Form_validate({ formData: data });
            const error = pathExists(result.errors, splittedPath);
            // Replace with custom error, if it exist
            if (error && error.value && opts.errors) {
                error.value = opts.errors;
            }
            if (opts.update === true || opts.update == 'errors') {
                Errors.update(($errors) => {
                    setPaths($errors, [splittedPath], error?.value);
                    return $errors;
                });
            }
            return error?.value;
        },
        async validateForm(opts = {}) {
            if (!options.validators && !opts.schema) {
                throw new SuperFormError('options.validators or the schema option must be set to use the validateForm method.');
            }
            const result = opts.update
                ? await Form_clientValidation({ paths: [] }, true, opts.schema)
                : Form_validate({ adapter: opts.schema });
            const enhancedForm = EnhancedForm_get();
            if (opts.update && enhancedForm) {
                // Focus on first error field
                setTimeout(() => {
                    if (!enhancedForm)
                        return;
                    scrollToFirstError(enhancedForm, {
                        ...options,
                        scrollToError: opts.focusOnError === false ? 'off' : options.scrollToError
                    });
                }, 1);
            }
            return result || Form_validate({ adapter: opts.schema });
        },
        allErrors: AllErrors,
        posted: Posted,
        reset(options) {
            return Form_reset({
                message: options?.keepMessage ? Data.message : undefined,
                data: options?.data,
                id: options?.id,
                newState: options?.newState
            });
        },
        submit(submitter) {
            const form = EnhancedForm_get()
                ? EnhancedForm_get()
                : submitter && submitter instanceof HTMLElement
                    ? submitter.closest('form')
                    : undefined;
            if (!form) {
                throw new SuperFormError('use:enhance must be added to the form to use submit, or pass a HTMLElement inside the form (or the form itself) as an argument.');
            }
            if (!form.requestSubmit) {
                return form.submit();
            }
            const isSubmitButton = submitter &&
                ((submitter instanceof HTMLButtonElement && submitter.type == 'submit') ||
                    (submitter instanceof HTMLInputElement && ['submit', 'image'].includes(submitter.type)));
            form.requestSubmit(isSubmitButton ? submitter : undefined);
        },
        isTainted: Tainted_isTainted,
        enhance: superFormEnhance
    };

```

sveltekit-superform 如何使用 form? 并保持响应性?!
### 源码片段 xxxProxy(Form, path, ops)  如何保持响应
```js
export function filesProxy(form, path, options) {
    const formFiles = fieldProxy(form, path, options);
    const filesProxy = writable(browser ? new DataTransfer().files : {});
    formFiles.subscribe((files) => {
        if (!browser)
            return;
        const dt = new DataTransfer();
        if (Array.isArray(files)) {
            if (files.length && files.every((f) => !f)) {
                formFiles.set([]);
                return;
            }
            files.filter((f) => f instanceof File).forEach((file) => dt.items.add(file));
        }
        filesProxy.set(dt.files);
    });
    const filesStore = {
        subscribe(run) {
            return filesProxy.subscribe(run);
        },
        set(files) {
            if (!browser)
                return;
            if (!(files instanceof FileList)) {
                const dt = new DataTransfer();
                if (Array.isArray(files))
                    files.forEach((file) => {
                        if (file instanceof File)
                            dt.items.add(file);
                    });
                filesProxy.set(dt.files);
                formFiles.set(files);
            }
            else {
                const output = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files.item(i);
                    if (file)
                        output.push(file);
                }
                filesProxy.set(files);
                formFiles.set(output);
            }
        },
        update(updater) {
            filesStore.set(updater(get(formFiles)));
        }
    };
    return filesStore;
}
```

## superForm 单元测试
https://github.com/ciscoheat/sveltekit-superforms/blob/main/src/tests/superForm.test.ts
### superForm行为测试
```js
import { zod } from '$lib/adapters/zod.js';
import { fieldProxy, superForm, type FormOptions, type SuperForm } from '$lib/client/index.js';
import { superValidate, type SuperValidated } from '$lib/superValidate.js';
import { get } from 'svelte/store';
import { merge } from 'ts-deepmerge';
import { describe, it, expect, beforeEach, test } from 'vitest';
import { z } from 'zod';
import { SuperFormError } from '$lib/errors.js';

const schema = z.object({
	name: z.string().default('Unknown'),
	email: z.string().email(),
	tags: z.string().min(2).array().min(3),
	score: z.number().int().min(0)
});

type Schema = z.infer<typeof schema>;
let validated: SuperValidated<Schema>;
let form: SuperForm<Schema>;

function updateForm(data: Partial<Schema>, taint?: boolean | 'untaint') {
	form.form.update(
		($form) => {
			const output = merge($form, data) as Schema; // 偏并(ts-deepmerge)
			//console.log('🚀 ~ file: superForm.test.ts:25 ~ updateForm ~ output:', output);
			return output;
		},
		{ taint } // 选项
	);
}

beforeEach(async () => {
	validated = await superValidate(zod(schema));             // 每次大测试之前都要重置 validated
	form = superForm(validated, { validators: zod(schema) }); // 每次大测试之前都要重置 form
});

describe('Tainted', () => {
	let tainted: SuperForm<Schema>['tainted']; // 定义 boolean | 'untaint'

	beforeEach(async () => {
		tainted = form.tainted; // () => boolean | 'untaint'; 每次小测试之前, 都要重新获得form的`tainted`
	});
	function checkTaint(data: Partial<Schema>,	expected: Record<string, unknown>,taint?: boolean | 'untaint') {
		updateForm(data, taint); // 根据 taint参数去更新 data, 使用偏并(ts-deepmerge)
		expect(get(tainted)).toStrictEqual(expected); // 使用`svelte/store.get`
	}

	it('Should update tainted properly', () => {
		expect(get(tainted)).toBeUndefined(); // 未定义
		expect(form.isTainted()).toBe(false); // 未污染
		checkTaint({ name: 'Test' }, { name: true }); // 更新参数1, 是否和`第二个参数`一致?. 也就是 name被污染了(单个)
		expect(get(form.form).name).toEqual('Test'); // 并判断name的限制的值. 注意这里使用`svelte.store.get(form.form).name`
		expect(form.isTainted()).toBe(true); // 表单也污染了, 无参数`检查方法form.isTainted()`
		expect(form.isTainted('name')).toBe(true); // 另外一种检查方法 form.isTainted(fieldname)
		expect(form.isTainted('tags')).toBe(false); // 其他的未被污染

		checkTaint({ tags: ['A'] },{ name: true, tags: {	'0': true } }) // 精准污染

		expect(form.isTainted('tags')).toBe(true);
		expect(form.isTainted('tags[0]')).toBe(true);
		//@ts-expect-error Testing non-existing tainted field
		expect(form.isTainted('non-existing')).toBe(false);
	});

	it('Should be able to check tainted with the tainted store', () => {
		expect(form.isTainted()).toBe(false);
		expect(form.isTainted({ name: true })).toBe(true); // form.isTainted({fieldname: bool})的第三种调用方式.模拟污染状态(dry)
		expect(form.isTainted(undefined)).toBe(false); // 实际上未污染. 因为是dry调用, 测试函数功能

		tainted.set({ name: true });
		expect(form.isTainted(get(tainted))).toBe(true); // 还是第三种方式. 还是dry, 但是用实际参数
		expect(form.isTainted(get(tainted)?.name)).toBe(true); // 第二种调用
	});

	describe('When not tainting', () => {
		it("Should not set field to undefined if field isn't tainted", () => {
			expect(get(tainted)).toBeUndefined();
			checkTaint({ name: 'Test' }, { name: true }); // 污染name
			checkTaint(    // 二次污染
				{ tags: ['A'] },
				{
					name: true,
					tags: {	'0': undefined}
				},
				false // 传递 {tainted: false} 选项, 假设 tags: ['A'] 不是污染, 到最深度?
			);
		});
	});

	describe('Untainting', () => {
		it('Should set untainted field to undefined if field is tainted already', () => {
			expect(get(tainted)).toBeUndefined();
			checkTaint({ name: 'Test' }, { name: true });
			checkTaint({ name: 'Test 2' }, { name: true	}, false);
			checkTaint({ name: 'Test 3' }, { name: undefined}, 'untaint'); // 假装没有, 但是留下了 undefined stub
		});

		it('should set the tainted field to undefined if it gets the same value as its original state', () => {
			expect(get(tainted)).toBeUndefined();
			checkTaint({ name: 'Test' }, { name: true });
			expect(form.isTainted('name')).toBe(true);
			checkTaint({ name: 'Unknown' }, { name: undefined }); // 和原始值相同...!, 那么认为未收到污染, 但是留下stub!
			expect(form.isTainted('name')).toBe(false);
		});
	});
});

describe('Validate', () => {
    // 默认选项会更新错误, 但是不会污染表单
	test('default options should update errors but not taint the form', async () => {
		// 先以不污染的参数去更新form
		form.form.update(
			($form) => {
				$form.score = -1;
				return $form;
			},
			{ taint: false } // 这个参数很重要! 相当于不污染的方式修改了默认值
		);
		expect(form.isTainted()).toBe(false); // 未污染
		expect(await form.validate('score')).toEqual(['Number must be greater than or equal to 0']); // 验证
		expect(get(form.errors).score).toEqual(['Number must be greater than or equal to 0']);// 第二种方式检查
		expect(get(form.form).score).toBe(-1); // 取值, 即使如此. 还是更新了! 注意存放位置 `get(form.form).score`
		expect(form.isTainted()).toBe(false); // 未污染
	});
    // 以错误的值去测试, 不会污染. 和上面的例子不同的是, 这次不提供初始化. 
	test('testing a value should update errors but not taint the form', async () => {
		expect(form.isTainted()).toBe(false); // 初始状态
		expect(await form.validate('score', { value: -10 })).toEqual([
			'Number must be greater than or equal to 0' // 同上
		]);

		expect(get(form.errors).score).toEqual(['Number must be greater than or equal to 0']);
		expect(get(form.form).score).toBe(-10); // 虽然验证失败, 还是更新了form的值
		expect(form.isTainted()).toBe(false); // 但是表单未污染?!
	});

	test('using a custom error should update form errors', async () => {
		expect(await form.validate('score', { errors: 'Score cannot be negative.' })).toBeUndefined();
		form.form.update(
			($form) => {
				$form.score = -1;
				return $form;
			},
			{ taint: false } // 不污染的方式修改了默认值
		);

		const scoreError = 'Score cannot be negative.';
		expect(await form.validate('score', { errors: scoreError })).toEqual([scoreError]);
		expect(get(form.errors).score).toEqual([scoreError]);
	});

	test('if setting a value, the field can be tainted', async () => {
		expect(await form.validate('score', { value: 10, taint: true })).toBeUndefined(); // 注意 taint的参数是真
		expect(get(form.errors).score).toBeUndefined();
		expect(get(form.form).score).toBe(10);
		expect(form.isTainted('score')).toBe(true);
	});

	test('if setting a value, the field can be tainted', async () => {
		expect(await form.validate('score', { value: 10, taint: true })).toBeUndefined();
		expect(get(form.errors).score).toBeUndefined();
		expect(get(form.form).score).toBe(10);
		expect(form.isTainted('score')).toBe(true);
	});
    // 设置错误的值, 只更新值, 而不是错误. 注意选项 `update: 'value'`
	test('setting an invalid value, only updating the value, not the errors', async () => {
		expect(await form.validate('score', { value: -10, update: 'value' })).toEqual([
			'Number must be greater than or equal to 0'
		]);
		expect(get(form.errors).score).toBeUndefined(); // 居然没有错误
		expect(get(form.form).score).toBe(-10);
		expect(form.isTainted('score')).toBe(false);
	});
   // 设置错误的值, 只更新错误, 而不是值 注意选项 ` update: 'errors' `
	test('setting an invalid value, only updating the errors, not the value', async () => {
		expect(await form.validate('score', { value: -10, update: 'errors' })).toEqual([
			'Number must be greater than or equal to 0'
		]);
		expect(get(form.errors).score).toEqual(['Number must be greater than or equal to 0']);
		expect(get(form.form).score).toBe(0);
		expect(form.isTainted('score')).toBe(false);
	});

	test('should return the errors for a form field', async () => {
		form.form.update(($form) => {
			$form.score = -1; // 先更新再说
			return $form;
		});
		expect(await form.validate('name')).toBeUndefined(); // 值验证一个field
		expect(get(form.errors).score).toBeUndefined(); // 还没验证, 所以没有错误
		expect(await form.validate('score')).toEqual(['Number must be greater than or equal to 0']);
		expect(get(form.errors).score).toEqual(['Number must be greater than or equal to 0']);

		expect(await form.validate('score', {value: 'test' as unknown as number	}))
			.toEqual(['Expected number, received string']);

		expect(await form.validate('score', { value: 1 })).toBeUndefined();
		expect((await form.validateForm()).data).toEqual(get(form.form)); // 这个取值路径是一致的. 因为没有验证错误?
	});
});

describe('fieldProxy with superForm', async () => {
	it('should have the taint option', () => {
		const proxy = fieldProxy(form, 'score', { taint: false }); // 字段代理, 注意选项是 不污染
		proxy.set(100);
		expect(get(form.form).score).toBe(100);
		expect(form.isTainted('score')).toBe(false);
		expect(form.isTainted()).toBe(false);
	});
});

describe('Nested data', () => {
	it('should make superForm throw an error if dataType is not "json"', async () => {
		// export const load: PageServerLoad = async () => ({ form: await superValidate(valibot(productSchema))});
		const validated = await superValidate( // 注意这里是 superValidate, 
			zod(z.object({	nested: z.object({ name: z.string() })})) // 内联 一个schema
		);
		expect(() => superForm(validated /*没有提供选项*/)).toThrowError(SuperFormError);
		expect(() => superForm(validated, { dataType: 'json' })).not.toThrowError(SuperFormError); // 可能还有别的选项不会报错
	});
});

describe('Modifying initial data for updating reset', () => {
	it('should reset based on the new data', async () => {
		const validated = await superValidate(zod(z.object({ name: z.string(), number: z.number().positive()}))); //验证模型
		// 数据
		const firstData = { name: '', number: 0 };
		const { form, reset } = superForm(validated); // 表单
		expect(get(form)).toEqual(firstData); // 数据未丢失

		const newData = { name: 'Test', number: 123 };
		form.set(newData);
		expect(get(form)).toEqual(newData); //OK
		reset(); // 重置生效. 从 superForm()解构的函数
		expect(get(form)).toEqual(firstData);

		// Update initial data
		validated.data.name = 'A'; // 可以直接改验证模型
		validated.data.number = 1; // 但是不影响 form. 只有重置的适合, 才会刷新缓存

		expect(get(form)).toEqual(firstData);
		reset();
		expect(get(form)).toEqual({ name: 'A', number: 1 });

		// Set a new reset state
		const newState = { name: 'B', number: 2 };
		reset({ newState }); // 直接以某个值去刷新. 把初始值也刷新了
		expect(get(form)).toEqual(newState);
		reset();
		expect(get(form)).toEqual(newState);
	});
});

describe('FormOptions', () => {
	it('should work with default type parameters', async () => {
		const opts: FormOptions = {	delayMs: 800, dataType: 'json' };
		const validated = await superValidate(zod( z.object({	name: z.string()})));
		const form = superForm(validated, opts);
		const delay: number | undefined = form.options.delayMs; // 传递 options
		expect(delay).toBe(800);
	});
});

describe('Capture', () => {
	it('should replace files with their default value, and empty file arrays', async () => {
		const schema = z.object({
			image: z.instanceof(File, { message: 'Please upload a file.' }).nullable(), // 单文件 没有就是null
			undefImage: z.instanceof(File, { message: 'Please upload a file.' }), // 必需单文件 没有就是undefined
			images: z.instanceof(File, { message: 'Please upload files.' }).array() // 文件数组
		});

		const validated = await superValidate(zod(schema));
		const form = superForm(validated);

		form.form.update(($form) => {
			$form.image = new File(['123123'], 'test.png');
			$form.images = [new File(['123123'], 'test2.png'), new File(['123123'], 'test3.png')];
			$form.undefImage = new File(['123123'], 'test4.png');
			return $form;
		});

		const captured = form.capture(); // 获取. 但是使用缺省值去获取?! 得到的也是默认值
		expect(captured.data).toStrictEqual({ image: null, images: [], undefImage: undefined });
	});
});

///// mockSvelte.ts (must be copy/pasted here) ////////////////////////////////

import { vi } from 'vitest';

vi.mock('svelte', async (original) => {
	const module = (await original()) as Record<string, unknown>;
	return {
		...module,
		onDestroy: vi.fn()
	};
});

vi.mock('$app/stores', async () => {
	const { readable, writable } = await import('svelte/store');

	const getStores = () => ({
		navigating: readable(null),
		page: readable({ url: new URL('http://localhost'), params: {} }),
		session: writable(null),
		updated: readable(false)
	});

	const page: typeof import('$app/stores').page = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		subscribe(fn: any) {
			return getStores().page.subscribe(fn);
		}
	};

	const navigating: typeof import('$app/stores').navigating = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		subscribe(fn: any) {
			return getStores().navigating.subscribe(fn);
		}
	};

	return {
		getStores,
		navigating,
		page
	};
});
```

### 超级解析superValidate
见 https://github.com/ciscoheat/sveltekit-superforms/blob/main/src/tests/superValidate.test.ts#L396
对各个支持的adapters 进行测试