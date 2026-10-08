#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2020-2026 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

sudo apt-get -y install build-essential
sudo apt-get -y install git
sudo apt-get -y install cmake
sudo apt-get -y install zlib1g-dev
sudo apt-get -y install libbz2-dev
sudo apt-get -y install libpng-dev
sudo apt-get -y install libxml2-dev
sudo apt-get -y install libxslt1-dev
sudo apt-get -y install rsync

RELEASE=`cat /etc/lsb-release | grep DISTRIB_RELEASE| cut -d "=" -f 2`

# 7z: p7zip-full up to 22.04, the 7zip package from 24.04 (p7zip is gone in 26.04)
case "$RELEASE" in
	18.04|20.04|22.04)
		sudo apt-get -y install p7zip-full
		;;
	*)
		sudo apt-get -y install 7zip
		;;
esac

if [ "$RELEASE" = "18.04" ]; then
	sudo apt-get -y install libssl1.0-dev
else
	sudo apt-get -y install libssl-dev
fi
