@echo off
pushd %~dp0
SETLOCAL
set NODE_SKIP_PLATFORM_CHECK=1
cd dependencies
node.exe updateCheck.js https://raw.githubusercontent.com/BoringBoredom/Linpack-Extended/master/dependencies/version
node.exe linpack.js
pause