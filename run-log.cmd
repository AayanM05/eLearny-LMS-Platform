@echo off
rem Helper batch script for Windows CMD to invoke PowerShell run-log.ps1
powershell -ExecutionPolicy Bypass -File "%~dp0run-log.ps1" %*
