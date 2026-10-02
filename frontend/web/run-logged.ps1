# PowerShell Logging Script for frontend/web sub-directory
param(
    [Parameter(Mandatory=$true, ValueFromRemainingArguments=$true)]
    [string[]]$Command
)

# Invoke the master script in scripts/run-logged.ps1
$MasterScript = Join-Path $PSScriptRoot "..\..\scripts\run-logged.ps1"
if (Test-Path $MasterScript) {
    & $MasterScript @Command
} else {
    Write-Host "Error: Cannot find master script at $MasterScript" -ForegroundColor Red
    exit 1
}
