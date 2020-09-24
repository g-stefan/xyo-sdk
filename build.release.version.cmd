@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

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
if not exist source\%PROJECT%.version.ini goto getVersionVendor
FOR /F "tokens=* USEBACKQ" %%F IN (`xyo-version --no-bump --get "--version-file=source\%PROJECT%.version.ini" %PROJECT%`) DO (
	SET VERSION=%%F
)
goto:eof
:getVersionVendor
set PROJECT=%1
SET PROJECT_VENDOR=%PROJECT:vendor-=%
if not exist %PROJECT_VENDOR%.version.ini echo "Error - no version info" & exit 1
FOR /F "tokens=* USEBACKQ" %%F IN (`xyo-version --no-bump --get "--version-file=%PROJECT_VENDOR%.version.ini" %PROJECT_VENDOR%`) DO (
	SET VERSION=%%F
)
goto:eof
:getVersionDefined

goto setReleaseVersionDefined
:setReleaseVersion
pushd source\%1
call :getVersion %1
if errorlevel 1 echo Error: %1 not found && popd && exit 1
popd
echo %1-%VERSION%>>%XYO_SDK_RELEASE%
goto:eof
:setReleaseVersionDefined

if not exist release mkdir release

call :cmdX call :getVersion xyo-sdk
set XYO_SDK_RELEASE=release\xyo-sdk-%VERSION%.csv

for /F "eol=# tokens=1" %%i in (source\build-sdk\source\windows.txt) do call :setReleaseVersion %%i

