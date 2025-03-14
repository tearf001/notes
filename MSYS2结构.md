# 目录结构
  `C:\msys64` （根目录）：这是主安装目录。

## 从快捷方式入手
安装完MSYS2, 它帮创建快捷方式, 指向安装根目录下的 msys2.exe、mingw32.exe、mingw64.exe、ucrt64.exe、clang32.exe、clang64.exe、clangarm64.exe, 并且同时主目录下有各自的***图标***文件和 ***.ini*** 配置文件

第一印象, 这些是适用于不同 MSYS2 环境的***启动器***。但是它们本身*不是Shell*。他们的主要工作是设置环境（包括*关键的 MSYSTEM* 变量），然后启动一个 shell (*/usr/bin/bash.exe*). 你注意到了, 不管是可执行文件名, 还是ini里面的*MSYSTEM*变量, 这都引入了今天的 *关键主角* ***MSYSTEM***

> 引申探索: 他们大小都差不多,但是MSYS2.exe更大,可能是因为要调用`msys2_shell.cmd`?

## MSYSTEM
### **MSYSTEM 的含义**

`MSYSTEM` 是一个环境变量，用于标识当前的编译环境和目标平台。它决定了：
1. 使用的编译器（如 GCC、Clang 或 UCRT）    
2. 目标架构（如 x86_32、x86_64 或 ARM64）
3. 相关的配置文件和工具链路径。

在 MSYS2 中，不同的 `MSYSTEM` 值对应不同的工具链和目标平台，这些工具链和平台被组织在其名称的二级目录下.

- MSYSTEM=*MSYS*： “基本” MSYS2 环境。提供符合 POSIX 的环境，包括 bash、gcc、make 等工具，这些工具经过编译以与 ***MSYS2 运行时***（提供 ***POSIX 兼容层***）一起使用。这是您运行 msys2.exe 时获得的环境

- MSYSTEM=*MINGW32*： 32 位 MinGW-w64 环境。此环境提供了一个编译器工具链（***GCC*** 等），用于生成本机 32 位 Windows 可执行文件。这些可执行文件***不依赖于*** MSYS2 运行时。这是用于构建 Windows 应用程序的。

- MSYSTEM=*MINGW64*： 64 位 MinGW-w64 环境。与 MINGW32 类似，但适用于 64 位 Win 应用程序。这是构建 Windows 应用最常见环境。

- SYSTEM=*UCRT64*：64 位 UCRT（通用 C 运行时）环境。这使用 Windows 提供的 ***UCRT***，而不是较旧的 ***MSVCRT***。对于较新的项目，它通常比 MINGW64 更受欢迎，因为它与最新的 Windows 功能提供了更好的兼容性。

  ***LLVM生态***
- MSYSTEM=*CLANG32*， MSYSTEM=*CLANG64*， MSYSTEM=*CLANGARM64*：这些环境使用 ***Clang 编译器***而不是 *GCC*。它们还生成本机 Windows 可执行文件。CLANG32 是 32 位的，CLANG64 是 64 位的，CLANGARM64 是 ARM64 架构。



---

### **MSYS2 的目录结构和工具链分类**

根据你的描述，MSYS2 的目录结构和工具链可以按照以下方式分类：

#### **1. GNU GCC 工具链**

- **类 Unix 目标平台**：
    
    - **MSYSTEM=MSYS**：基于 MinGW-w64 的类 Unix 环境，通常用于开发跨平台的 Unix-like 程序。        
    - 目录：`/usr`        
    - 特点：使用 GCC 编译器，目标平台为类 Unix 环境。
        
- **Windows 目标平台**：
    
    - **MSYSTEM=MINGW32**：32 位 MinGW-w64 环境，目标平台为 Windows。        
        - 目录：`/mingw32`            
        - 特点：使用 GCC 编译器，目标架构为 x86_32。
            
    - **MSYSTEM=MINGW64**：64 位 MinGW-w64 环境，目标平台为 Windows。        
        - 目录：`/mingw64`            
        - 特点：使用 GCC 编译器，目标架构为 x86_64。
            

#### **2. LLVM Clang 工具链**
 LLVM 项目最初由 学术界**伊利诺伊大学厄巴纳-香槟分校 Chris Lattner 和 Vikram Adve 教授发起的一个研究项目。
