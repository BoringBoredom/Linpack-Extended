@echo off
SETLOCAL
set NODE_SKIP_PLATFORM_CHECK=1
cd dependencies
node.exe linpack.js
pause