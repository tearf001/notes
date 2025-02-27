# monorepo
除了turbo 来自 vercel, 还有lerna
# 代码组织
## 子包之间如何互相引用

1. **通过包名引用**：    
    - 在子包的 `package.json` 中，将其他子包作为依赖项，例如：
        `"dependencies": {   "solid-js": "workspace:*" }`
        
    - `workspace:*` 表示引用当前 Monorepo 中的最新版本。
2. **软链接机制**：    
    - `pnpm` 或 `yarn` 会在根目录的 `node_modules` 中创建软链接，指向子包的源码目录。
    - 这样，子包之间的引用就像引用外部 npm 包一样，但实际上是在本地直接引用。
3. **避免循环依赖**：    
    - Monorepo 工具会检测子包之间的依赖关系，避免出现循环依赖。

---

## 根和子包的项目管理文件如何协作

1. **根目录的 `pnpm-workspace.yaml`**：    
    - 定义所有子包的位置，例如：                
        `packages:   - "packages/*"`        
    - 告诉 `pnpm` 哪些目录是子包。
2. **根目录的 `turbo.json`**：    
    - 定义构建、测试和发布的流程，例如：        
        ```json
	{
		"pipeline": {
		    "build": {
		      "dependsOn": ["^build"]
		    },
		    "test": {
		      "dependsOn": ["^build"]
		    }
		}
	}
   ```
    - `dependsOn` 表示任务之间的依赖关系，`^build` 表示先构建依赖的子包。
3. **子包的 `package.json`**：    
    - 每个子包有自己的 `package.json`，定义其依赖、脚本和入口文件。
    - 通过 `workspace:*` 引用其他子包。
4. **根目录的 `package.json`**：    
    - 定义全局脚本和配置，例如：
	```json
	{
	  "scripts": {
	    "build": "turbo run build",
	    "test": "turbo run test"
	  }
	}
	```        
    - 通过 `turbo` 运行所有子包的构建或测试任务。

---

# SolidJS 的具体实现

5. **`pnpm-workspace.yaml`**：
    - 定义了 `packages/` 目录下的所有子包。
6. **`turbo.json`**：
    - 配置了构建和测试的流程，确保子包之间的依赖关系正确。
7. **子包的 `package.json`**：
    - 每个子包（如 `solid-js`）通过 `workspace:*` 引用其他子包。

---
# 如何调度
turbo run build --parallel
## **执行特定子包的任务**

如果只想运行某个子包的任务，可以使用 `pnpm` 的 `--filter` 参数。
#### 示例：
```bash
pnpm --filter solid-js build
pnpm --filter solid-js test
pnpm --filter solid-js dev
```
