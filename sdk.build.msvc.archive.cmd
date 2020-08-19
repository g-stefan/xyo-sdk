@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

set PROJECT=xyo-sdk

SETLOCAL ENABLEDELAYEDEXPANSION
FOR /F "tokens=* USEBACKQ" %%F IN (`xyo-version --no-bump --get "--version-file=%PROJECT%.version.ini" %PROJECT%`) DO (
	SET VERSION=%%F
)

if exist archive/%PROJECT%-%VERSION%.%XYO_PLATFORM%.7z del /Q /F archive\%PROJECT%-%VERSION%.%XYO_PLATFORM%.7z

move repository %PROJECT%-%VERSION%.%XYO_PLATFORM%
%PROJECT%-%VERSION%.%XYO_PLATFORM%\bin\7zr a -mx9 -mmt4 -r -sse -w. -y -t7z archive/%PROJECT%-%VERSION%.%XYO_PLATFORM%.7z %PROJECT%-%VERSION%.%XYO_PLATFORM%
move %PROJECT%-%VERSION%.%XYO_PLATFORM% repository
