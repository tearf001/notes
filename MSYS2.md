# c 语言 和 node-gyp
>node-gyp 是什么为什么安装的时候去查询 gcc编译器? windows平台是找VS

node-gyp 是一个 Node.js 的原生模块构建工具，它的
## node-gyp主要作用

1. **编译原生插件 (Native Addons)：** Node.js 生态中有很多包依赖于 C/C++ 代码，这些代码需要编译成 .node 文件（Windows 上是 .dll，类 Unix 系统是 .so）才能被 Node.js 加载和使用。node-gyp 就是负责这个编译过程的。
2. **跨平台构建：** node-gyp 抽象了不同操作系统编译***工具链差异***。开发者只需要编写一份***构建配置***（通常是 ***binding.gyp*** 文件），node-gyp 就能在不同平台上调用相应的编译器和构建工具来生成可用的原生模块。它需要一个 C/C++ 编译器。
	- **Linux/macOS:** 通常使用 gcc 或 clang 作为编译器。
	- **Windows:** 通常使用 Visual Studio 的构建工具 (Build Tools) 或者 MinGW。
## 解析路径
node-gyp 在安装或构建原生模块时，会尝试自动检测系统上已安装的编译器。它会按照一定的优先级顺序去查找：
1. **Visual Studio (Windows 首选)：** 在 Windows 上，node-gyp 优先寻找 Visual Studio 的构建工具。这是因为很多 Node.js 原生模块的开发者更习惯使用 Visual Studio 进行开发和测试，而且 Visual Studio 通常能提供更好的兼容性和性能。
2. **MinGW (备选)：** 如果找不到 Visual Studio，node-gyp 可能 会尝试寻找 MinGW。但 MinGW 的支持并不是 node-gyp 的首要目标，可能会遇到一些兼容性问题。
    
**你遇到的情况（安装了 MinGW64，但 node-gyp 查找 VS）：**

这是很常见的。原因如下：

- **优先级：** 如上所述，node-gyp 在 Windows 上默认优先查找 Visual Studio。
- **环境变量：** node-gyp 主要通过***环境变量***来确定使用哪个编译器。如果你没有正确配置 MinGW64 的环境变量，或者 Visual Studio 的环境变量优先级更高，node-gyp 就可能找不到 MinGW64。
- **binding.gyp 配置：** 有些原生模块的` binding.gyp` 文件可能明确指定了要使用 Visual Studio，这种情况下即使你安装了 MinGW64，node-gyp 也会按照 binding.gyp 的指示去查找 Visual Studio。

**如何让 node-gyp 使用 MinGW64：**

有几种方法可以尝试：

1. **设置环境变量 (推荐)：**
    - 确保 MinGW64 的 bin 目录（例如 C:\MinGW64\bin）已添加到系统的 PATH 环境变量中。
    - 设置 VCTargetsPath 环境变量（如果存在的话）为空，或者删除它。这个变量通常指向 Visual Studio 的构建工具路径。
    - 设置 GYP_MSVS_VERSION 环境变量为 2015 或更高版本(仅仅告诉gyp, 不是真的安装了vs)。 或者, 更好的办法是, 设置它为空: GYP_MSVS_VERSION=""
    - 设置以下环境变量来***强制指定***编译器和链接器：
        ```
        set CC=C:\MinGW64\bin\gcc.exe
        set CXX=C:\MinGW64\bin\g++.exe
        set LINK=C:\MinGW64\bin\g++.exe  (或者 windres.exe, 如果你需要资源文件)
        ```
    
    - 在某些情况你可能还需要`npm config set msvs_version 2017`
        
2. **使用 --dist-url 和 --target 参数：**
    
    在执行 npm install 或 node-gyp configure/build 时，可以使用这些参数来指定 Node.js 的头文件和目标版本。这有助于 node-gyp 找到正确的编译环境。例如：
    ```bash
    npm install --dist-url=https://nodejs.org/download/release --target=16.13.0  # 替换为你的 Node.js 版本
    ```
    
3. **使用--msvs_version=xxxx**
    在执行node-gyp configure或npm install的时候，可以设置--msvs_version=xxxx选项. 虽然这是告诉node-gyp模拟一个vs的版本, 但是实际上还是可以使用mingw的. 比如--msvs_version=2017.
    
4. **全局配置 npm (不太推荐，除非你确定总是使用 MinGW64)：**
    ```
    npm config set msvs_version 2015 --global  # 或更高版本，只要不是你的真实 VS 版本
    npm config set python python2.7 --global    # 如果你有多个 Python 版本
    ```
    注意：msvs_version 的版本号只需要比你已经安装的vs版本低就可以，主要是规避node-gyp去寻找vs
    
5. **修改binding.gyp文件 (不建议， 除非迫不得已)**.  
    打开binding.gyp文件, 查看是否有指定vs相关的配置  
    如果有, 删除或者修改相关配置

**强烈建议的步骤：**
1. **优先尝试方法 1（设置环境变量）：** 这是最灵活、最可靠的方法，因为它不会影响全局 npm 配置，也不会修改项目本身的 binding.gyp 文件。
2. **如果方法 1 不起作用，尝试方法 2（--dist-url 和 --target）：** 这可以解决一些由于 Node.js 版本和头文件不匹配导致的问题。
3. **万不得已才考虑方法 3 和 4**

**重要提示：**

- **确保 MinGW64 已正确安装：** 检查 MinGW64 的 bin 目录是否包含 gcc.exe、g++.exe、make.exe 等必要的可执行文件。
- **重新打开命令行窗口：** 在修改环境变量后，需要重新打开一个新的命令行窗口，以确保新的环境变量生效。
- **查看错误日志：** 如果 node-gyp 仍然无法使用 MinGW64，仔细查看错误日志，它通常会提供有关问题的更多信息。

# MSYS2 在 windows平台的意义
它是作为子系统那样存在吗? **MSYS2 的核心目标：提供一个*类 Unix 环境***

