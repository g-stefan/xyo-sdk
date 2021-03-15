#!/bin/sh
# Public domain
# http://unlicense.org/
# Created by Grigore Stefan <g_stefan@yahoo.com>

if [ "$XYO_SDK_SOURCE" = "" ]; then
	XYO_SDK_SOURCE=source
fi

if [ "$1" = "setup" ]; then
	if [ -f "./build/setup/$2.sh" ]; then
		/bin/sh -- ./build/setup/$2.sh
		RETV=$?
		if [ "$RETV" = "1" ]; then
			exit 1
		fi
		exit 0
	fi
	echo "Error: unknown setup $2"
	exit 1
fi

if [ "$1" = "update" ]; then
	/bin/sh -- ./build/update/ubuntu.sh
	RETV=$?
	if [ "$RETV" = "1" ]; then
		exit 1
	fi
	exit 0
fi

if ! [ -d "$XYO_SDK_SOURCE/build-sdk" ]; then
	echo "Error: Build SDK not found"
	exit 1
fi

POPD=$PWD
cd $XYO_SDK_SOURCE/build-sdk
/bin/sh -- ./build.sh $1 $2
cd $POPD
