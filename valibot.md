schema
```json
{
    kind: 'schema',
    type: 'string',
    reference: string,
    expects: 'string',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (typeof dataset.value === 'string') {
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as OutputDataset<string, StringIssue>;
    }
  }
```
schema  [string, number, boolean?, ...] 包含~standard 和 ~run, 产出 issue, 不产出异常.
调用形式
```ts
schema(...args_for_schema,expect/message/default)
```
action = argsAsync(schema) 包含 kind, type,reference, async _KTrar_ + _~sme_
action 是一种转换 transformation types = `args` _KTrar_ + schema
action 也有 [~run]
```ts
const dataset = action['~run']({ typed: boolean, value: arg_to_schema }, {});
```
argsAsync
```ts
// 调用
const func = dataset.value; // 前置参数, 通常是函数
dataset.value =  async (...args)// action ~run的时候, 数据集的值被修改
{
    // 这里面的 schema就是 args(schema)的 schema, 即参数. 功能是验证
	const argsDataset = await schema['~run']({ value: args }, config);
	return func(...argsDataset.value);
}
function argsAsync<Input extends () => unknown, TSchema extends Schema>
		(schema: TSchema): ArgsActionAsync<Input, TSchema>;

function argsAsync(schema: Schema): ArgsActionAsync<...见上> {
  return {
    kind: 'transformation',
    type: 'args',
    reference: argsAsync,
    async: false,
    schema,
    '~run'(dataset, config) {
      const func = dataset.value;
      dataset.value = async (...args) => {
        const argsDataset = await schema['~run']({ value: args }, config);
        if (argsDataset.issues) {
          throw new ValiError(argsDataset.issues);
        }
        return func(...argsDataset.value);
      };
      return dataset as SuccessDataset<() => Promise<unknown>>;
    },
  };
}
```