#!/bin/sh
# Public domain
# http://unlicense.org/
# Created by Grigore Stefan <g_stefan@yahoo.com>

[ -d repository ] || mkdir -p repository
POPD=$PWD
cd repository
XYO_PATH_REPOSITORY=$PWD
cd $POPD
export XYO_PATH_REPOSITORY


[ -d release ] || mkdir -p release
POPD=$PWD
cd release
XYO_PATH_RELEASE=$PWD
cd $POPD
export XYO_PATH_RELEASE

if [ -d "source/build-sdk" ]; then
	POPD=$PWD
	cd source/build-sdk
	. ./build.ubuntu.sh $1
	cd $POPD
	exit 0
else
	echo "Error: build-sdk not found"
	exit 1
fi
