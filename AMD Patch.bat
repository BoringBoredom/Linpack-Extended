@echo off
pushd %~dp0
SETLOCAL
set NODE_SKIP_PLATFORM_CHECK=1
cd dependencies
node\node.exe amdPatch.js