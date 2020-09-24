#!/bin/sh
# Public domain
# http://unlicense.org/
# Created by Grigore Stefan <g_stefan@yahoo.com>

if ! [ -d "source/build-sdk" ]; then
	echo "Error: Build SDK not found"
	exit 1
fi

POPD=$PWD
cd source/build-sdk
/bin/sh -- ./build.sh $1 $2
cd $POPD