- **Clang 工具链**：
    
    - **MSYSTEM=CLANG32**：32 位 Clang 环境，目标平台为 Windows。        
        - 目录：`/clang32`            
        - 特点：使用 Clang 编译器，目标架构为 x86_32。
            
    - **MSYSTEM=CLANG64**：64 位 Clang 环境，目标平台为 Windows。        
        - 目录：`/clang64`            
        - 特点：使用 Clang 编译器，目标架构为 x86_64。            
    - **MSYSTEM=CLANGARM64**：ARM64 架构的 Clang 环境，目标平台为 Windows。        
        - 目录：`/clangarm64`            
        - 特点：使用 Clang 编译器，目标架构为 ARM64。            

#### **3. UCRT 工具链**

- **UCRT64**：    
    - **MSYSTEM=UCRT64**：基于 UCRT 的 64 位环境，目标平台为 Windows。        
        - 目录：`/ucrt64`            
        - 特点：使用 UCRT（Universal C Runtime）运行时，目标架构为 x86_64。            

#### **其他 - MSVC 工具链**

- MSVC（Microsoft Visual C++）是 Windows 平台上另一种常见的编译器，但它不属于 MSYS2 的范畴。        
- MSVC 通常通过 Visual Studio 或独立的 Build Tools for Visual Studio 安装。        
- MSVC 使用自己的工具链和运行时，与 MSYS2 的工具链不兼容。
- 它通常有微软MSBuild通过配置文件调用vc下的cl.exe来编译.

## ***环境目录***
mingw32， mingw64， ucrt64， clang32， clang64， clangarm64 这些目录是相应环境的根目录。每个目录都包含自己的 bin、etc、include、lib 和 share 目录。 但是是空的
*AI 回复*
> 包安装：当你在特定环境中使用 pacman 安装包时（例如，MINGW64 环境中的 pacman -S mingw-w64-x86_64-gcc），pacman 会将文件安装到相应的目录结构中。因此，64 位 MinGW-w64 环境的编译器和库将安装在 C：\msys64\mingw64 下。这对于隔离至关重要。然后，MINGW64 环境的 gcc 将在 C：\msys64\mingw64\include 和 C：\msys64\mingw64\lib 下找到其头文件和库，而不是在 MSYS2 环境的目录下。如果您尚未专门为某个环境安装任何软件包，则这些目录将大部分为空（符号链接除外）。

# 实践
```bash
env | grep MSYSTEM # 查看终端的MSYSTEM环境
MSYSTEM=MSYS
MSYSTEM_CARCH=x86_64
MSYSTEM_CHOST=x86_64-pc-msys
PS1=\[\]\[\e]0;\w\a\]\n\[\e[32m\]\u@\h \[\e[35m\]$MSYSTEM\[\e[0m\] \[\e[33m\]\w\[\e[0m\]\n\[\e[1m\]#\[\e[0m\] \[\]
MSYSTEM_PREFIX=/usr

# 查看命令路径
env | grep PATH
PATH=/usr/local/bin:/usr/bin:/bin:/opt/bin:/c/Windows/System32:/c/Windows:/c/Windows/System32/Wbem:/c/Windows/System32/WindowsPowerShell/v1.0/:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl

PKG_CONFIG_PATH=/usr/lib/pkgconfig:/usr/share/pkgconfig:/lib/pkgconfig
PATHEXT=.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC
MANPATH=/usr/local/man:/usr/share/man:/usr/man:/share/man
ORIGINAL_PATH=/c/Windows/System32:/c/Windows:/c/Windows/System32/Wbem:/c/Windows/System32/WindowsPowerShell/v1.0/
INFOPATH=/usr/local/info:/usr/share/info:/usr/info:/share/info
HOMEPATH=\Users\Administrator
```

## 完整版
### 相同的

1. **系统相关**
    
    - **操作系统**：所有文件的 `OS` 均为 `Windows_NT`，表明它们都运行在 Windows 系统上。        
    - **系统根目录**：`SYSTEMROOT` 和 `WINDIR` 均为 `C:\Windows`。        
    - **系统驱动器**：`SYSTEMDRIVE` 均为 `C:`。        
    - **处理器架构**：`PROCESSOR_ARCHITECTURE` 均为 `AMD64`。        
    - **处理器信息**：`PROCESSOR_LEVEL` 均为 `6`，`PROCESSOR_REVISION` 均为 `9e0a`，`PROCESSOR_IDENTIFIER` 均为 `Intel64 Family 6 Model 158 Stepping 10, GenuineIntel`，表明它们运行在类似的 Intel 处理器上。        
    - **系统环境变量**：`PATHEXT` 均为 `.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC`，`COMSPEC` 均为 `C:\Windows\system32\cmd.exe`，`TEMP` 和 `TMP` 均为 `/tmp`，`ORIGINAL_TMP` 和 `ORIGINAL_TEMP` 均为 `/c/Users/ADMINI~1/AppData/Local/Temp`。
        
