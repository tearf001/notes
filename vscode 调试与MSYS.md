# Visual Studio IDE

隐藏太多细节，不利于理解，不利于学习，不利于掌握。

# VSCODE 调试

```powershell
 c:\Users\Administrator\.vscode\extensions\ms-vscode.cpptools-1.23.6-win32-x64\debugAdapters\bin\WindowsDebugLauncher.exe 
 
 --stdin=Microsoft-MIEngine-In-la2wohos.g11
 --stdout=Microsoft-MIEngine-Out-zqyy11vi.23p
 --stderr=Microsoft-MIEngine-Error-rkwdbmmg.bvm  

 --pid=Microsoft-MIEngine-Pid-kses1z0w.nkz
 --dbgExe=C:\msys64\ucrt64\bin\gdb.exe
 --interpreter=mi
 ```

这个长命令实际上是 VS Code 在幕后执行的一个操作，目的是为了能够让你在 VS Code 的集成环境中进行调试，VS Code 会启动一个轻量级的调试适配器 (`WindowsDebugLauncher.exe`).
  

**让我们分解这个命令**：  

## 第一部分： 调试适配器程序

- 程序 **正是** VSCode的扩展`ms-vscode.cpptools`提供的c/cpp调试适配器：`WindowsDebugLauncher.exe`

- 扩展的调试适配器程序路径：`c:\Users\Administrator\.vscode\extensions\ms-vscode.cpptools-1.23.6-win32-x64\debugAdapters\bin\WindowsDebugLauncher.exe`

-  介绍：它是一个轻量级的调试启动器，它的主要作用是：
    *   启动你的程序
    *   建立一个通信通道，将你的程序的标准输入 (stdin)、标准输出 (stdout) 和标准错误 (stderr) 重定向到 VS Code 的集成终端。这样，你就可以在 VS Code 的终端中看到程序的输出，并向程序输入数据。
    *  RUN / DEBUG 模式 决定了调试适配器的行为， 是否在简单/完整的 GDB 调试会话中工作。

## 第二部分： 重定向参数：

1. `--stdin`=`Microsoft-MIEngine-In`-la2wohos.g11
2. `--stdout`=`Microsoft-MIEngine-Out`-zqyy11vi.23p
3. `--stderr`=`Microsoft-MIEngine-Error`-rkwdbmmg.bvm

### 命名管道

这些是命名管道 (Named Pipes) 的名称。命名管道是 Windows 中一种进程间通信 (IPC) 机制。    

`WindowsDebugLauncher.exe` 使用这些命名管道与 VS Code 的**调试引擎** (MI Engine) 进行通信

#### 重定向命名管道

*   `--stdin`:  VS Code 通过这个管道向你的程序发送输入。

*   `--stdout`:  你的程序通过这个管道向 VS Code 发送标准输出（例如，`printf` 的输出）。

*   `--stderr`:  你的程序通过这个管道向 VS Code 发送标准错误（例如，错误消息）。

> `Microsoft-MIEngine-In-*`    

> `Microsoft-MIEngine-Out-*`    

> `Microsoft-MIEngine-Error-*`      

是命名管道的命名约定。后面的随机字符串 (如 `la2wohos.g11`) 用于确保管道名称的唯一性。

  

#### 进程 ID

`--pid=Microsoft-MIEngine-Pid-kses1z0w.nkz`

*   这也是一个命名管道，用于传递你的程序的进程 ID (PID)。

*   VS Code 可以使用这个 PID 来监视你的程序，例如，检测程序是否已经结束。

  

#### dbg 可执行文件

`--dbgExe=C:\msys64\ucrt64\bin\gdb.exe`

  

*   这指定了 GDB 可执行文件的路径。即使你**没有进行调试** (Ctrl+F5)

    > 进阶内容：

    > 1. `WindowsDebugLauncher.exe` 仍然需要知道 GDB 的位置，这可能是为了处理一些与调试相关的任务（即使在非调试模式下），或者在将来如果你决定切换到调试模式时，可以更快地启动 GDB。

    > 2. `WindowsDebugLauncher` **不会** 以常规的调试模式（附加到进程、设置断点等）来运行 GDB。

#### 通信接口

`--interpreter=mi`

* 指定**调试启动器** 与 **真-调试器(dbg)** 通信使用的接口为**MI**（Machine Interface）。

* MI 是一种机器友好的文本接口，用于控制 **dbg**

* VS Code 的调试启动器(WindowsDebugLauncher)使用 **MI** 与 **dbg** 进行通信。

  

**总结：**

  VS Code 仍然会启动一个轻量级的调试适配器 (`WindowsDebugLauncher.exe`)。这个适配器的主要作用是：
 

1.  **启动你的程序。**

2.  **将程序的输入/输出重定向到 VS Code 的集成终端。** 这是通过命名管道实现的，这样你就可以在 VS Code 中与你的程序进行交互。

3.  **向 VS Code 提供你的程序的 PID。**

4.  准备好调试环境