
```ts
'~run'(dataset, config) {
  const input = dataset.value;
  // If root type is valid, check nested types
  if (input && typeof input === 'object') {
	dataset.typed = true; // 理想初始化
	dataset.value = {};
	for (const key in this.entries) { // 遍历键验证
	  const vs = this.entries[key];
	  // 如果 键在输入中, 或者可选(3种情况但是给了默认值), 解析值或默认值
	  if (key in input || (vs.type in ('exact_?optional','?') && vs.default !== undefined)) {

		const value: unknown = key in input ?  input[key] : getDefault(valueSchema);
		const valueDataset = vs['~run']({ value }, config);
		// If there are issues, capture them 有问题捕获问题
		if (valueDataset.issues) {
		  // Create object path item
		  const pathItem: ObjectPathItem = {type: 'object',origin: 'value',key,input,value};
		  // Add modified entry dataset issues to issues
		  for (const issue of valueDataset.issues) {
			issue.path? issue.path.unshift(pathItem) :  issue.path = [pathItem]
			dataset.issues?.push(issue);
		  }
		  if (!dataset.issues) {
			dataset.issues = valueDataset.issues;
		  }
		  // If necessary, abort early. 提前中止, 否则, 会验证所有的keys of object
		  if (config.abortEarly) {
			dataset.typed = false;
			break; 
		  }
		}
		if (!valueDataset.typed) {
			dataset.typed = false; // 传播
		}
		// Add entry to dataset 不管值或者默认值是否合法, 值还是加入到数据集中
		dataset.value[key] = valueDataset.value;
		// Otherwise, if key is missing but has a fallback, use it
	  } else if (valueSchema.fallback !== undefined) { // 没有值, 也没有默认.那么检查 兜底情景
		dataset.value[key] = getFallback(valueSchema);
		// Otherwise, if key is missing and required, add issue
	  } else if (
		valueSchema.type !== 'exact_optional' &&
		valueSchema.type !== 'optional' &&
		valueSchema.type !== 'nullish' // 任何其他定义类型
	  ) {
		_addIssue(this, 'key', dataset, config, {
		  input: undefined,
		  expected: `"${key}"`,
		  path: [{
			  type: 'object',
			  origin: 'key',
			  input: input as Record<string, unknown>,
			  key,
			  value: input[key],
			}],
		});
		// If necessary, abort early
		if (config.abortEarly) {
		  break;
		}
	  }
	}
	// Otherwise, add object issue. 不是object的问题
  } else {
	_addIssue(this, 'type', dataset, config);
  }



  // Return output dataset

  // @ts-expect-error

  return dataset as OutputDataset<

	InferObjectOutput<ObjectEntries>,

	ObjectIssue | InferObjectIssue<ObjectEntries>

>;

},
```