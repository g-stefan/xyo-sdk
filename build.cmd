@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

if "%XYO_SDK_SOURCE%" == "" set XYO_SDK_SOURCE=source

if not exist %XYO_SDK_SOURCE%\build-sdk\build.cmd echo Error: Build SDK not found&& exit 1

pushd "%XYO_SDK_SOURCE%\build-sdk"
cmd.exe /C "build.cmd %1 %2"
popd
