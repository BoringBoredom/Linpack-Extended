@echo off
pushd %~dp0
SETLOCAL
set NODE_SKIP_PLATFORM_CHECK=1
cd dependencies
node\node.exe updateCheck.js https://raw.githubusercontent.com/BoringBoredom/Linpack-Extended/master/dependencies/version
timeout /t 3
node\node.exe linpack.js
pause