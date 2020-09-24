@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

if not exist source\build-sdk\build.cmd echo Error: Build SDK not found&& exit 1

pushd "source\build-sdk"
cmd.exe /C "build.cmd %1 %2"
popd