MSYS2 的主要目的是在 Windows 上创建一个类似于 Unix/Linux 的开发环境，让你能够在 Windows 上使用许多在 Linux 上常见的开发工具和 shell 命令（如 bash, gcc, make, git, vim 等），而*无需安装完整*的虚拟机或使用 ***WSL*** (Windows Subsystem for Linux)。

## **MSYS2 的组成部分：**

MSYS2 主要由以下几个部分组成：

1. **MSYS2 环境 (msys2):**
    - 这是一个最小化的 Unix 环境，基于 Cygwin（一个更老牌的类似项目）的一个分支。
    - 它提供了基本的 shell (bash)、核心工具 (coreutils, grep, find 等)，以及一个包管理器 pacman。
    - MSYS2 环境主要用于管理和维护 MinGW 环境，以及运行一些不依赖于特定 Windows API 的 Unix 工具。
2. **MinGW-w64 环境 (mingw32, mingw64, ucrt64, clang64 等):**
    - 这些是 MSYS2 提供的不同版本的 MinGW-w64 工具链。
    - MinGW-w64 是一个 Windows 上的 GCC 移植版，它可以编译生成原生的 Windows 可执行程序（.exe 和 .dll），这些程序不依赖于 MSYS2 (msys-2.0.dll)或 Cygwin ( cygwin1.dll)的运行时环境 。
    - 不同的 MinGW-w64 环境 (***mingw32, mingw64, ucrt64, clang64***) 提供了不同的**编译器**、**C 运行时库**和**目标平台**：
		- mingw32: **32 位 *GCC*, 使用 *MSVCRT*** (旧的 Microsoft C 运行时库)
		- mingw64: **64** 位 ***GCC***, 使用 ***MSVCRT***
		- ucrt64: 64 位 **GCC**, 使用 ***UCRT*** (Universal C Runtime, Windows 10 及更高版本)
		- clang64: 64 位 Clang, 使用 ***UCRT***
3. **Pacman 包管理器:**
    - MSYS2 使用 Arch Linux 的 pacman 包管理器，这使得安装、更新和管理软件包变得非常方便。
    - 你可以使用 pacman 安装各种开发工具、库、编辑器等。

## MSYS2与WSL
MSYS2与WSL（Windows Subsystem for Linux）的运行方式显著不同：

- **MSYS2：**
    - MSYS2 提供的 MinGW-w64 编译的程序 是 原生 的 Windows (***MSVCRT***)程序。它们直接调用 Windows API，不依赖于任何额外的运行时环境（除了标准的 Windows DLL）。
    - MSYS2 提供的 ***shell*** 和工具 (bash, ls, grep 等) 是通过一个***特殊的运行时库*** (msys-2.0.dll) 来模拟 POSIX API 的。这个运行时库将 POSIX ***调用转换***为 Windows API 调用。
    - MSYS2 不 是一个完整的操作系统，它只是提供了一个模拟层。它***不运行*** Linux 内核。
- **WSL：**
    - WSL 1 是通过一个翻译层将 Linux 系统调用转换为 Windows NT 内核调用。
    - WSL 2 是一个真正的轻量级虚拟机，运行一个完整的 Linux 内核。
    - WSL 提供的环境更接近于一个完整的 Linux 发行版。

### MSYS2 在 Windows 上的存在方式

1. **不是子系统：** MSYS2 不是像 WSL 那样的子系统。它不运行独立的内核，而是通过运行时库和原生编译工具来提供类 Unix 环境。
2. **提供原生编译工具：** MSYS2 的***核心价值***在于它提供的 MinGWx 工具链。这些工具链可以编译生成***不依赖***于 MSYS2 运行时的原生 WIN 程序。
3. **提供类 Unix 开发环境：** MSYS2的工具集（bash, coreutils, pacman 等）为 Windows 开发者提供了一个熟悉的、类似 Linux 的开发环境。


**MSYS2 的典型用途：**
- **跨平台开发：** 使用 MSYS2 的 MinGW-w64 工具链，可以方便地为 Windows 编译那些原本为 Linux/Unix 设计的 C/C++ 程序。
- **Windows 原生程序开发：** 如果你更喜欢使用 GCC 和类 Unix 工具链，而不是 Visual Studio，MSYS2 可以提供一个完整的开发环境。
- **学习 Unix 工具和 shell 脚本：** MSYS2 提供了一个在 Windows 上学习和使用 bash、grep、awk、sed 等工具的便捷环境。
- **运行一些需要 POSIX 环境的工具：** 某些开源工具可能依赖于 POSIX API，MSYS2 的运行时可以提供这些 API 的模拟。

MSYS2在 Windows 上架起了一座通往 Unix/Linux ***开发世界的桥梁***，同时又保持了对 Windows 原生程序开发的支持。

### MSYS2 bash 的环境变量行为

