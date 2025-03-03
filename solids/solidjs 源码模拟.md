假设我们实现以下功能
```ts
  const [number, setNumber] = createSignal(10,      'signal 1');
  const [string, setString] = createSignal('hello', 'signal 2');
  const [boolean, setBoolean] = createSignal(true,  'signal 3');
  createEffect(function subscriber() {
      mockEffect(number(), string(), boolean())
  }, 'subscriber on 3 signals');
```

迷你源码如下
```ts
// A Dependency of signal has many different Subscribers depending on it. We call it `SignalDependency`
// A particular Subscriber has many Dependencies of signal it depends on, i.e. SignalDependencies
// 补充说明: 在signal之上, 设计了代理对象: signalDependency. 它收集subscriber(to .subs), 后者则在dependencies 建立双向互动关系
//          实现细节: 在回调之前会清空; 在每次回调后, 会被重新收集.

type Subscriber = {
	// 订阅 执行的函数. wrapper of callback func of createEffect
	execute: () => void;
	// 订阅的依赖, 通常是signal对象. 代码实现中实际上是running的集合.
	// running是fn的wrapper. 并通过信号创建器函数的闭包中的本地集合变量addSelf来管理依赖(dependencies).
	dependencies: Set<SignalDependency>; // 依赖. SignalDependencies是信号代理
};

type SignalDependency = {
	subs: Set<Subscriber>; // 订阅者集合. 双向连接(backlinks)
	name?: string; // `信号依赖`名称, 用于调试	
};

export const context: Subscriber[] = []; // 订阅者执行堆栈

function subscribe(running: Subscriber, sigalDependency: SignalDependency) {
	// 技术细节, 设计了双向的backlink
	sigalDependency.subs.add(running); // 收集 subscriber(effect callback wrapper) on this signal
	running.dependencies.add(sigalDependency);
}

export function createSignal(value, name?: string) {
	const sigalDependency = {
		name: `on ${name || typeof value}`,
		subs: new Set<Subscriber>(),
	}; // 存储所有将来的订阅者(subscriber(effect callback wrapper) on signal). 下称`sd`

	const read = () => {
		const running = context[context.length - 1]; // 堆栈上的订阅者(用于和sd挂钩, 在执行(effect cb)之前已清空旧的挂钩backlinks)
		if (running) subscribe(running, sigalDependency); // 挂钩. 增加订阅者~sd的backlink. (所以回调前要清空backlink, 集合避重.)
		return value;
	};

	const write = (nextValue) => {
		value = nextValue;
		for (const sub of [...sigalDependency.subs]) {
			// 遍历信号的subscribers, 并执行其execute方法. (技术细节, 这里是复制,避免遍历可变集合.)
			sub.execute(); // 每一个subscriber都执行以下工作流: 1. 脱钩(清空旧的挂钩) 2.入栈, 3.执行fn(新的挂钩发生), 4.出栈.
		}
	};
	// read 返回当前值, 还负责和堆栈上的订阅者"挂钩". write的责任是更新值, 还通知信号订阅者们执行execute方法.
	return [read, write] as const;
}

function cleanup(running: Subscriber) {
	for (const dep of running.dependencies) {
		dep.subs.delete(running);
	}
	running.dependencies.clear();
}

export function createEffect(fn, name?: string) {
	const execute = () => {
		cleanup(running); // 脱钩(清空旧的挂钩). ...但是刚开始的时候并没有"挂钩".因此是上一个周期的信号-订阅者的links.
		context.push(running); // 订阅者入栈. 在回调周期后弹出. 这样设计支持嵌套createEffect
		try {
			fn(); // fn 通常包含至少1个signal的read. 即挂钩发生时机.
		} finally {
			context.pop();
		}
	};

	const running = {
		execute,
		name,
		dependencies: new Set<SignalDependency>(),
	};

	execute();
}

```

