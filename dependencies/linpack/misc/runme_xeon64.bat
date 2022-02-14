@echo off
rem ============================================================================
rem Copyright 2001-2021 Intel Corporation.
rem
rem This software  and the related  documents  are Intel  copyrighted materials,
rem and your use  of them is  governed by the express  license under  which they
rem were provided to you (License).  Unless the License provides otherwise,  you
rem may not use,  modify,  copy, publish,  distribute, disclose or transmit this
rem software or the related documents without Intel's prior written permission.
rem
rem This software and the related documents are provided as is,  with no express
rem or implied warranties,  other  than those that  are expressly  stated in the
rem License.
rem ============================================================================

echo This is a SAMPLE run script for running a shared-memory version of
echo Intel(R) Distribution for LINPACK* Benchmark. Change it to refect
echo the correct number of CPUs/threads, problem input files, etc..
echo *Other names and brands may be claimed as the property of others.

SETLOCAL

rem Setting path to OpenMP library
set PATH=..\..\..\redist\intel64\compiler;%PATH%
set PATH=..\..\..\redist\intel64_win\compiler;%PATH%
rem Setting up affinity for better threading performance
set KMP_AFFINITY=nowarnings,compact,1,0,granularity=fine

date /t
time /t

echo Running linpack_xeon64.exe. Output could be found in win_xeon64.txt.
linpack_xeon64.exe lininput_xeon64 > win_xeon64.txt

date /t >> win_xeon64.txt
time /t >> win_xeon64.txt

echo    Done:
date /t
time /t

ENDLOCAL
