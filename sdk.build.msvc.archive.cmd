@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

set PROJECT=xyo-sdk

SETLOCAL ENABLEDELAYEDEXPANSION
FOR /F "tokens=* USEBACKQ" %%F IN (`xyo-version --no-bump --get "--version-file=%PROJECT%.version.ini" %PROJECT%`) DO (
	SET VERSION=%%F
)

set PROJECT_ARCHIVE=%PROJECT%-%VERSION%-%XYO_PLATFORM%

if exist archive/%PROJECT_ARCHIVE%.7z del /Q /F archive\%PROJECT_ARCHIVE%.7z

move repository %PROJECT_ARCHIVE%
%PROJECT_ARCHIVE%\bin\7zr a -mx9 -mmt4 -r -sse -w. -y -t7z archive/%PROJECT_ARCHIVE%.7z %PROJECT_ARCHIVE%
move %PROJECT_ARCHIVE% repository
