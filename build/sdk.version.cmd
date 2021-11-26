@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

call .\build\sdk.config.cmd

echo - %BUILD_PROJECT% ^> version

if "%XYO_SDK_SOURCE%" == "" set XYO_SDK_SOURCE=source

goto cmdXDefined
:cmdX
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo "Error: %ACTION%"
exit 1
:cmdXDefined

goto getVersionDefined
:getVersion
set PROJECT=%1
if not exist version.ini echo Error - no version info - %1 && exit 1
FOR /F "tokens=* USEBACKQ" %%F IN (`xyo-version --get`) DO (
	SET VERSION=%%F
)
goto:eof
:getVersionDefined

goto setReleaseVersionDefined
:setReleaseVersion
pushd %XYO_SDK_SOURCE%\%1
call :getVersion %1
if errorlevel 1 echo Error: %1 not found && popd && exit 1
popd
echo %1,%VERSION%>>%XYO_SDK_RELEASE%
goto:eof
:setReleaseVersionDefined

if not exist release mkdir release

call :cmdX call :getVersion xyo-sdk
set XYO_SDK_RELEASE=release\xyo-sdk-%VERSION%.csv

type NUL > %XYO_SDK_RELEASE%

for /F "eol=# tokens=1" %%i in (%XYO_SDK_SOURCE%\build-sdk\source\windows.txt) do call :setReleaseVersion %%i