2. **用户相关**    
    - **用户名**：`USERNAME` 和 `USER` 均为 `Administrator`。        
    - **用户目录**：`HOME` 和 `HOMEPATH` 均为 `/home/Administrator` 和 `\Users\Administrator`，`USERPROFILE` 均为 `C:\Users\Administrator`。      
    - **用户数据目录**：`APPDATA` 均为 `C:\Users\Administrator\AppData\Roaming`，`LOCALAPPDATA` 均为 C:\Users\Administrator\AppData\Local
        
3. **软件和工具**    
    - **终端程序**：`SHELL` 均为 `/usr/bin/bash`，`TERM_PROGRAM` 均为 `mintty`，`TERM_PROGRAM_VERSION` 均为 `3.7.6`，`TERM` 均为 `xterm`。        
    - **打印机**：`PRINTER` 均为 `Microsoft Print to PDF`。        
    - **时区**：`TZ` 均为 `Asia/Taipei`。        
    - **PS1**：`PS1` 的格式基本一致，仅 `$MSYSTEM` 部分随系统类型变化。        
4. **目录结构**    
    - **程序文件目录**：`ProgramFiles(x86)` 均为 `C:\Program Files (x86)`，`PROGRAMFILES` 均为 `C:\Program Files`，`CommonProgramFiles(x86)` 均为 `C:\Program Files (x86)\Common Files`，`CommonProgramW6432` 均为 `C:\Program Files\Common Files`。        
    - **公共目录**：`ALLUSERSPROFILE` 均为 `C:\ProgramData`，`PUBLIC` 均为 `C:\Users\Public`。
        
5. **其他**    
    - **主机名**：`HOSTNAME` 和 `COMPUTERNAME` 均为 `DESKTOP-M2-SSD`。
    - **会话名**：`SESSIONNAME` 均为 `RDP-Tcp#121`。
    - **客户端名**：`CLIENTNAME` 均为 `DESKTOP-KK6USUD`。
    - **语言环境**：`LC_CTYPE` 均为 `zh_CN.UTF-8`。
    - **OpenAI API Key**：`OPENAI_API_KEY` 均为 `sk-...`。
    - **WebStorm 路径**：`WebStorm` 均为 `d:\JetBrains\WebStorm 2023.1.2\bin`。
    
主要是宿主机信息和宿主操作系统的环境变量
```ini
ProgramFiles(x86)=C:\Program Files (x86)
!::=::\
CommonProgramFiles(x86)=C:\Program Files (x86)\Common Files
SHELL=/usr/bin/bash
NUMBER_OF_PROCESSORS=12
PROCESSOR_LEVEL=6
WebStorm=d:\JetBrains\WebStorm 2023.1.2\bin;
TERM_PROGRAM_VERSION=3.7.6

USERDOMAIN_ROAMINGPROFILE=DESKTOP-M2-SSD
HOSTNAME=DESKTOP-M2-SSD
COMPUTERNAME=DESKTOP-M2-SSD
PROGRAMFILES=C:\Program Files
TERM=xterm
LOGONSERVER=\\DESKTOP-M2-SSD
USER=Administrator

PSModulePath=C:\Program Files\WindowsPowerShell\Modules;C:\Windows\system32\WindowsPowerShell\v1.0\Modules
TEMP=/tmp

PATHEXT=.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC
ORIGINAL_TEMP=/c/Users/ADMINI~1/AppData/Local/Temp

OS=Windows_NT
HOMEDRIVE=C:
OPENAI_API_KEY=sk-...
USERDOMAIN=DESKTOP-M2-SSD
PWD=/home/Administrator
USERPROFILE=C:\Users\Administrator

PNPM_HOME=C:\Users\Administrator\AppData\Local\pnpm

ALLUSERSPROFILE=C:\ProgramData
ORIGINAL_PATH=/c/Windows/System32:/c/Windows:/c/Windows/System32/Wbem:/c/Windows/System32/WindowsPowerShell/v1.0/
CommonProgramW6432=C:\Program Files\Common Files

HOME=/home/Administrator
HOMEPATH=\Users\Administrator
USERNAME=Administrator
OneDrive=C:\Users\Administrator\OneDrive
COMSPEC=C:\Windows\system32\cmd.exe
APPDATA=C:\Users\Administrator\AppData\Roaming
SYSTEMROOT=C:\Windows
LOCALAPPDATA=C:\Users\Administrator\AppData\Local

ORIGINAL_TMP=/c/Users/ADMINI~1/AppData/Local/Temp
SHLVL=1
PROCESSOR_REVISION=9e0a
DriverData=C:\Windows\System32\Drivers\DriverData
COMMONPROGRAMFILES=C:\Program Files\Common Files
LC_CTYPE=zh_CN.UTF-8
PROCESSOR_IDENTIFIER=Intel64 Family 6 Model 158 Stepping 10, GenuineIntel
SESSIONNAME=RDP-Tcp#121
PS1=\[\e]0;\w\a\]\n\[\e[32m\]\u@\h \[\e[35m\]$MSYSTEM\[\e[0m\] \[\e[33m\]\w\[\e[0m\]\n\[\e[1m\]#\[\e[0m\]

MSYSCON=mintty.exe
TMP=/tmp
CONFIG_SITE=/etc/config.site
ProgramW6432=C:\Program Files
WINDIR=C:\Windows
PROCESSOR_ARCHITECTURE=AMD64
PUBLIC=C:\Users\Public
CLIENTNAME=DESKTOP-KK6USUD
SYSTEMDRIVE=C:
OLDPWD=/
TERM_PROGRAM=mintty
ProgramData=C:\ProgramData
_=/usr/bin/env

```
### 不同的

