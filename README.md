---
Github 免密访问
----

# PowerShell

```powershell
# 设置变量
$email = "tearf001@gmail.com"  # 请替换为你的 GitHub 邮箱
$username = "tearf001"     # 请替换为你的 GitHub 用户名

# 1. 检查 SSH 目录是否存在，不存在就创建
if (!(Test-Path -Path "$env:USERPROFILE\.ssh")) {
  New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh"
}

# 2. 检查是否已存在 SSH 密钥，如果不存在则生成
if (!(Test-Path -Path "$env:USERPROFILE\.ssh\id_ed25519")) {
    Write-Host "没有找到 ed25519 SSH 密钥，开始生成..."
    # Ed25519 Key
    ssh-keygen -t ed25519 -C "$email"

    # RSA Key (注释，如果需要，可以取消注释)
    # Write-Host "没有找到 RSA SSH 密钥，开始生成..."
    # ssh-keygen -t rsa -b 4096 -C "$email"

    Write-Host "SSH 密钥生成完成。"
} else {
    Write-Host "已存在 SSH 密钥，跳过生成。"
}


# 3. 复制公钥到剪贴板
type "$env:USERPROFILE\.ssh\id_ed25519.pub" | clip
# 如果需要RSA方式，就用下面的
# type "$env:USERPROFILE\.ssh\id_rsa.pub" | clip

Write-Host "公钥已复制到剪贴板，请将它添加到 GitHub 的 SSH 密钥。"

# 4. 获取当前仓库地址
$current_url = git remote get-url origin 
$repo = ($current_url -split '/')[($current_url -split '/').Length -1]
$repo = $repo.Replace(".git","")

# 5. 检查当前仓库地址是否为 ssh 地址
if ($current_url -notlike "git@github.com:*"){
  Write-Host "当前仓库地址为 HTTPS, 开始转换为 SSH"
  # 6. 修改仓库远程 URL 为 SSH
  git remote set-url origin "git@github.com:$username/$repo.git"
  Write-Host "仓库远程 URL 已更改为 SSH."
} else {
    Write-Host "当前仓库地址为 SSH，跳过修改"
}


# 7. 测试 SSH 连接
Write-Host "正在测试 SSH 连接..."
ssh -T git@github.com

# 8. 提示完成
Write-Host "完成 SSH 免密码配置。请检查git push是否正常。"
```



# Bash

for Linux, Mac, WSL

配置免密远程访问github

```bash
#!/bin/bash

# 设置变量
email="tearf001@gmail.com"  # 请替换为你的 GitHub 邮箱
username="tearf001"     # 请替换为你的 GitHub 用户名

# 1. 检查 SSH 目录是否存在，不存在就创建
if [ ! -d "$HOME/.ssh" ]; then
  mkdir -p "$HOME/.ssh"
fi

# 2. 检查是否已存在 SSH 密钥，如果不存在则生成
if [ ! -f "$HOME/.ssh/id_ed25519" ]; then
  echo "没有找到 ed25519 SSH 密钥，开始生成..."
  # Ed25519 Key
  ssh-keygen -t ed25519 -C "$email"

    # RSA Key (注释，如果需要，可以取消注释)
    # echo "没有找到 RSA SSH 密钥，开始生成..."
    # ssh-keygen -t rsa -b 4096 -C "$email"

  echo "SSH 密钥生成完成。"
else
  echo "已存在 SSH 密钥，跳过生成。"
fi

# 3. 复制公钥到剪贴板
cat "$HOME/.ssh/id_ed25519.pub" | xclip -selection clipboard
# 如果需要RSA方式，就用下面的
# cat "$HOME/.ssh/id_rsa.pub" | xclip -selection clipboard

echo "公钥已复制到剪贴板，请将它添加到 GitHub 的 SSH 密钥。"

# 4. 获取当前仓库地址
current_url=$(git remote get-url origin)
repo=$(echo "$current_url" | awk -F '/' '{print $NF}' | sed 's/\.git$//')

# 5. 检查当前仓库地址是否为 ssh 地址
if [[ "$current_url" != "git@github.com:"* ]]; then
  echo "当前仓库地址为 HTTPS, 开始转换为 SSH"
  # 6. 修改仓库远程 URL 为 SSH
  git remote set-url origin "git@github.com:$username/$repo.git"
  echo "仓库远程 URL 已更改为 SSH."
else
    echo "当前仓库地址为 SSH，跳过修改"
fi

# 7. 测试 SSH 连接
echo "正在测试 SSH 连接..."
ssh -T git@github.com

# 8. 提示完成
echo "完成 SSH 免密码配置。请检查git push是否正常。"
```