高级用例-单元测试
```ts
import { describe, it, expect, vi } from 'vitest';
import { createSignal, createEffect, context } from './solidjs'; // 根据实际路径调整

describe('createSignal', () => {
	// 测试初始值是否正确返回
	it('should return the initial value', () => {
		const [get, set] = createSignal(10);
		expect(get()).toBe(10); // 预期 get() 返回初始值 10
	});

	// 测试 set 函数是否能正确更新值
	it('should update the value correctly', () => {
		const [get, set] = createSignal(10);
		set(20);
		expect(get()).toBe(20); // 预期 get() 返回更新后的值 20
	});

	// 测试 set 函数是否能处理不同类型的值
	it('should handle different types when updating the value', () => {
		const [get, set] = createSignal(10);
		set('new value');
		expect(get()).toBe('new value'); // 预期 get() 返回更新后的字符串值 'new value'
	});

	// 测试多次调用 set 函数后，get 函数是否返回最新的值
	it('should maintain the updated value after multiple updates', () => {
		const [get, set] = createSignal(10);
		set(20);
		set(30);
		expect(get()).toBe(30); // 预期 get() 返回最新的值 30
	});

	// 测试当 set 函数被调用时，所有订阅的 execute 方法是否被正确调用
	it('should notify subscribers when the value is updated', () => {
		const [get, set] = createSignal(10);
		const mockEffect = vi.fn();
		createEffect(() => {
			mockEffect(get());
		});
		expect(mockEffect).toHaveBeenCalledWith(10); // 初始调用时传递初始值 10
		set(20);
		expect(mockEffect).toHaveBeenCalledWith(20); // 更新值为 20 时调用
	});
	it('should notify subscribers when the values is updated', () => {
		const [number, setNumber] = createSignal(10);
		const [string, setString] = createSignal('hello');
		const [boolean, setBoolean] = createSignal(true);
		const mockEffect = vi.fn();
		createEffect(() => {
			mockEffect(number(), string(), boolean());
		}, 'effect on 3');
		
		createEffect(() => number() === -1 && mockEffect(boolean(), 'effect on number, when -1 also on boolean');
		
		expect(context.length).toBe(0); // 执行完弹出effect running.(请注意, 但在signal中保留了订阅(通过read))
		expect(mockEffect).toHaveBeenCalledTimes(1); // 起始1次. (only 'effect on 3')

		expect(mockEffect).toHaveBeenCalledWith(10, 'hello', true);
		setNumber(-1);
		expect(mockEffect).toHaveBeenCalledTimes(3); // 1 + 2 (all effects)

		expect(mockEffect).toHaveBeenCalledWith(-1, 'hello', true);
		setString('world');
		expect(mockEffect).toHaveBeenCalledWith(-1, 'world', true);
		expect(mockEffect).toHaveBeenCalledTimes(4); // 1 + 2 + 1 (only 'effect on 3' effect)

		setBoolean(false);
		expect(mockEffect).toHaveBeenCalledWith(-1, 'world', false);
		expect(mockEffect).toHaveBeenCalledTimes(6); // 1 + 2 + 2 (all effects)
		expect(context.length).toBe(0); // 确保只有一个正在运行的 effect
	});
});

```

# createComputation
```ts
// Dev
export function devComponent<P, V>(Comp: (props: P) => V, props: P): V {
  const c = createComputation(
    () => // fn
      untrack(() => {
        Object.assign(Comp, { [$DEVCOMP]: true });
        return Comp(props);
      }),
    undefined, // init unknown
    true, // pure: boolean 
    0 // ComputationState = STALE:1 | const STALE = 1;const PENDING = 2;
  ) as DevComponent<P>;
  
  c.props = props;
  c.observers = null;
  c.observerSlots = null;
  c.name = Comp.name;
  c.component = Comp;
  updateComputation(c);
  return (c.tValue !== undefined ? c.tValue : c.value) as V;
}
```