1. **部分继承：** MSYS2 的 bash 启动时会继承一部分 Windows 环境变量，但 不是全部。它会进行一些***过滤和转换***。
2. **路径转换 (PATH)：** 最关键的区别之一。例如 `C:\` 转换为 Unix 样式的路径`/c/`为了让 Unix 工具能够正确地找到 Windows 程序。
3. **MSYS2 特有变量：** MSYS2 会设置一些它自己特有的环境变量，例如 MSYSTEM、MSYS2_PATH_TYPE 等，这些变量控制着 MSYS2 的行为。
4. **MSYS2_PATH_TYPE 的影响：** 这个环境变量控制着 MSYS2 如何处理 PATH 变量：
    - inherit (默认): 继承并转换 Windows 的 PATH。
    - none: 不继承 Windows 的 PATH，只使用 MSYS2 自己的 PATH。
    - minimal: 仅继承一些关键的 Windows 路径。
5. **Shell 配置文件：** MSYS2 的 bash **会读取它自己的*配置文件***（例如 ~/.bashrc、~/.bash_profile、/etc/profile），影响环境变量。
	```
	Shell 启动
	├── 登录 Shell (Login Shell)
	│   ├── 检查 ~/.bash_profile
	│   │   ├── 存在: 执行 ~/.bash_profile
	│   │   │   └── (通常在 ~/.bash_profile 中会包含 source ~/.bashrc)
	│   │   └── 不存在: 检查 ~/.profile
	│   │       └── 存在: 执行 ~/.profile
	│   └── 设置全局环境变量等
	└── 非登录的交互式 Shell (Interactive Non-login Shell)
	    └── 执行 ~/.bashrc
	        └── 设置别名、函数、提示符等
	```

**为什么会产生 WSL 的错觉：**

- **Unix 风格的路径：** MSYS2 将 Windows 路径转换为 Unix 风格（/c/Users/...），这与 WSL 中的路径表示方式非常相似。
- **独立的 shell 环境：** MSYS2 的 bash 运行在一个相对独立的环境中，它有自己的根目录 (/)，自己的 /etc、/home 等目录
- **不完全继承 Windows 变量：** 由于 MSYS2 对 Windows 环境变量的过滤和转换，有些 Windows 变量可能在 MSYS2 的 bash 中不可见
    

### MSYS2 bash 与 WSL 的区别

|                   |                                                                                        |                                                                              |
| ----------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 特性                | MSYS2 bash                                                                             | WSL                                                                          |
| **内核**            | 不运行 Linux 内核，使用 msys-2.0.dll 模拟 POSIX API                                              | WSL 1 使用翻译层，WSL 2 运行真正的 Linux 内核                                             |
| **文件系统**          | 使用 Windows 文件系统，通过***路径转换***提供 Unix 风格的***视图***。根目录 / 映射到 MSYS2 的安装目录。                 | WSL 1 使用 Windows 文件系统，但***有自己的元数据***。WSL 2 有自己的虚拟硬盘 (vhdx)，文件系统与 Windows 隔离。 |
| **环境变量**          | 部分继承 Windows 环境变量，进行***过滤和转换***。                                                       | 默认情况下，WSL 有自己的环境变量，可以通过***配置进行互通***。                                         |
| **程序执行**          | MinGW-w64 编译的程序是原生 Windows 程序，直接调用 Windows API。MSYS2 工具通过 ***msys-2.0.dll 模拟*** POSIX。 | 运行 Linux ELF 二进制文件。                                                          |
| **与 Windows 互操作** | MinGW-w64 程序与 Windows 程序完全兼容。MSYS2 工具通过路径转换可以调用 Windows 程序。                            | 可以通过 wsl.exe 与 Windows 互操作，例如启动 Windows 程序、访问 Windows 文件系统。WSL 2 的互操作性更好。    |
| **性能**            | MinGW-w64 程序性能与原生 Windows 程序相当。MSYS2 工具由于有模拟层，性能略低。                                    | WSL 1 的文件 I/O 性能较差。WSL 2 的性能接近原生 Linux。                                      |
| **适用场景**          | 编译跨平台 C/C++ 程序，Windows 原生程序开发（使用 GCC），使用 Unix 工具，运行需要 POSIX 环境的工具。                     | 运行 Linux 发行版，进行 Linux 开发，使用 Linux 工具链，运行 Linux 服务器程序。                        |

**如何避免混淆：**
1. **检查环境变量：** 使用 echo $PATH 查看 MSYS2 的 PATH 变量，使用 printenv 查看所有环境变量。
2. **明确你要做什么：**    
    - 如果你要编译原生 Windows 程序，使用 ***MinGW-w64 环境*** (mingw32, mingw64, ucrt64, clang64)。        
    - 如果你要使用 MSYS2 的工具或运行需要 POSIX 环境的程序，使用 MSYS2 环境 (msys2)。        
    - 如果你需要一个完整的 Linux 环境，使用 WSL。
3. **使用正确的 shell：**
    - 如果你要与 Windows 交互，或者运行 Windows 命令，使用 Windows 命令提示符 (cmd.exe) 或 PowerShell。
    - 如果你要在 MSYS2 环境中工作，使用 MSYS2 提供的 mintty 终端和 bash。

# 那么如何在msys2上使用node-gyp?

在 MSYS2 上使用 node-gyp，你需要根据你的目标选择合适的 MSYS2 环境，并进行一些配置。以下是详细步骤和注意事项：

## **1. 选择合适的 MSYS2 环境：**

- **目标是编译原生 Windows 模块：**
    - 你应该使用 MinGW-w64 环境（mingw32、mingw64、ucrt64 或 clang64），而***不是 MSYS2 环境*** (msys2)。这是因为 node-gyp 编译出的 .node 文件（或 .dll）是原生的 Windows 模块，应该使用 ***MinGW-w64*** 编译。
    - 通常情况下，mingw64 是最常见的选择，除非你有特殊需求（例如需要 32 位模块、UCRT 或 Clang）。
        
- **目标是编译在 MSYS2 环境中运行的模块（极少见）：**
    - 如果你确实需要编译一个只能在 MSYS2 环境中运行的模块（而不是作为 Node.js 的原生插件），那么你可以使用 MSYS2 环境 (msys2)。但这种情况非常罕见，通常你不需要这样做。

## **2. 安装必要的软件包：**

在相应的 MSYS2 环境中（例如 mingw64），使用 pacman 安装以下软件包：
```
pacman -S --needed --noconfirm mingw-w64-x86_64-gcc  # 如果是 mingw64 环境
pacman -S --needed --noconfirm mingw-w64-x86_64-make # 或者 mingw-w64-i686-make (32位)
pacman -S --needed --noconfirm mingw-w64-x86_64-python3 #或者mingw-w64-i686-python (32位)
pacman -S --needed --noconfirm mingw-w64-x86_64-pkg-config # 有些模块可能需要
```

- mingw-w64-x86_64-gcc: MinGW-w***64 GCC 编译器***（64 位）。如果是 32 位环境，使用 mingw-w64-i686-gcc。
- mingw-w64-x86_64-make: GNU Make 构建工具。
- mingw-w64-x86_64-python3: Python 3（node-gyp 依赖于 Python）。 
  确保安装与你的 Node.js 架构匹配的 Python 版本（64 位 Node.js 使用 64 位 Python，32 位 Node.js 使用 32 位 Python）。
- mingw-w64-x86_64-pkg-config: 一些原生模块可能需要 pkg-config 来查找依赖的库。
    

## **3. 安装 / 配置Node.js：**

有几种方法可以在 MSYS2 中安装 Node.js：
- **方法一：使用 MSYS2 的包管理器 (推荐)：这种方法最简单，而且 pacman 会自动处理依赖关系。**
    ```bash
    pacman -S --needed --noconfirm mingw-w64-x86_64-nodejs
    # 32位 pacman -S --needed --noconfirm mingw-w64-i686-nodejs 
    ```
- **方法二：从 Node.js 官网下载 Windows 安装包：**
    - 从 [Node.js 官网](https://www.google.com/url?sa=E&q=https%3A%2F%2Fnodejs.org%2F) 下载 Windows 安装包 (.msi)。
    - 确保 Node.js 的安装目录已添加到 MSYS2 的 PATH 环境变量中。你可能需要手动编辑 MSYS2 的 shell 配置文件来添加：
	```
	export PATH="/c/Program Files/nodejs:$PATH"  # 替换为你的 Node.js 安装路径
	```
- **方法三: node版本管理工具.

**验证安装：**
打开 MinGW64 终端（不是 MSYS2 终端），运行以下命令：

```
node -v
npm -v
gcc -v
g++ -v
make -v
python3 --version # 或者 python --version, 取决于你安装的 Python 版
```


##  安装 node-gyp：**

```
npm install -g node-gyp
```
测试 `node-gyp -v`
创建一个简单的 Node.js 原生模块项目（例如，使用 node-addon-api），然后尝试编译它：
```
# 进入你的项目目录
node-gyp configure
node-gyp build
```

如果一切正常，node-gyp 应该能够成功编译你的模块。

**常见问题和解决方法：**

- **找不到 Python：**
    
    - 确保你已安装了正确版本的 Python（32 位或 64 位，与你的 Node.js 匹配）。
        
    - 确保 Python 的安装目录已添加到 MSYS2 的 PATH 环境变量中。
        
    - 你可以尝试设置 npm config set python /path/to/python.exe 来明确指定 Python 的路径。
        
- **找不到编译器 (gcc/g++)：**
    
    - 确保你已安装了 MinGW-w64 GCC（mingw-w64-x86_64-gcc 或 mingw-w64-i686-gcc）。
        
    - 确保 MinGW-w64 的 bin 目录已添加到 MSYS2 的 PATH 环境变量中。
        
- **链接错误：**
    
    - 一些原生模块可能需要额外的库。使用 pacman 安装这些库（例如 mingw-w64-x86_64-openssl）。
        
    - 如果链接器找不到某些库，你可能需要在 binding.gyp 文件中添加库的路径。
        
- **node-gyp 仍然尝试使用 Visual Studio：**
    
    - 确保你没有设置 VCTargetsPath 环境变量。
    - 可以尝试设置 npm config set msvs_version 2017 （或一个较低的版本号，只要不是你实际安装的 VS 版本）。
    - 最可靠的方法是设置环境变量：
        ```
        export CC=/mingw64/bin/gcc  # 或 /mingw32/bin/gcc
        export CXX=/mingw64/bin/g++  # 或 /mingw32/bin/g++
        ```
        
        

## 总结
在 MSYS2 上使用 node-gyp 的关键是
1. 使用 MinGW-w64 环境 (mingw32/mingw64/ucrt64/clang64)。
2. 安装正确的软件包（GCC、Make、Python）。
3. 确保 Node.js 和 MinGW-w64 的 bin 目录已添加到 MSYS2 的 PATH 环境变量中。
4. 根据需要配置 node-gyp（例如，设置 Python 路径、MSVS 版本等）。

# MSYS2会污染吗

你提出的问题非常好，这正是理解 MSYS2 的关键所在。让我来详细解释一下：

**1. 为什么 MSYS2 有自己的包管理器（pacman）？**

- **隔离性：** MSYS2 的主要目标之一是提供一个 隔离 的开发环境。这意味着 MSYS2 的***工具、库和软件包***应该与 Windows 系统隔离。使用 pacman 管理的软件包都安装在 ***MSYS2 自己的目录结构***中，不会影响 Windows 的*系统目录或注册表。*
- **依赖管理：** 许多 Unix 工具和库之间存在复杂的依赖关系。pacman 可以解决这些依赖关系.求提供一个一致的、***可预测***的开发环境

**2. 为什么 MSYS2 有特定版本的 Node.js 和 Python？**

- **兼容性：** MSYS2 提供的 Node.js 和 Python 版本是经过测试的，确保它们能够在 MSYS2 环境中正常工作。这些版本可能与你在 Windows 系统上安装的版本不同。
    - 对于 Python，这一点尤其重要，因为 node-gyp 对 Python 的版本有特定要求（通常是 Python 3）。
    - MSYS2 提供的 Node.js 版本通常也会包含一些针对 MSYS2 环境的补丁或配置。

- **隔离性（再次强调）：** 使用 MSYS2 自己的 Node.js 和 Python 版本可以避免与 Windows 系统上的其他版本发生冲突。例如，如果你在 Windows 上安装了 Python 2，而在 MSYS2 中需要 Python 3，使用 MSYS2 的 pacman 安装 Python 3 就不会影响 Windows 上的 Python 2。
    

**3. MSYS2 安装的软件包会污染 Windows 环境吗？**

- **通常不会。** MSYS2 的设计理念就是尽量减少对 Windows 环境的影响。
    - MSYS2 的软件包都安装在 MSYS2 自己的目录结构中（例如 /usr/bin、/usr/lib 等），不会覆盖或修改 Windows 系统文件。
    - MSYS2 的环境变量修改通常只在 MSYS2 的 shell 中生效，不会影响 Windows 的命令提示符或 PowerShell。
    - 只有当你手动将 MSYS2 的 ***bin 目录添加到 Windows 的 PATH 环境变量***中时，MSYS2 的工具才会在 Windows 的命令提示符或 PowerShell 中可用。但即使这样，MSYS2 的工具也不会覆盖或替换 Windows 的系统工具。

**4. MSYS2 的软件包通常安装在哪里？**

- MSYS2 的所有文件都安装在 MSYS2 的安装目录下。默认情况下，这个目录是 C:\msys64
- 在这个目录下，你会看到一个类似 Unix 的目录结构：
```bash
	/  #  MSYS2 的根目录
	- /usr/bin # MSYS2 的可执行文件（例如 bash.exe、gcc.exe、ls.exe 等）
	- /usr/lib # MSYS2 的库文件
	- /etc #  MSYS2 的配置文件
	- /home # MSYS2 的用户主目录
	- /mingw64 # MinGW-w64 (64 位) 环境的目录
	- /mingw32 # MinGW-w64 (32 位) 环境的目录
	- /var # 存放临时文件、日志等