1. **系统类型**    
    - **MSYSTEM**：        
        - `clang32`：`CLANG32`            
        - `clang64`：`CLANG64`            
        - `mingw64`：`MINGW64`            
        - `minw32`：`MINGW32`            
        - `msys2`：`MSYS`
        - `ucrt64`：`UCRT64
        - `clangarm64`：`CLANGARM64`
    - **MSYSTEM_PREFIX**：        
        - `clang32`：`/clang32`            
        - `clang64`：`/clang64`            
        - `mingw64`：`/mingw64`            
        - `minw32`：`/mingw32`            
        - `msys2`：`/usr`            
        - `ucrt64`：`/ucrt64`            
        - `clangarm64`：`/clangarm64`
            
    - **MINGW_CHOST**：        
        - `clang32.ini`：`i686-w64-mingw32`            
        - `clang64.ini`：`x86_64-w64-mingw32`            
        - `mingw64.ini`：`x86_64-w64-mingw32`            
        - `minw32.ini`：`i686-w64-mingw32`            
        - `msys2.ini`：`x86_64-pc-msys`            
        - `ucrt64.ini`：`x86_64-w64-mingw32`            
        - `arm64.ini`：`aarch64-w64-mingw32`
            
    - **MSYSTEM_CARCH**：        
        - `clang32.ini`：`i686`            
        - `clang64.ini`：`x86_64`            
        - `mingw64.ini`：`x86_64`            
        - `minw32.ini`：`i686`            
        - `msys2.ini`：`x86_64`            
        - `ucrt64.ini`：`x86_64`            
        - `arm64.ini`：`aarch64`
            
2. **路径配置**
    
    - **MINGW_PREFIX**：        
        - `clang32.ini`：`/clang32`            
        - `clang64.ini`：`/clang64`            
        - `mingw64.ini`：`/mingw64`
        - `minw32.ini`：`/mingw32`            
        - `msys2.ini`：无此键            
        - `ucrt64.ini`：`/ucrt64`            
        - `arm64.ini`：`/clangarm64`

    - **PKG_CONFIG_PATH**：
        
        - `clang32.ini`：`/clang32/lib/pkgconfig:/clang32/share/pkgconfig`            
        - `clang64.ini`：`/clang64/lib/pkgconfig:/clang64/share/pkgconfig`            
        - `mingw64.ini`：`/mingw64/lib/pkgconfig:/mingw64/share/pkgconfig`            
        - `minw32.ini`：`/mingw32/lib/pkgconfig:/mingw32/share/pkgconfig`            
        - `msys2.ini`：`/usr/lib/pkgconfig:/usr/share/pkgconfig:/lib/pkgconfig`            
        - `ucrt64.ini`：`/ucrt64/lib/pkgconfig:/ucrt64/share/pkgconfig`            
        - `arm64.ini`：`/clangarm64/lib/pkgconfig:/clangarm64/share/pkgconfig`
            
    - **PKG_CONFIG_SYSTEM_LIBRARY_PATH**：
        
        - `clang32.ini`：`/clang32/lib`            
        - `clang64.ini`：`/clang64/lib`            
        - `mingw64.ini`：`/mingw64/lib`            
        - `minw32.ini`：`/mingw32/lib`            
        - `msys2.ini`：无此键            
        - `ucrt64.ini`：`/ucrt64/lib`            
        - `arm64.ini`：`/clangarm64/lib`
            
    - **PKG_CONFIG_SYSTEM_INCLUDE_PATH**：
        
        - `clang32.ini`：`/clang32/include`            
        - `clang64.ini`：`/clang64/include`            
        - `mingw64.ini`：`/mingw64/include`            
        - `minw32.ini`：`/ming
