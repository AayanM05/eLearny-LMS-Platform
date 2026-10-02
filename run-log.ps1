# PowerShell Logging Script for eLearny Monorepo
param (
    [Parameter(Mandatory=$false, ValueFromRemainingArguments=$true)]
    [string[]]$CommandArgs
)

if (-not $CommandArgs -or $CommandArgs.Count -eq 0) {
    Write-Host "Usage: .\run-log.ps1 <command> [args...]" -ForegroundColor Yellow
    Write-Host "Example: .\run-log.ps1 mvn test" -ForegroundColor Cyan
    Write-Host "Example: .\run-log.ps1 npm run build:web" -ForegroundColor Cyan
    exit 1
}

$FullCommand = $CommandArgs -join " "

# Ensure logs folder exists
$LogsDir = Join-Path $PSScriptRoot "logs"
if (-not (Test-Path $LogsDir)) {
    New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null
}

# Create timestamp and filename
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$SanitizedCmd = $FullCommand -replace '[^a-zA-Z0-9\-_]', '_' -replace '_+', '_'
if ($SanitizedCmd.Length -gt 35) {
    $SanitizedCmd = $SanitizedCmd.Substring(0, 35)
}

$LogFileName = "$Timestamp`_$SanitizedCmd.log"
$LogFilePath = Join-Path $LogsDir $LogFileName

$StartTime = Get-Date
$FormattedDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Header
Add-Content -Path $LogFilePath -Value "================================================================================"
Add-Content -Path $LogFilePath -Value "COMMAND LOG RECORD"
Add-Content -Path $LogFilePath -Value "Command          : $FullCommand"
Add-Content -Path $LogFilePath -Value "Execution Time   : $FormattedDate"
Add-Content -Path $LogFilePath -Value "Working Dir      : $PSScriptRoot"
Add-Content -Path $LogFilePath -Value "Log File         : $LogFilePath"
Add-Content -Path $LogFilePath -Value "================================================================================"
Add-Content -Path $LogFilePath -Value ""

Write-Host "Executing command with live logging..." -ForegroundColor Green
Write-Host "Logging output to: logs\$LogFileName" -ForegroundColor Yellow

# Execute command live
$ExitCode = 0
try {
    Invoke-Expression "$FullCommand 2>&1" | Tee-Object -FilePath $LogFilePath -Append
    if ($null -ne $LASTEXITCODE) {
        $ExitCode = $LASTEXITCODE
    }
} catch {
    Write-Host "Execution error: $_" -ForegroundColor Red
    Add-Content -Path $LogFilePath -Value "ERROR: $_"
    $ExitCode = 1
}

$EndTime = Get-Date
$Duration = $EndTime - $StartTime
$DurationStr = "{0:D2}:{1:D2}:{2:D2}.{3:D3}" -f $Duration.Hours, $Duration.Minutes, $Duration.Seconds, $Duration.Milliseconds
$CompletedDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Footer
Add-Content -Path $LogFilePath -Value ""
Add-Content -Path $LogFilePath -Value "================================================================================"
Add-Content -Path $LogFilePath -Value "EXECUTION SUMMARY"
Add-Content -Path $LogFilePath -Value "Exit Code        : $ExitCode"
Add-Content -Path $LogFilePath -Value "Completed At     : $CompletedDate"
Add-Content -Path $LogFilePath -Value "Total Duration   : $DurationStr"
Add-Content -Path $LogFilePath -Value "================================================================================"

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "Exit Code        : $ExitCode" -ForegroundColor Yellow
Write-Host "Completed At     : $CompletedDate" -ForegroundColor Cyan
Write-Host "Total Duration   : $DurationStr" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan

exit $ExitCode
