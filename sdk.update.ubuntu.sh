#!/bin/sh
# Public domain
# http://unlicense.org/
# Created by Grigore Stefan <g_stefan@yahoo.com>

download(){
	if [ -n "$1" ]; then
		echo "-> $1"
		if [ -d "source/$1" ]; then
			POPD=$PWD
			cd source/$1
			git pull
			cd $POPD
		else
			POPD=$PWD
			cd source
			git clone --depth=1 https://github.com/g-stefan/$1
			cd $POPD
		fi
	fi
}

[ -d source ] || mkdir -p source

{ <"xyo-sdk.source.ubuntu.txt" tr -d "\r"; echo; } | while read -r line; do
	case "$line" in
		\#*) continue ;;
	esac
	download $line
done

{ <"source/build-sdk/build-sdk.source.ubuntu.txt" tr -d "\r"; echo; } | while read -r line; do
	case "$line" in
		\#*) continue ;;
	esac
	download $line
done

{ <"xyo-sdk.source.common.txt" tr -d "\r"; echo; } | while read -r line; do
	case "$line" in
		\#*) continue ;;
	esac
	download $line
done
