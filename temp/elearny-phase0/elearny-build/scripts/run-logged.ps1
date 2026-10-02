<#
  Runs any command and saves its FULL output (stdout + stderr) to a
  timestamped file under ../logs, so you can just upload the log file
  instead of copy-pasting terminal output by hand.

  Usage (from the elearny-build folder):
    .\scripts\run-logged.ps1 mvn clean install
    .\scripts\run-logged.ps1 mvn test
    .\scripts\run-logged.ps1 npm run build

  If PowerShell blocks running the script the first time, run this once
  (in the same PowerShell window) and try again:
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#>
param(
    [Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)]
    [string[]]$Command
)

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

# BUGFIX (2026-09-13): wrapping in @(...) forces this to stay an array even
# when there's exactly one leftover argument (e.g. "test"). Without the
# @(...), PowerShell's range-slice silently collapses a single-element
# result down to a plain string, and splatting a *string* with @cmdArgs
# explodes it character-by-character instead of passing it as one argument
# -- which is exactly how `mvn test` became `mvn t e s t` and failed with
# "Unknown lifecycle phase 't'". Always keep this wrapped in @().
$cmdArgs = @()
if ($Command.Length -gt 1) {
    $cmdArgs = @($Command[1..($Command.Length - 1)])
}

& $exe @cmdArgs 2>&1 | Tee-Object -FilePath $logFile
$exitCode = $LASTEXITCODE

Write-Host "----------------------------------------"
Write-Host "Exit code: $exitCode"
Write-Host "Log saved to: $logFile"
Write-Host "Upload that .log file to Claude if something failed."
