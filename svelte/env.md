## 环境变量基本概念

.svelte-kit/ambient.d.ts 是一个自动生成的类型声明文件，它定义了 SvelteKit 中环境变量的类型和访问方式。你不应该直接编辑这个文件，但它很有用，可以帮助你理解 SvelteKit 中环境变量的工作机制。

## 在 SvelteKit 中使用多个 env 文件

SvelteKit 支持使用多个环境变量文件，主要分为以下几种类型：

1. .env - 基本环境变量文件，所有环境都会加载

2. .env.local - 本地环境变量，不提交到版本控制

3. .env.[mode] - 特定模式的环境变量（如 .env.development、.env.production）

4. .env.[mode].local - 特定模式的本地环境变量

加载优先级从低到高排列：.env → .env.local → .env.[mode] → .env.[mode].local

## 环境变量的访问方式

SvelteKit 提供了四种主要模块来访问环境变量：

1. $env/static/private - 静态构建时注入，仅服务器端可用

2. $env/static/public - 静态构建时注入，以 PUBLIC_ 开头的变量，客户端也可以访问

3. $env/dynamic/private - 运行时获取，仅服务器端可用

4. $env/dynamic/public - 运行时获取，以 PUBLIC_ 开头的变量，客户端也可以访问


# 官方文档
## $env/dynamic/private
- [$env/dynamic/private](https://svelte.dev/docs/kit/$env-dynamic-private)
- 动态私有, 仅在服务端
- 排斥PUBLIC, 私有指定则指定导入

This module provides access to runtime environment variables, as defined by the platform you’re running on. 
For example if you’re using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. 

This module only includes variables that 
_do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) 
_and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).

This module cannot be imported into *client-side* code.
```ts
import { env } from '$env/dynamic/private';
console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
```

> In `dev`, `$env/dynamic` always includes environment variables from ***.env***. 
> In `prod`, this behavior will depend on your adapter.

小结: 
- 公有前缀不导入, 私有前缀? 
- 不会导入到客户端代码中
- 预渲染不可用

## $env/dynamic/public
- [$env/dynamic/public](https://svelte.dev/docs/kit/$env-dynamic-public)
- 动态公有. 服务端->客户端
- 仅导入公有, Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes vars that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env)and can therefore to client
-  双端均用, 网络发请求生可能.可以使用静态 `$env/static/public` 
   Note that public dynamic environment variable*s must all be sent from the server to the client*, causing larger network requests — when possible, use `$env/static/public` instead.

预渲染时不可用.

```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

## $env/static/private
- [$env/static/private](https://svelte.dev/docs/kit/$env-static-private)
- Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. 
- Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module **cannot be imported** into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).

_Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically ***injected*** into your bundle at ***build time***, enabling optimisations 消除无效代码

```ts
import { API_KEY } from '$env/static/private';
```

Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don’t have a value until the app is deployed:

```bash
MY_FEATURE_FLAG=""
```

You can override `.env` values from the command line like so:

```bash
MY_FEATURE_FLAG="enabled" npm run dev
```

## $env/static/public

- [$env/static/public](https://svelte.dev/docs/kit/$env-static-public)

Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore **safely be exposed to client-side code**.

Values are replaced **statically at build** time.

```ts
import { PUBLIC_BASE_URL } from '$env/static/public';
```