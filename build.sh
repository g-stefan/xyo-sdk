#!/bin/sh
# Public domain
# http://unlicense.org/
# Created by Grigore Stefan <g_stefan@yahoo.com>

if [ "$XYO_SDK_SOURCE" = "" ]; then
	XYO_SDK_SOURCE=source
fi

if ! [ -d "$XYO_SDK_SOURCE/build-sdk" ]; then
	echo "Error: Build SDK not found"
	exit 1
fi

POPD=$PWD
cd $XYO_SDK_SOURCE/build-sdk
/bin/sh -- ./build.sh $1 $2
cd $POPD
