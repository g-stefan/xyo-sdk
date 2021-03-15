@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

SETLOCAL ENABLEDELAYEDEXPANSION

echo -^> github-release-check xyo-sdk

set PROJECT=xyo-sdk
if not exist version.ini echo "Error - no version info" & goto cmdReleaseError
FOR /F "tokens=* USEBACKQ" %%F IN (`xyo-version --no-bump --get "--version-file=version.ini" %PROJECT%`) DO (
	SET VERSION=%%F
)

github-release info --repo %PROJECT% --tag v%VERSION%
