@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

if "%XYO_SDK_SOURCE%" == "" set XYO_SDK_SOURCE=source

if "%1" == "setup" goto:eof

if not "%1" == "update" goto SkipUpdate
cmd.exe /C "build\update\msvc.cmd"
if errorlevel 1 exit 1
goto:eof
:SkipUpdate

if not exist ".\build\%1.%2.cmd" goto SkipLocal
cmd.exe /C ".\build\%1.%2.cmd"
if errorlevel 1 exit 1
goto:eof
:SkipLocal

if not exist %XYO_SDK_SOURCE%\build-sdk\build.cmd echo Error: Build SDK not found&& exit 1

pushd "%XYO_SDK_SOURCE%\build-sdk"
cmd.exe /C "build.cmd %1 %2"
popd
