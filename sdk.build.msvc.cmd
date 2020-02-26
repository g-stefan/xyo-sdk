@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

if not exist repository\ mkdir repository
pushd repository
set XYO_PATH_REPOSITORY=%CD%
popd

if not exist release\ mkdir release
pushd release
set XYO_PATH_RELEASE=%CD%
popd

if  exist source\build-sdk\ goto build
echo "Error: build-sdk not found"
exit 1
:build

pushd source\build-sdk
call build.msvc.cmd %1 %2
if errorlevel 1 goto BuildStepError
goto BuildStepDone

:BuildStepError
popd
exit 1
:BuildStepDone
popd
