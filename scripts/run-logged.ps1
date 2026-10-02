<#
  Runs any command and saves its FULL output (stdout + stderr) to a
  timestamped file under ../logs, formatted as UTF-8 plain text.

  Usage (from project root):
    .\scripts\run-logged.ps1 mvn clean compile
    .\scripts\run-logged.ps1 mvn test
    .\scripts\run-logged.ps1 npm run build:web
#>
param(
    [Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)]
    [string[]]$Command
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

$logsDir = Join-Path $PSScriptRoot "..\logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$safeName = ($Command -join "_") -replace '[^\w\-]', '_'
$logFile = Join-Path $logsDir "$timestamp`_$safeName.log"

Write-Host "Running: $($Command -join ' ')"
Write-Host "Full output will be saved to: $logFile"
Write-Host "----------------------------------------"

$exe = $Command[0]

$cmdArgs = @()
if ($Command.Length -gt 1) {
    $cmdArgs = @($Command[1..($Command.Length - 1)])
}

& $exe @cmdArgs 2>&1 | Tee-Object -FilePath $logFile
$exitCode = $LASTEXITCODE

Write-Host "----------------------------------------"
Write-Host "Exit code: $exitCode"
Write-Host "Log saved to: $logFile"
