@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

if not "%XYO_PATH_SDK%"=="" goto run

if exist "C:\Program Files\Git\bin\" goto step
echo "Error: Git not found on "C:\Program Files\Git\bin"
goto :eof

:step
set PATH=C:\Program Files\Git\bin;%PATH%
goto run

:download
if "%1" == "" goto :eof
echo -^> %1
if exist source\%1\ ( call :git_update %1 ) else ( call :git_clone %1 )
goto :eof
:git_update
pushd source\%1
git pull
popd
goto :eof
:git_clone
pushd source
git clone --depth=1 https://github.com/g-stefan/%1
popd
goto :eof

:run
if not exist source\ mkdir source

for /F "eol=# tokens=1" %%i in (xyo-sdk.source.win.txt) do call :download %%i
for /F "eol=# tokens=1" %%i in (source\build-sdk\build-sdk.source.windows.txt) do call :download %%i
for /F "eol=# tokens=1" %%i in (source\build-sdk\build-sdk.source.windows.optional.txt) do call :download %%i
for /F "eol=# tokens=1" %%i in (xyo-sdk.source.common.txt) do call :download %%i
