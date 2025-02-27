```ts
type SchemaUnkonwn = BaseSchema<unknown, unknown, BaseIssue<unknown>>
```

# Schemas
schema的经典结构 `KTrar` (*k*ind *t*ype *r*eference *a*sync *~r*un) + `me`(*m*essage?, *e*xpect) + `~standard`
## objects
要使用架构验证对象，可以使用 [`object`](https://valibot.dev/api/object/) 或 [`record`](https://valibot.dev/api/record/)。您可以将 [`object`](https://valibot.dev/api/object/) 用于具有特定形状的对象，将 [`record`](https://valibot.dev/api/record/) 用于具有任意数量的统一条目的对象。

The object schema 会删除未识别*unkown*条目。您可以改用 [`looseObject`](https://valibot.dev/api/looseObject/) 或 [`strictObject`](https://valibot.dev/api/strictObject/) 架构来更改此行为。
类似于对未知事物的三种态度: *吸收*, *忽略*, *排外*.
### 松散结构 looseObject
放进来.
### 严格结构 strictObject
排异反应.
### 未知委托 objectWithRest
再吸收, [`objectWithRest`](https://valibot.dev/api/objectWithRest/) 架构为未知条目定义特定架构。然后，将根据第二个参数的架构验证第一个参数中未定义的任何条目。
#对象键定义矛盾 #对象键迷惑
```ts
import * as v from 'valibot';  
const ObjectSchema = v.objectWithRest(
  {
    key1: v.string(),
    key2: v.number(),
  },
  v.null()
);

type In = v.InferInput<typeof ObjectSchema>;
type Out = v.InferOutput<typeof ObjectSchema>

const data = {key1: 'a', key2: 2, "p": null} as unknown // 改成In 或 Out @ts-expect-error
v.assert(ObjectSchema, data)
v.parse(ObjectSchema, data)
```
### 管道增强验证
#forward_enhanced object schema
使用模式
```ts
// check
v.pipe(v.object({...}), forward(v.check(cb({..destructs}=>boolean) , message), [keyof])
// partialCheck
v.pipe(v.object({...}), forward(v.partialCheck([path of array_or_object][], cb({selects}), message), [keyof])
```
### Record schema
对于具有任意数量的 uniform 条目的对象，[`record`](https://valibot.dev/api/record/) 是正确的选择
```ts
import * as v from 'valibot';
const RecordSchema = v.record(v.string(), v.number()); // Record<string, number>
const RecordSchema? = v.record(v.picklist(['k1', 'k2']), v.number()); // { k1?: number; k2?: number }
// 注意不同 [`record`] 将所有文本键标记为可选。如果要使它们成为必需键，可以改用object + entriesFromList
const RecordSchema$ = v.object(v.entriesFromList(['k1', 'k2'], v.number())); // { k1: number; k2: number }


```
## exactOptional
不允许赋值为undefined
## lazy 
参数 _getter (input: unknown) => TWrapped_
该`getter`函数以惰性调用方式检索架构。这是必要的，通过`getter`函数的第一个参数访问输入，并避免递归架构的循环依赖。
```ts
type LazySchema extends 
   BaseSchema<InferInput<TWrapped>, InferOutput<TWrapped>, InferIssue<TWrapped>>
    type: 'lazy'
    reference: typeof lazy
    expects: unknown,
    getter(input: unknown) => TWrapped`
```
> 由于 TypeScript 的限制，无法推断`递归模式`的输入和输出类型。因此，您必须使用 明确指定这些类型。请参阅下面的示例。
> [`GenericSchema`](https://valibot.dev/api/GenericSchema/), 也就是说 _你需要指定它的类型_
```ts
type BinaryTree = {
  element: string;
  left: BinaryTree | null;
  right: BinaryTree | null;
};

const BinaryTreeSchema: v.GenericSchema<BinaryTree> = v.object({
  element: v.string(),
  left: v.nullable(v.lazy(() => BinaryTreeSchema)),
  right: v.nullable(v.lazy(() => BinaryTreeSchema)),
});

```
适合从函数的*输入输出*来构造schema,如下
```ts
const LazyUnionSchema = v.lazy((input) => {
  if (input && typeof input === 'object' && 'type' in input) {
    switch (input.type) {
      case 'email':
        return v.object({
          type: v.literal('email'),
          email: v.pipe(v.string(), v.email()),
        });
      case 'url':
        return v.object({
          type: v.literal('url'),
          url: v.pipe(v.string(), v.url()),
        });
      case 'date':
        return v.object({
          type: v.literal('date'),
          date: v.pipe(v.string(), v.isoDate()),
        });
    }
  }
  return v.never();
});
type x = v.InferOutput<{  type: "email";  email: string;  } 
		| {  type: "url";  url: string;  } 
		| {  type: "date";  date: string;  }>

```
# Methods
除了 [parse] 和 [safeParse]，[Valibot] 还提供了更多方法来更轻松地使用schema。我们要区分了*schema-m*、*object-m*和*pipeline-m* 三类方法。

*schema-m*方法, 除第一参数未schema之外, 其他参数无统一形式.  而且输出无统一形式. 有的输出schema, 有的则不是.
![心智模型](https://valibot.dev/assets/qQbqZbLX-mental-model-dark.webp)
## schema methods
Schema methods 方法可添加功能、简化`ergonomics`工效学/工程学，并帮助您使用schema 进行验证和数据提取。
工效类
- [`assert`](https://valibot.dev/api/assert/),  --类型守护, 推断类型. 作为*拦路虎*
- [`is`](https://valibot.dev/api/is/),  -- 同上, 但是是作为*predicate*
- [`flatten`](https://valibot.dev/api/flatten/), 参数 issues 泛型参数 schema. 输出issue
- [`getDefault`](https://valibot.dev/api/getDefault/),  辅助函数
- [`getDefaults`](https://valibot.dev/api/getDefaults/), 辅助函数
- [`getFallback`](https://valibot.dev/api/getFallback/), 辅助函数
- [`getFallbacks`](https://valibot.dev/api/getFallbacks/), 辅助函数
解析类, schema的最终作用之一: 解析数据
- [`parse`](https://valibot.dev/api/parse/), 
- [`safeParse`](https://valibot.dev/api/safeParse/), 
加工类, 还是输出 schema
- [`pipe`](https://valibot.dev/api/pipe/), 
- [`unwrap`](https://valibot.dev/api/unwrap/)
- [`config`](https://valibot.dev/api/config/),  模型优化器. 可用配合 pipe 使用
  配置 `Same error message` (优先级低于断点细节)or `abortPipeEarly` for *Pipeline*
	- 快速报告 { abortEarly: true } 用于 parse(schema, config)
	- 通道短路	{ abortPipeEarly: true, uniform_message}

- [`fallback`](https://valibot.dev/api/fallback/),  #永远不会失败 但是`fallback value` 类型不能改. 通常可用 optional + default 解决, 但是前者能处理 #异类型值
变体类, 还是输出schema,但是强烈地面向 TypeScript 的 *utility types*。我们单独列出一类: `object methods`
## object methods
使您可以更轻松地使用*object schema*。它们强烈地面向 TypeScript 的 *utility types*。
- [`partial`](https://valibot.dev/api/partial/),  类似于 `Partial<T>`
```ts
// 这里面的Schema是objectschema
(schema: Schema, keys?: ObjectKeys<Schema>) => {...KTra~r~(st), 'entries': ObjectKeys(schema).map(in ? optional, identity)}
```
- [`pick`](https://valibot.dev/api/pick/),  类似于 `Pick<T>`
- [`keyof`](https://valibot.dev/api/keyof/), 类似于 `keyof` 输出 *PicklistSchema* 其他的都是`Omit<Schema>...&{}`
- [`omit`](https://valibot.dev/api/omit/), 类似于 `Omit<T, 'key'>`
- [`required`](https://valibot.dev/api/required/) 类似于 `Required<T>`
## pipeline methods
值得注意的是 #forword
### forword
```ts
type PartialInput = Record<string, unknown> | ArrayLike<unknown>; 类型很弱 但通过定义函数类型导出 来增强
/**
 * returns a partial check validation action.
 * @param pathList The selected paths.
 * @param requirement The validation function.
 * @param message The error message.
 */
export function partialCheck<
  TInput extends PartialInput, // 支持2种结构, object  和 数组, 它从管道上一个参数推断出.
  const TPathList extends readonly PathKeys<TInput>[], 转化成路径键 const 表明路径 作为 const type, 而不推断
  const TSelection extends DeepPickN<TInput, TPathList>, 深挑选 const 选择 也是 选定了就是 字面量
  const TMessage extends ErrorMessage<PartialCheckIssue<TSelection>> | undefined, # 深挑选检查异常. 检查也是字面量
>(
  // partialCheck 作为管道的参数, 它已经得到此函数的输入 TInput 比如 登录模型
  pathList: TPathList, // TPathList 用于推断  登录模型的路径 并作为字面量存储.
  requirement: (input: TSelection) => boolean,
  message: TMessage
): PartialCheckAction<TInput, TPathList, TSelection, TMessage>;
// Extracts tuples with path keys.
export function partialCheck(
  pathList: PathKeys<PartialInput>[],
  requirement: (input: PartialInput) => boolean,
  message?: ErrorMessage<PartialCheckIssue<PartialInput>>
): PartialCheckAction<PartialInput, PathKeys<PartialInput>[], PartialInput, ErrorMessage<Issue> | undefined > {

  return {
    kind: 'validation',
    pathList,
    requirement,
    message,
    '~run'(dataset, config) {
        if (_isPartiallyTyped(dataset, pathList) && !this.requirement(dataset.value)) {
           // 发生问题. 路径检查合法, 但是不满足回调要求
	    }
        return dataset;
    },
  };
}
```
#经典应用, 检查password 和 password_confirm
#nest #form #path #pathlist
```ts
import * as v from 'valibot';

const RegisterSchema = v.pipe(
  v.object({
    array: v.array(v.boolean()),
    object: v.object({k: v.string()}),
    password1: v.pipe(
      v.string(),
      v.minLength(8, 'Your password must have 8 characters or more.')
    ),
    password2: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['password1'], ['password2'], ['array', 0], ['object', 'k']], // 路径. 如果是check,则无路径.只有根
      (input) => input.password1 === input.password2, // requirements
      'The two passwords do not match.'
    ),
    ['password2']
  )
);
 
(parameter) input: {p1: string;  p2: string;  array: boolean[];  object: {  k: string;  }}
```

# Actions
Action 作为 `pipelines`的参数存在
![心智模型](https://valibot.dev/assets/qQbqZbLX-mental-model-dark.webp)

注意这个心智模型中, action的位置, 它是method的第2+个参数s, 每个action的参数也和schema一样, 无特定的形式, 典型的结构
`KTrar` + m?e + req
## 检查类
### check
```ts
const UsernameSchema = v.pipe(v.string(), v.check(isValidUsername, 'This username is invalid.') );
```

## Transformations
### 标准的
- [`brand`](https://valibot.dev/api/brand/), 
- [`filterItems`](https://valibot.dev/api/filterItems/), 
- [`findItem`](https://valibot.dev/api/findItem/), 
- [`mapItems`](https://valibot.dev/api/mapItems/), 
- [`rawTransform`](https://valibot.dev/api/rawTransform/), 
- [`readonly`](https://valibot.dev/api/readonly/), 
- [`reduceItems`](https://valibot.dev/api/reduceItems/), 
- [`sortItems`](https://valibot.dev/api/sortItems/), 
- [`toLowerCase`](https://valibot.dev/api/toLowerCase/), 
- [`toMaxValue`](https://valibot.dev/api/toMaxValue/), 
- [`toMinValue`](https://valibot.dev/api/toMinValue/), 
- [`toUpperCase`](https://valibot.dev/api/toUpperCase/), 
- [`transform`](https://valibot.dev/api/transform/),  #自定义函数
- [`trim`](https://valibot.dev/api/trim/), 
- [`trimEnd`](https://valibot.dev/api/trimEnd/), 
- [`trimStart`](https://valibot.dev/api/trimStart/)
### 自定义
_v.pipe(..., v.transform(callback))_

管道转换属于功能性`Action`
  允许更改输入数据的值和数据类型
- 处理数据: 删除字符串开头或结尾的空格或强制最小值或最大值。
- 类型转化

## MetaData
metadata 通常不能作为 *message*
#### [`description`](https://valibot.dev/api/description/)
#### [`metadata`](https://valibot.dev/api/metadata/)
#### [`title`](https://valibot.dev/api/title/)

# 数据解析
## parse
## safeParse

# 类型推导
## v.InferInput 
适合`typing`前端输入
## v.inferOutput
适合`typing` API得到的后端模型
## v.InferIssue
类似于 ExceptionThrows[number]
