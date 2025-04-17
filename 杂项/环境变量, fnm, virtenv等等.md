
**检查所有 PowerShell Profile 文件：**
```powershell
$PROFILE | Get-Member -MemberType NoteProperty | ForEach-Object {
    $path = Get-Item -Path $_.Definition -ErrorAction SilentlyContinue
    if ($path) {
        Write-Host "检查 Profile 文件: $($path.FullName)"
        Get-Content $path.FullName
    }
}
```