```ini
MINGW_PREFIX=/clangarm64
PKG_CONFIG_PATH=/clangarm64/lib/pkgconfig:/clangarm64/share/pkgconfig

```

# CLANG 和 LLVM 项目

LLVM 项目最初由 **伊利诺伊大学厄巴纳-香槟分校（University of Illinois at Urbana-Champaign，UIUC）** 的 Chris Lattner 和 Vikram Adve 教授发起的一个研究项目。Chris Lattner 也是 Swift 编程语言的创始人。

虽然最初起源于学术界，但如今 LLVM 已经发展成为一个**开源项目**，由一个庞大的社区共同维护和开发。它不再仅仅属于某个特定的个人或机构，而是由来自世界各地的开发者、公司和组织共同贡献。

*   **开源:**  LLVM 的源代码是公开的，任何人都可以免费获取、使用、修改和分发。它采用 Apache 2.0 许可证，这是一个非常宽松的许可证，允许商业使用和修改。
*   **社区驱动:**  LLVM 的开发由一个活跃的社区推动，社区成员包括来自各大科技公司（如 Apple、Google、Intel、ARM 等）、研究机构和独立开发者。

**LLVM 是什么？**

LLVM 最初代表 "Low Level Virtual Machine"，但现在这个缩写已经不再具有实际意义，LLVM 已经发展成为一个更广泛的概念。它是一个***模块化、可重用的编译器和工具链技术*的集合**。

可以将 LLVM 理解为一个构建编译器的“工具箱”或“框架”，它提供了许多组件，可以用来构建编译器、优化器、代码生成器、JIT 编译器等。

**LLVM 的核心组成部分**

1.  **LLVM *IR* (Intermediate Representation)**:
    *   LLVM IR 是一种低级、与平台无关的中间表示。它类似于一种“通用汇编语言”。
    *   编译器前端（如 Clang）将源代码（如 C/C++）转换为 LLVM IR。
    *   然后，LLVM 的优化器可以对 IR 进行各种优化，这些优化是独立于具体编程语言和目标平台的。
    *   最后，LLVM 的后端将优化后的 IR 转换为特定平台的机器代码（如 x86、ARM 等）。

2.  **编译器前端 (*Frontend*)**:
    *   LLVM 本身并不直接处理高级编程语言（如 C/C++）。
    *   编译器前端负责将源代码转换为 LLVM *IR*。
    *   最著名的 LLVM 前端是 ***Clang***，它支持 C、C++、Objective-C 和 Objective-C++。
    *   还有其他前端，如 Flang（Fortran）、Rustc（Rust，部分使用 LLVM）、Swiftc（Swift）等。

3.  **优化器 (Optimizer)**:
    *   LLVM 的优化器对 LLVM IR 进行各种优化，以提高代码的性能和效率。
    *   这些优化包括死代码消除、循环优化、内联、常量折叠等等。
    *   优化器是***独立***于前端和后端的，这使得 LLVM 非常灵活和可扩展。

4.  **编译器后端 (Backend)**:
    *   LLVM 的后端将优化后的 LLVM IR 转换为特定平台的机器代码。
    *   LLVM 支持多种目标平台，包括 x86、x86-64、***ARM***、AArch64、MIPS、PowerPC、***WebAssembly*** 等。

5.  **工具链**:
    *   LLVM 还包含许多工具，用于辅助编译、链接、调试和分析代码。
    *   例如：
        *   **lld:**  LLVM 的链接器，通常比传统的链接器（如 GNU ld）更快。
        *   **llvm-as:**  LLVM 汇编器。
        *   **llvm-dis:**  LLVM 反汇编器。
        *   **opt:**  LLVM 优化器，可以单独运行。
        *   **llc:**  LLVM 静态编译器，将 LLVM IR 编译为机器代码。
        *   **lli:**  LLVM JIT 编译器，可以即时执行 LLVM IR。

**LLVM是编译器领域非常重要的基础设施, 优势:**

*   **模块化和可重用性:** LLVM 的各个组件是高度模块化的，可以独立使用或组合使用。这使得构建新的编译器或工具变得更加容易。
*   **跨平台:** LLVM 支持多种目标平台，这使得构建跨平台编译器变得更加容易。
*   **性能:** LLVM 的优化器非常强大，可以生成高度优化的代码。
*   **活跃的社区:** LLVM 拥有一个庞大而活跃的社区，
