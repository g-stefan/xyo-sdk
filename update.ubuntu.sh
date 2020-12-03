#!/bin/sh
# Public domain
# http://unlicense.org/
# Created by Grigore Stefan <g_stefan@yahoo.com>

if [ "$XYO_SDK_SOURCE" = "" ]; then
	XYO_SDK_SOURCE=source
fi

download(){
	if [ -n "$1" ]; then
		echo "-> $1"
		if [ -d "$XYO_SDK_SOURCE/$1" ]; then
			POPD=$PWD
			cd $XYO_SDK_SOURCE/$1
			git pull
			cd $POPD
		else
			POPD=$PWD
			cd $XYO_SDK_SOURCE
			git clone --depth=1 https://github.com/g-stefan/$1
			cd $POPD
		fi
	fi
}

[ -d $XYO_SDK_SOURCE ] || mkdir -p $XYO_SDK_SOURCE

{ <"util/common.txt" tr -d "\r"; echo; } | while read -r line; do
	case "$line" in
		\#*) continue ;;
	esac
	download $line
done

{ <"util/ubuntu.txt" tr -d "\r"; echo; } | while read -r line; do
	case "$line" in
		\#*) continue ;;
	esac
	download $line
done

{ <"$XYO_SDK_SOURCE/build-sdk/source/ubuntu.txt" tr -d "\r"; echo; } | while read -r line; do
	case "$line" in
		\#*) continue ;;
	esac
	download $line
done