```
    注意：当你使用 MinGW-w64 环境时，它的根目录实际上是 /mingw64（或 /mingw32），而不是 MSYS2 的根目录 /。

# 沉浸式体验
那么windows如何进入 "沉浸式" 体验呢, MSYS2我现在知之甚少, 安装之后程序组中出现了4个快捷方式 MSYS2 CLANG64, MSYS2 MINGW64,MSYS2 MSYS,MSYS2 UCRT64, 他们有什么不同? 我在windows vscode下面的终端刚开始看不到 Msys2下面的/usr/bin/bash.exe, 但是我可以增加它的profile. 因为vscode检测到了它, 显然bash是MSYS2下的终端, 我有几个问题, vscode中的终端选项是怎么来的? profile在这里是什么意思?还有哪些容易混淆?
 

好的，我们来逐一解答你的问题，并深入探讨如何在 Windows 上获得更“沉浸式”的 MSYS2 体验。

## MSYS2 的四个快捷方式

这四个快捷方式代表了 MSYS2 提供的四个不同的开发环境：

- **MSYS2 MSYS: 🟪
    - 这是 MSYS2 的基础环境，主要用于 MSYS2 本身的维护和管理，以及运行一些不依赖于特定 Windows API 的 Unix 工具。
    - 它使用 ***msys-2.0.dll 来模拟 POSIX API。***
    - 通常情况下，你不应该在这个环境中进行 Node.js 原生模块的开发。
- **MSYS2 MinGW64:📘
    - 这是最常用的环境，用于编译 64 位的原生 Windows 程序
    - 它使用 MinGW-w64 GCC 编译器，链接 MSVCRT (Microsoft Visual C++ Runtime)。
    - 编译出的程序不依赖于 msys-2.0.dll，可以在没有 MSYS2 的 Windows 系统上运行。
    - 这是进行 ***Node.js 原生模块开发的首选环境。***
- **MSYS2 UCRT64:** 🟨
    - 类似于 MinGW64，也是用于编译 64 位的原生 Windows 程序。
    - 主要区别在于它使用 UCRT (Universal C Runtime)，这是 Windows 10 及更高版本中提供的 C 运行时库。
    - 如果你的目标用户主要是 Windows 10 及更高版本的用户，可以考虑使用这个环境。
- **MSYS2 CLANG64:** 🟧
    - 使用 Clang 编译器而不是 GCC 编译器。
    - Clang 是一个现代的、模块化的编译器，通常能提供更好的诊断信息和更快的编译速度（在某些情况下）。
    - 如果你熟悉 Clang，或者你的项目需要 Clang 特有的功能，可以使用这个环境。

## VS Code 中的终端选项
终端选项是怎么来的？ Profile 是什么意思？**
- **终端选项的来源：**
    - VS Code 会自动检测你系统上安装的 shell。它会扫描一些常见的位置，例如：
        - Windows 注册表
        - PATH 环境变量
        - 一些已知的安装位置（例如 MSYS2 的安装目录）
    - VS Code 还会检测 WSL (Windows Subsystem for Linux) 中的发行版。
    - 你可以手动添加或修改终端配置。
- **Profile 的含义：**
    - 在 VS Code 中，一个 "profile"（配置文件）定义了一个特定的终端环境。它包括：
        - **Shell 的路径：** 例如 /usr/bin/bash (MSYS2 Bash)、C:\Windows\System32\cmd.exe (Windows 命令提示符)、C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe (PowerShell) 等。
        - **启动参数：** 例如，你可以为 Bash 指定启动脚本 (-l 表示 login shell)。
        - **图标：** 用于在 VS Code 的终端选择器中显示。
        - **名称：** 用于在 VS Code 中标识这个 profile。
        - **环境变量：** 你可以为每个 profile 设置不同的环境变量
        - **工作目录：** 终端启动时的默认目录。
    - VS Code 允许你创建多个 profile，并在它们之间快速切换。这使得你可以轻松地在不同的 shell 环境中工作。

- **添加 MSYS2 Bash 的 profile**
如果 VS Code 没有自动检测到 MSYS2 Bash，你可以手动添加：
1. 打开 VS Code 的设置 (File > Preferences > Settings，或 Ctrl+,)。\
2. 搜索 "terminal profiles windows"。
3. 点击 "Edit in settings.json"。
4. 在 terminal.integrated.profiles.windows 对象中添加一个新的 profile：

```json
"terminal.integrated.profiles.windows": {
    "MSYS2 Bash": {
        "path": "C:\\msys64\\usr\\bin\\bash.exe", // 替换为你的 MSYS2 安装路径
        "args": [
            "--login" //以login shell模式运行
        ],
        "env": {
            "MSYSTEM": "MINGW64", // 设置为 MINGW64、UCRT64 或 CLANG64，根据你的需要
            "CHERE_INVOKING": "1" //可选, 允许右键菜单打开
        },
        "icon": "terminal-bash"
    }
}
```

- **path:** MSYS2 Bash 的可执行文件路径。
- **args:** 启动参数。--login 使 Bash 作为 login shell 启动，这会加载 /etc/profile 和 ~/.bash_profile 等配置文件。
- **env:** 环境变量。
    - MSYSTEM: 指定要使用的 MSYS2 环境 (MINGW64, UCRT64, CLANG64, MSYS)。
    - CHERE_INVOKING: 设置为 1 可以启用 MSYS2 的 "Open Bash Here" 右键菜单功能（如果已安装）
## DefaultProfile
设置 terminal.integrated.defaultProfile.windows 来指定默认使用的 profile：
```
"terminal.integrated.defaultProfile.windows": "MSYS2 Bash"
```

现在你就可以在vscode终端中切换到msys2 bash

## 容易混淆的地方

- **MSYS2 的不同环境：** MSYS2 有多个环境（MSYS、MinGW64、UCRT64、CLANG64），它们使用不同的工具链和运行时库。
- **路径：** MSYS2 使用 Unix 风格的路径 ( /c/Users/...)，而 Windows 使用反斜杠路径 (C:\Users\...)。
- **环境变量：** MSYS2 的环境变量与 Windows 的环境变量是***部分隔离***的。
- **Shell 配置文件：** MSYS2 Bash 会读取它自己的配置文件 (~/.bashrc、~/.bash_profile、/etc/profile)，这些文件会影响 shell 
- **PATH 变量：** MSYS2 会修改 PATH 变量，使其包含 MSYS2 的 bin 目录。可能会导致一些与 Windows 工具的冲突（相同名称）
- **pacman：** 确保使用 pacman 安装软件包时，在正确的 MSYS2 环境中运行（例如，在 MinGW64 环境中安装 MinGW-w64 软件包）。

**关于“沉浸式”体验的建议：**

1. **使用 VS Code 的集成终端：** 如上所述，配置好 MSYS2 Bash 的 profile，并在 VS Code 中使用它。
2. **安装常用的 Unix 工具：** 使用 pacman 安装你常用的 Unix 工具，例如 git、vim、grep、awk、sed、curl、wget 等。
3. **配置 shell：** 定制你的 ~/.bashrc 或 ~/.bash_profile 文件，例如：
    - 设置别名 (alias)
    - 自定义提示符 (PS1)
    - 添加自定义函数
    - 设置环境变量
4. **使用 MSYS2 的 mintty 终端：** MSYS2 自带的 mintty 终端比 Windows 的默认控制台提供了更好的体验，例如：
    - 更好的 Unicode 支持
    - 可定制的颜色和字体
    - 支持 ANSI 转义序列
    - 更好的复制粘贴
5. **（可选）将 MSYS2 的 bin 目录添加到 Windows 的 PATH 环境变量：** 这样你就可以在 Windows 的命令提示符或 PowerShell 中直接运行 MSYS2 的工具。但要注意潜在的***冲突***。
    
6. **（可选）安装 MSYS2 的 "Open Bash Here" 右键菜单：** 这样你就可以在 Windows 资源管理器中右键单击一个文件夹，然后选择 "Open Bash Here" 来快速打开一个 MSYS2 Bash 终端，并切换到该目录。安装方法：
    
    - 在 MSYS2 终端中运行：
        ```
        pacman -S --needed --noconfirm msys2-chere
        ```
        
    - 然后，以管理员身份运行：

        ```
        chere -i -t mintty -s bash # bash可以根据需要改为其他的shell
        ```
        
        这将安装右键菜单。要卸载，请运行：
        
        ```
        chere -r -t mintty -s bash
        ```
        

通过这些步骤，你可以在 Windows 上获得一个非常接近于 Linux 的开发环境，同时又能充分利用 Windows 的优势。


# MSVC
https://visualstudio.microsoft.com/downloads/#remote-tools-for-visual-studio-2022
https://aka.ms/vs/17/release/vs_BuildTools.exe 翻译成***生成工具.***
![[MSVC.png]]

C:\Program Files (x86)\Microsoft Visual Studio 是 Visual Studio 相关工具的 根目录。在这个目录下：

- **2022:** 这是 Visual Studio 版本 的目录。如果你安装了其他版本的 Visual Studio（例如 2019、2017），这里也会有相应的目录
- **Installer:** 这是 Visual Studio 安装程序本身的目录。
- **Shared:** 这是 Visual Studio ***不同版本***之间共享的一些组件的目录。
- **2022\BuildTools:** 这才是 Visual Studio Build Tools 真正 的安装目录。
    

在 2022\BuildTools 目录下，各个子目录的含义如下：

- **Common7:** 包含一些通用的工具和组件，其中一部分与 Visual Studio IDE 共享。
    - Common7\IDE\VC: 包含与 Visual C++ 相关的一些 IDE 组件（即使你只安装了 Build Tools，也会有一些 IDE 组件）。
    - Common7\Tools: 包含一***些通用的命令行工具***。
- **DIA SDK:** Debug Interface Access SDK，用于访问调试信息。
- **ImportProjects:** 包含一些 MSBuild 项目文件。
- **Licenses:** 包含许可证文件。
- **MSBuild:** 包含 MSBuild 构建引擎。MSBuild 是 Visual Studio 和 .NET 使用的构建系统。
- **SDK:** 包含一些 Windows SDK 的头文件和库文件（但不完整，完整的 Windows SDK 需要单独安装）。
- **Team Tools:** 包含一些团队开发相关的工具（例如性能分析工具）。
- **VB:** 包含 Visual Basic 相关的组件。
- **VC:** 这是 最重要 的目录，包含了 Visual C++ 编译器、链接器、头文件、库文件等。
    - VC\Tools\MSVC\14.43.34808: 这是 MSVC 编译器工具链的目录。14.43.34808 是工具链的版本号。你可能会看到多个版本号的目录，因为 ***Build Tools 可以安装多个版本的 MSVC 工具链***。
    - VC\Redist\MSVC\14.42.34433: 这是 MSVC 运行时库 (Redistributable) 的目录。
    - VC\Auxiliary\Build: 包含一些辅助构建脚本，例如 vcvarsall.bat。
    - VC\vcpkg: 包含 vcpkg 包管理器（如果你安装了的话）。
- **VC#:** 包含 Visual C# 相关的组件。
- **Xml:** 包含一些 XML 相关的组件。

**2. 环境变量：**

你列出的环境变量都是 Build Tools 设置的：

- **VCIDEInstallDir:** Visual C++ IDE 组件的安装目录。
- **VCINSTALLDIR:** Visual C++ 的安装目录（VC 目录）。
- **VCPKG_ROOT:** vcpkg 包管理器的根目录。
- **VCToolsInstallDir:** MSVC 编译器工具链的目录。`\2022\BuildTools\VC\Tools\MSVC\14.43.34808\`
- **VCToolsRedistDir:** MSVC 运行时库的目录。`BuildTools\VC\Redist\MSVC\14.42.34433`
- **VCToolsVersion:** MSVC 编译器工具链的版本号。`14.43.34808`
- **VisualStudioVersion:** Visual Studio 的版本号 (17.0 对应于 Visual Studio 2022)。`17.0`
- **VS170COMNTOOLS:** Visual Studio 2022 通用工具的目录。

**VCTargetsPath 缺失：**

VCTargetsPath 环境变量通常指向 MSBuild 的 Microsoft.Cpp 属性文件所在的目录。Build Tools 应该 会设置这个变量，但有时可能由于安装问题或配置问题而没有设置。

你可以尝试手动设置 VCTargetsPath：
```
set VCTargetsPath=C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\MSBuild\Microsoft\VC\v170\
```


- 注意：v170 这里的版本号可能需要根据你实际安装的 Build Tools 版本进行调整。你可以在 C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\MSBuild\Microsoft\VC\ 目录下找到正确的版本号目录。
    

**3. Build Tools 附带的 7 个 CLI：**

这 7 个 CLI 对应于不同的编译环境：

1. **x86 Native Tools Command Prompt:** 编译 32 位 (x86) 程序，使用 32 位编译器和工具链。
2. **x64 Native Tools Command Prompt:** 编译 64 位 (x64) 程序，使用 64 位编译器和工具链。
3. **x86_x64 Cross Tools Command Prompt:** 使用 32 位编译器和工具链，但编译 64 位程序（交叉编译）。
4. **x64_x86 Cross Tools Command Prompt:** 使用 64 位编译器和工具链，但编译 32 位程序（交叉编译）。
5. **Developer Command Prompt:** 这是一个通用的命令提示符，它会根据你提供的参数来设置编译环境（类似于运行 vcvarsall.bat）
6. **ARM64 Native Tools Command Prompt**: 编译ARM架构64位程序.
7. **ARM64_x64 Cross Tools Command Prompt**: 使用ARM架构64位工具链, 编译x64程序
8. **ARM64_x86 Cross Tools Command Prompt**: 使用ARM架构64位工具链, 编译x86程序.

**4. 关于 "笨重的文件结构" 和 "不伦不类的命名"：**

你说的很对，Windows 下的开发工具和 SDK 的目录结构确实比较混乱。这主要是由于历史原因和兼容性考虑：

- **历史原因：** Windows 和 Visual Studio 的发展经历了很长时间，很多目录结构和命名方式都是在早期形成的，后来为了保持向后兼容，不得不保留下来。
    
- **兼容性：** 为了支持各种不同的开发场景（例如 32 位、64 位、不同版本的 Windows SDK、不同版本的 .NET Framework 等），需要有多个版本的工具和库，这导致了目录结构的复杂性。
    
- **MSBuild:**
    - MSBuild 是一个构建平台，最初是 .NET Framework 的一部分，后来成为 Visual Studio 的一部分。
    - MSBuild 的目录结构也比较复杂，而且不同版本的 MSBuild 可能会有不同的目录结构。

**如何应对：**

1. **理解目录结构：** 尽量理解每个目录的含义，知道哪些目录是重要的（例如 VC 目录、MSBuild 目录）。
    
2. **使用 vcvarsall.bat：** 不要尝试手动设置环境变量，而是使用 vcvarsall.bat 脚本来自动设置正确的编译环境。
    
3. **使用 Visual Studio 的 Developer Command Prompt：** 这些命令提示符会自动为你设置好正确的环境变量。
    
4. **查阅文档：** 如果遇到不明白的目录或文件，查阅 Microsoft 的官方文档。
    
5. **不要轻易删除或修改文件：** 除非你非常确定自己在做什么，否则不要轻易删除或修改这些目录下的文件，以免破坏开发环境。
    

虽然 Windows 的开发工具目录结构比较复杂，但只要花一些时间去理解它，你就能更好地掌握它。希望这些解释对你有帮助！

## vcvarsall.bat
`vcvarsall.bat` 是 Visual Studio 和 Visual Studio Build Tools 提供的一个批处理文件（脚本），它的主要作用是：

**设置 Visual C++ (MSVC) 编译环境的环境变量**

当你需要使用 MSVC 编译器 (cl.exe)、链接器 (link.exe)、库管理器 (lib.exe) 以及其他相关工具时，你需要设置一系列的环境变量，包括：
*   **`INCLUDE`:**  指定 C/C++ 头文件（.h 文件）的搜索路径。
*   **`LIB`:**  指定库文件（.lib 文件）的搜索路径。
*   **`LIBPATH`:** 指定链接器搜索库文件的路径。
*   **`PATH`:**  指定可执行文件（.exe、.dll 文件）的搜索路径，这样你才能在命令行中直接运行 `cl.exe`、`link.exe` 等命令。
*   **其他一些与 MSVC 相关的环境变量** (例如 `VCToolsInstallDir`、`VisualStudioVersion` 等)。

手动设置这些环境变量非常繁琐，而且容易出错。`vcvarsall.bat` 的作用就是自动为你设置这些环境变量，让你能够方便地使用 MSVC 编译工具链。

**`vcvarsall.bat` 的位置：**

`vcvarsall.bat` 的位置取决于你安装的是 Visual Studio 还是 Visual Studio Build Tools，以及安装的版本。以下是一些常见的位置：

*   **Visual Studio 2022:**
    *   `(x86)\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat` (Community 版)
    *   `(x86)\Microsoft Visual Studio\2022\Professional\VC\Auxiliary\Build\vcvarsall.bat` (Professional 版)
    *   `(x86)\Microsoft Visual Studio\2022\Enterprise\VC\Auxiliary\Build\vcvarsall.bat` (Enterprise 版)

*   **Visual Studio Build Tools 2022:**
    ```
    C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvarsall.bat
    ```


**如何使用 `vcvarsall.bat`：**

`vcvarsall.bat` 需要带参数运行，以指定你要使用的编译环境。以下是一些常见的用法：

*   **`vcvarsall.bat x64`:**  设置 64 位 (x64) 编译环境。这是最常用的选项。
*   **`vcvarsall.bat x86`:**  设置 32 位 (x86) 编译环境。
*   **`vcvarsall.bat x86_x64`:**  设置交叉编译环境，使用 32 位工具链编译 64 位程序。
*   **`vcvarsall.bat x64_x86`:** 设置交叉编译环境, 使用64位工具链编译32位程序.
* **`vcvarsall.bat arm64`**: 设置arm64位编译环境.
* **`vcvarsall.bat [architecture] [platform_type] [winsdk_version] [-vcvars_ver=vc_version]`** 更加详细的命令, 允许设置目标架构, 平台类型(比如store, desktop), windows sdk版本和vc工具集版本.

**示例：**

1.  **打开命令提示符 (cmd.exe)。**
2.  **导航到 `vcvarsall.bat` 所在的目录：**

    ```bash
    cd "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build"
    ```
3.  **运行 `vcvarsall.bat`：**

    ```bash
    vcvarsall.bat x64
    ```
4. **验证环境变量:** 运行完毕, 你可以使用`echo`来检查环境变量是否被正确设置：
    ```bash
      echo %INCLUDE%
		(x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\14.43.34808\include;
		(x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\VS\include;
		(x86)\Windows Kits\10\include\10.0.22621.0\ucrt;
		(x86)\Windows Kits\10\\include\10.0.22621.0\\um;
		(x86)\Windows Kits\10\\include\10.0.22621.0\\shared;
		(x86)\Windows Kits\10\\include\10.0.22621.0\\winrt;
		(x86)\Windows Kits\10\\include\10.0.22621.0\\cppwinrt

      echo %LIB% 
		2022\BuildTools\VC\Tools\MSVC\14.43.34808\lib\x64;
		(x86)\Windows Kits\10\lib\10.0.22621.0\ucrt\x64;
		(x86)\Windows Kits\10\\lib\10.0.22621.0\\um\x64
      
      echo %LIBPATH%
		2022\BuildTools\VC\Tools\MSVC\14.43.34808\lib\x64;
		2022\BuildTools\VC\Tools\MSVC\14.43.34808\lib\x86\store\references;
		(x86)\Windows Kits\10\UnionMetadata\10.0.22621.0;
		(x86)\Windows Kits\10\References\10.0.22621.0;
		C:\Windows\Microsoft.NET\Framework64\v4.0.30319
      echo %PATH%
      
  \MSVC\14.43.34808\bin\HostX64\x64;
  Common7\IDE\VC\VCPackages;
  Common7\IDE\CommonExtensions\Microsoft\TestWindow;
  BuildTools\MSBuild\Current\bin\Roslyn;
  BuildTools\Common7\IDE\Extensions\Microsoft\CodeCoverage.Console;
  (x86)\Windows Kits\10\bin\10.0.22621.0\\x64;
  (x86)\Windows Kits\10\bin\\x64;
  \BuildTools\\MSBuild\Current\Bin\amd64;
  C:\Windows\Microsoft.NET\Framework64\v4.0.30319;
  2022\BuildTools\Common7\IDE\;
  2022\BuildTools\Common7\Tools\;
  
  C:\msys64;
  C:\msys64\usr\bin;
  C:\WINDOWS\system32;
  ....
  Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin;
  Common7\IDE\CommonExtensions\Microsoft\CMake\Ninja;
  Common7\IDE\VC\Linux\bin\ConnectionManagerExe
    ```

**重要说明：**

*   `vcvarsall.bat` 只会影响 *当前* 命令提示符窗口的环境变量。当你关闭这个窗口后，环境变量的修改就会失效。
*   如果你想在每次打开命令提示符时都自动设置好 MSVC 环境，你可以：
    *   使用 Visual Studio 提供的 "Developer Command Prompt"（它会自动运行 `vcvarsall.bat`）。
    *   将 `vcvarsall.bat` 的调用添加到你的 `autoexec.bat` 文件中（不推荐，除非你真的需要在每次启动 Windows 时都设置 MSVC 环境）。
* 如果你在 MSYS2 中使用 MinGW-w64，你 *不* 需要运行 `vcvarsall.bat`。MinGW-w64 有自己的环境变量设置。
* 如果你打算在 Windows 的命令提示符或 PowerShell 中使用 MSVC 和 `node-gyp`，强烈建议使用 Visual Studio 提供的 "Developer Command Prompt"，因为它会自动为你设置好所有必要的环境变量。
